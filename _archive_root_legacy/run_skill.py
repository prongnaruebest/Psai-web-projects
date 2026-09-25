#!/usr/bin/env python3
"""
Personal Codex Custom Skill CLI Runner & Schema Validator
Part of Personal Codex 101-102 (Module 9 & Module 12)

Supported Skills:
1. stm32-firmware-reviewer: Audits C source files for NVIC, DMA, and MISRA-C defects
2. kicad-pcb-reviewer: Audits PCB layout logs against IPC-2221A clearance & high-speed rules
3. modbus-diagnostic: Audits Modbus RTU/TCP packet stream and isolates communication faults

Usage:
  py run_skill.py --skill stm32-firmware-reviewer --file my_code.c
  py run_skill.py --skill kicad-pcb-reviewer --file pcb_drc.rpt
  py run_skill.py --skill modbus-diagnostic --file packets.log
"""

import sys
import os
import re
import json
import argparse
import datetime

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def calc_modbus_crc16(byte_array):
    """Calculates Modbus RTU CRC-16 (ANSI 0xA001)"""
    crc = 0xFFFF
    for byte in byte_array:
        crc ^= byte
        for _ in range(8):
            if (crc & 0x0001) != 0:
                crc >>= 1
                crc ^= 0xA001
            else:
                crc >>= 1
    low = crc & 0xFF
    high = (crc >> 8) & 0xFF
    return low, high

def audit_stm32_firmware(content, filename):
    lines = content.splitlines()
    issues = []

    in_isr = False
    isr_name = ""

    timer_priority = None
    estop_priority = None

    for idx, line in enumerate(lines, 1):
        # Detect ISR
        if re.search(r'void\s+(\w+IRQHandler|\w+_ISR)\s*\(', line):
            in_isr = True
            isr_name = line.strip()
        elif in_isr and line.strip().startswith('}'):
            in_isr = False

        # Rule: EMB-SAFE-02 (Blocking delay in ISR)
        if in_isr and re.search(r'\b(HAL_Delay|delay_ms|sleep)\s*\(', line):
            issues.append({
                "line_number": idx,
                "rule_id": "EMB-SAFE-02",
                "severity": "CRITICAL",
                "code_snippet": line.strip(),
                "description": f"Blocking delay inside interrupt handler '{isr_name}'. Causes deadlock if priority >= SysTick.",
                "remediation_plan": "Replace blocking delay with a non-blocking hardware timer flag or state machine tick."
            })

        # Rule: EMB-MEM-01 (Missing volatile on buffer)
        if re.search(r'(dma|adc|rx|tx)_buffer\s*\[', line, re.IGNORECASE):
            if "volatile" not in line:
                issues.append({
                    "line_number": idx,
                    "rule_id": "EMB-MEM-01",
                    "severity": "MAJOR",
                    "code_snippet": line.strip(),
                    "description": "Hardware buffer shared with DMA/ISR lacks 'volatile' qualifier.",
                    "remediation_plan": "Add 'volatile' qualifier (e.g., 'volatile uint16_t adc_buffer[128];') to prevent compiler register caching."
                })

        # Detect Priority configuration
        m_pri = re.search(r'NVIC_SetPriority\s*\(\s*(\w+)\s*,\s*(\d+)\s*\)', line)
        if m_pri:
            irq, pri = m_pri.group(1), int(m_pri.group(2))
            if "TIM" in irq:
                timer_priority = pri
            if "EXTI" in irq:
                estop_priority = pri

    # Rule: EMB-SAFE-01 (Priority inversion)
    if timer_priority is not None and estop_priority is not None:
        if timer_priority < estop_priority:
            issues.append({
                "line_number": 1,
                "rule_id": "EMB-SAFE-01",
                "severity": "CRITICAL",
                "code_snippet": f"Timer Priority: {timer_priority}, E-Stop Priority: {estop_priority}",
                "description": f"Safety E-Stop (EXTI={estop_priority}) has lower NVIC priority than Timer PWM ({timer_priority}).",
                "remediation_plan": "Assign Preemption Priority 0 to EXTI E-stop interlock (IEC 60204-1 requirement)."
            })

    total_defects = len(issues)
    has_critical = any(i["severity"] == "CRITICAL" for i in issues)
    overall_status = "CRITICAL_FAIL" if has_critical else ("WARNING_REVIEW_REQUIRED" if total_defects > 0 else "PASS")

    return {
        "audit_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "file_audited": filename,
        "overall_status": overall_status,
        "total_defects_found": total_defects,
        "issues": issues,
        "human_gate_required": has_critical
    }

def audit_kicad_pcb(content, filename):
    lines = content.splitlines()
    violations = []

    for idx, line in enumerate(lines, 1):
        # Check clearance
        m_clr = re.search(r'Clearance violation.*?net\s+([+\w]+).*?actual\s+([\d.]+)\s*mm.*?required\s+([\d.]+)\s*mm', line, re.IGNORECASE)
        if m_clr:
            net, actual, req = m_clr.group(1), m_clr.group(2), m_clr.group(3)
            violations.append({
                "rule_id": "IPC-CLR-01",
                "severity": "CRITICAL" if float(actual) < 0.20 else "MAJOR",
                "net_name": net,
                "layer": "F.Cu / B.Cu",
                "coordinates": f"Line {idx}",
                "measured_value": f"{actual} mm",
                "required_value": f"{req} mm",
                "remediation_action": "Reroute copper trace to enforce minimum creepage/clearance per IPC-2221A Table 6-1."
            })

        # Check split plane
        if re.search(r'split\s+ground\s+plane|crosses\s+plane\s+cut', line, re.IGNORECASE):
            violations.append({
                "rule_id": "IPC-DIFF-01",
                "severity": "CRITICAL",
                "net_name": "USB_D+ / USB_D-",
                "layer": "In1.Cu",
                "coordinates": f"Line {idx}",
                "measured_value": "Split crossing detected",
                "required_value": "Continuous reference ground",
                "remediation_action": "Bridge ground split or relocate differential pair to preserve return path impedance."
            })

        # Check decoupling distance
        m_dec = re.search(r'Decoupling\s+cap.*?distance\s+([\d.]+)\s*mm', line, re.IGNORECASE)
        if m_dec:
            dist = float(m_dec.group(1))
            if dist > 2.5:
                violations.append({
                    "rule_id": "IPC-PWR-01",
                    "severity": "MAJOR",
                    "net_name": "+3V3_MCU",
                    "layer": "Top Layer",
                    "coordinates": f"Line {idx}",
                    "measured_value": f"{dist} mm",
                    "required_value": "< 2.5 mm",
                    "remediation_action": "Move 0.1uF capacitor directly adjacent to VDD pin with low-inductance via."
                })

    has_crit = any(v["severity"] == "CRITICAL" for v in violations)
    verdict = "FABRICATION_HOLD" if has_crit else ("CHANGES_REQUESTED" if violations else "PASS")

    return {
        "project_name": os.path.basename(filename),
        "audit_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "overall_verdict": verdict,
        "total_violations": len(violations),
        "violations": violations,
        "pe_signoff_required": len(violations) > 0
    }

def audit_modbus_stream(content, filename):
    lines = [l.strip() for l in content.splitlines() if l.strip() and not l.strip().startswith("#")]
    anomalies = []
    total_requests = 0
    valid_responses = 0
    crc_errors = 0
    timeouts = 0

    for idx, raw_line in enumerate(lines, 1):
        total_requests += 1
        clean_hex = raw_line.replace("0x", "").replace(",", " ").split()
        if len(clean_hex) < 4:
            continue
        try:
            byte_vals = [int(b, 16) for b in clean_hex]
        except ValueError:
            continue

        pdu = byte_vals[:-2]
        rx_lo, rx_hi = byte_vals[-2], byte_vals[-1]
        exp_lo, exp_hi = calc_modbus_crc16(pdu)

        slave_id = pdu[0]
        fc = pdu[1]

        if (rx_lo, rx_hi) != (exp_lo, exp_hi):
            crc_errors += 1
            # Check for big-endian transposition
            endian_swap = (rx_lo, rx_hi) == (exp_hi, exp_lo)
            anomalies.append({
                "rule_id": "MB-CRC-01",
                "severity": "CRITICAL",
                "raw_bytes": " ".join(f"{b:02X}" for b in byte_vals),
                "detail": "CRC Endianness Inverted (Big-Endian received)" if endian_swap else f"Checksum mismatch: received {rx_lo:02X} {rx_hi:02X}, expected {exp_lo:02X} {exp_hi:02X}",
                "action": "Ensure RS-485 line has 120 Ohm termination and transmit CRC Low-byte first."
            })
        else:
            valid_responses += 1

        # Check for exception code (MSB = 1)
        if fc >= 0x80:
            ex_code = pdu[2] if len(pdu) > 2 else 0x00
            anomalies.append({
                "rule_id": "MB-EXC-01",
                "severity": "MAJOR",
                "raw_bytes": " ".join(f"{b:02X}" for b in byte_vals),
                "detail": f"Slave returned exception response: FC 0x{fc:02X}, Exception Code 0x{ex_code:02X}",
                "action": "Check PLC register range and ensure slave memory block is allocated."
            })

    health = "BUS_FAULT" if crc_errors > 0 else ("DEGRADED" if anomalies else "HEALTHY")
    crc_status = "INVALID_CHECKSUM" if crc_errors > 0 else "VALID"

    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "bus_type": "MODBUS_RTU",
        "slave_id": 1,
        "function_code": 3,
        "overall_health": health,
        "crc_status": crc_status,
        "detected_anomalies": anomalies,
        "telemetry_summary": {
            "requests_sent": total_requests,
            "valid_responses": valid_responses,
            "crc_errors": crc_errors,
            "timeouts": timeouts,
            "exception_rate_pct": round((len(anomalies) / max(total_requests, 1)) * 100, 2)
        },
        "watchdog_tripped": health == "BUS_FAULT"
    }

def main():
    parser = argparse.ArgumentParser(description="Personal Codex Custom Skill Runner")
    parser.add_argument("--skill", required=True, choices=["stm32-firmware-reviewer", "kicad-pcb-reviewer", "modbus-diagnostic"])
    parser.add_argument("--file", required=True, help="Target file to audit")
    parser.add_argument("--json", action="store_true", help="Output raw JSON conforming to schema")
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"[ERROR] File not found: {args.file}", file=sys.stderr)
        sys.exit(2)

    with open(args.file, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    if args.skill == "stm32-firmware-reviewer":
        result = audit_stm32_firmware(content, args.file)
    elif args.skill == "kicad-pcb-reviewer":
        result = audit_kicad_pcb(content, args.file)
    elif args.skill == "modbus-diagnostic":
        result = audit_modbus_stream(content, args.file)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print("=" * 65)
        print(f" PERSONAL CODEX SKILL AUDIT: {args.skill.upper()}")
        print(f" Target File: {args.file}")
        print("=" * 65)
        print(json.dumps(result, indent=2))

    # Exit code: 1 if critical issues found, 0 if clean
    if args.skill == "stm32-firmware-reviewer":
        if result["overall_status"] == "CRITICAL_FAIL":
            sys.exit(1)
    elif args.skill == "kicad-pcb-reviewer":
        if result["overall_verdict"] == "FABRICATION_HOLD":
            sys.exit(1)
    elif args.skill == "modbus-diagnostic":
        if result["overall_health"] == "BUS_FAULT":
            sys.exit(1)

    sys.exit(0)

if __name__ == "__main__":
    main()

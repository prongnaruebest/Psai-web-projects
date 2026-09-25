#!/usr/bin/env python3
"""
AI Pre-commit Security & MISRA Linter for Embedded Systems
Part of Personal Codex 101-102 (Module 11 & Module 12 Implementation)

Usage:
  py ai_precommit_security_linter.py <path_to_c_file>
  py ai_precommit_security_linter.py --all

Exit Codes:
  0 = Audit Passed (No Critical/Major defects)
  1 = Audit Failed (Defects detected, blocking git commit)
"""

import sys
import re
import os

RULES = [
    {
        "id": "EMB-SAFE-01",
        "severity": "CRITICAL",
        "title": "Safety Interlock Priority Inversion",
        "desc": "Timer or peripheral interrupt configured with higher NVIC priority (lower number) than Emergency Stop EXTI."
    },
    {
        "id": "EMB-SAFE-02",
        "severity": "CRITICAL",
        "title": "Blocking Delay in Interrupt Handler",
        "desc": "Calling HAL_Delay() or busy loops inside an ISR causes Deadlock."
    },
    {
        "id": "EMB-MEM-01",
        "severity": "MAJOR",
        "title": "Missing volatile on Shared DMA/ADC Buffer",
        "desc": "DMA or ADC shared memory array lacks volatile qualifier."
    },
    {
        "id": "SEC-CRED-01",
        "severity": "CRITICAL",
        "title": "Hardcoded Secret / Password Detected",
        "desc": "Hardcoded password, token, or secret key found in source code."
    }
]

def scan_file(filepath):
    if not os.path.exists(filepath):
        print(f"[ERR] File not found: {filepath}")
        return False, []

    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    violations = []
    in_isr = False
    timer_prio, timer_line = -1, -1
    estop_prio, estop_line = -1, -1

    secret_pattern = re.compile(r'(password|passwd|secret|token|api_key)\s*=\s*["\'][^"\']+["\']', re.IGNORECASE)
    nvic_pattern = re.compile(r'NVIC_SetPriority\s*\(\s*(\w+)\s*,\s*(\d+)\s*\)')

    for idx, raw_line in enumerate(lines):
        line_num = idx + 1
        line = raw_line.strip()

        if '_IRQHandler' in line or 'ISR(' in line:
            in_isr = True
        if in_isr and '}' in line and '{' not in line:
            in_isr = False

        # Check HAL_Delay in ISR
        if in_isr and ('HAL_Delay' in line or 'delay_ms' in line):
            violations.append({
                "file": filepath,
                "line": line_num,
                "rule": "EMB-SAFE-02",
                "severity": "CRITICAL",
                "detail": line
            })

        # Check volatile on DMA buffers
        if ('adc' in line.lower() or 'dma' in line.lower()) and ('[' in line and ']' in line):
            if not line.startswith('//') and not line.startswith('/*') and 'volatile' not in line:
                if any(t in line for t in ['uint', 'int', 'float']):
                    violations.append({
                        "file": filepath,
                        "line": line_num,
                        "rule": "EMB-MEM-01",
                        "severity": "MAJOR",
                        "detail": line
                    })

        # Check Priority Inversion
        m = nvic_pattern.search(line)
        if m:
            irq, prio = m.group(1), int(m.group(2))
            if 'TIM' in irq or 'PWM' in irq:
                timer_prio, timer_line = prio, line_num
            if 'EXTI' in irq or 'STOP' in irq:
                estop_prio, estop_line = prio, line_num

        # Check Hardcoded Secrets
        if secret_pattern.search(line):
            violations.append({
                "file": filepath,
                "line": line_num,
                "rule": "SEC-CRED-01",
                "severity": "CRITICAL",
                "detail": line
            })

    # Priority Inversion Check
    if timer_prio != -1 and estop_prio != -1 and timer_prio < estop_prio:
        violations.append({
            "file": filepath,
            "line": timer_line,
            "rule": "EMB-SAFE-01",
            "severity": "CRITICAL",
            "detail": f"Timer Priority ({timer_prio}) is higher than E-Stop Priority ({estop_prio})"
        })

    is_passed = len(violations) == 0
    return is_passed, violations

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    print("=" * 65)
    print(" AI PRE-COMMIT EMBEDDED SECURITY & MISRA LINTER")
    print(" Personal Codex 101-102 CI/CD Verification Engine")
    print("=" * 65)

    if len(sys.argv) < 2:
        test_file = "test_firmware_sample.c"
        with open(test_file, "w", encoding="utf-8") as f:
            f.write("""// Test Firmware Sample
#include "main.h"
uint16_t dma_rx_buffer[64];
const char* wifi_password = "InsecureSecret123";

void Init(void) {
    NVIC_SetPriority(TIM1_UP_TIM10_IRQn, 0);
    NVIC_SetPriority(EXTI15_10_IRQn, 2);
}

void TIM1_UP_TIM10_IRQHandler(void) {
    HAL_Delay(10);
}
""")
        files_to_scan = [test_file]
        print(f"[*] No file argument provided. Generating and scanning mock test file '{test_file}'...")
    else:
        files_to_scan = sys.argv[1:]

    total_violations = 0
    for target in files_to_scan:
        passed, v_list = scan_file(target)
        if passed:
            print(f"[PASS] {target}: No safety violations detected.")
        else:
            print(f"[FAIL] {target}: {len(v_list)} safety defects detected:")
            for v in v_list:
                print(f"   - [Line {v['line']}] {v['severity']}: {v['rule']} -> {v['detail']}")
            total_violations += len(v_list)

    print("-" * 65)
    if total_violations > 0:
        print(f"[REJECTED] {total_violations} defect(s) must be fixed before commit.")
        sys.exit(1)
    else:
        print("[APPROVED] All checks passed. Safe for production build.")
        sys.exit(0)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Master Engineering Test Runner & Verification Engine
Personal Codex 101-102 (Full System Verification)

Validates:
1. Modbus RTU CRC-16 (ANSI 0xA001) Algorithm & Test Vectors
2. Custom Skill JSON Schemas & Rules Integrity
3. AI Pre-commit Security Linter Execution & Exit Codes
4. Industrial Gateway Headless Simulation

Usage:
  py run_all_engineering_tests.py
"""

import sys
import json
import os
import subprocess

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def test_modbus_crc16():
    """Validates Modbus RTU CRC-16 against official test vectors"""
    def calc_crc16(byte_array):
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

    # Official Test Vector 1: [0x01, 0x03, 0x00, 0x01, 0x00, 0x03] -> Expected CRC: [0x54, 0x0B]
    v1 = [0x01, 0x03, 0x00, 0x01, 0x00, 0x03]
    lo1, hi1 = calc_crc16(v1)
    assert (lo1, hi1) == (0x54, 0x0B), f"Vector 1 Failed: Got {hex(lo1)}, {hex(hi1)}"

    # Official Test Vector 2: [0x01, 0x06, 0x00, 0x10, 0x00, 0x01] -> Expected CRC: [0x49, 0xCF]
    v2 = [0x01, 0x06, 0x00, 0x10, 0x00, 0x01]
    lo2, hi2 = calc_crc16(v2)
    assert (lo2, hi2) == (0x49, 0xCF), f"Vector 2 Failed: Got {hex(lo2)}, {hex(hi2)}"

    # Official Test Vector 3: Exception Response [0x01, 0x83, 0x02] -> Expected CRC: [0xC0, 0xF1]
    v3 = [0x01, 0x83, 0x02]
    lo3, hi3 = calc_crc16(v3)
    assert (lo3, hi3) == (0xC0, 0xF1), f"Vector 3 (Exception) Failed: Got {hex(lo3)}, {hex(hi3)}"

    return True

def test_json_assets():
    """Validates all Custom Skill JSON schemas and rules files"""
    paths = [
        ".codex/skills/stm32-firmware-reviewer/rules/misra_rules.json",
        ".codex/skills/stm32-firmware-reviewer/schemas/output.schema.json",
        ".codex/skills/kicad-pcb-reviewer/rules/ipc_rules.json",
        ".codex/skills/kicad-pcb-reviewer/schemas/pcb_output.schema.json",
        ".codex/skills/modbus-diagnostic/rules/modbus_rules.json",
        ".codex/skills/modbus-diagnostic/schemas/modbus_output.schema.json"
    ]
    for p in paths:
        if not os.path.exists(p):
            raise FileNotFoundError(f"Missing required file: {p}")
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
            assert isinstance(data, dict), f"Invalid JSON root in {p}"
    return len(paths)

def test_security_linter():
    """Runs test on ai_precommit_security_linter.py"""
    test_code = """#include "main.h"
uint16_t buffer[10];
void TIM1_UP_TIM10_IRQHandler(void) {
    HAL_Delay(5);
}
"""
    tmp_file = "test_linter_temp.c"
    with open(tmp_file, "w", encoding="utf-8") as f:
        f.write(test_code)

    try:
        res = subprocess.run([sys.executable, "ai_precommit_security_linter.py", tmp_file],
                             capture_output=True, text=True)
        # Should fail with exit code 1 because HAL_Delay in ISR is detected
        assert res.returncode == 1, "Linter should have rejected code with HAL_Delay in ISR"
        assert "EMB-SAFE-02" in res.stdout, "Linter output missing EMB-SAFE-02 rule ID"
    finally:
        if os.path.exists(tmp_file):
            os.remove(tmp_file)

    return True

def test_gateway_headless():
    """Verifies that industrial_gateway_simulator.py compiles and runs"""
    res = subprocess.run([sys.executable, "industrial_gateway_simulator.py"],
                         capture_output=True, text=True, timeout=10)
    assert res.returncode == 0, f"Gateway crashed: {res.stderr}"
    assert "INDUSTRIAL GATEWAY" in res.stdout, "Gateway header missing"
    return True

def test_skill_runner_cli():
    """Verifies run_skill.py CLI across skills"""
    # STM32 Skill Test
    c_code = "void TIM1_UP_TIM10_IRQHandler(void) { HAL_Delay(5); }"
    tmp_c = "temp_test_skill.c"
    with open(tmp_c, "w", encoding="utf-8") as f:
        f.write(c_code)
    try:
        res = subprocess.run([sys.executable, "run_skill.py", "--skill", "stm32-firmware-reviewer", "--file", tmp_c, "--json"],
                             capture_output=True, text=True)
        assert res.returncode == 1, "Should fail due to HAL_Delay in ISR"
        data = json.loads(res.stdout)
        assert data["overall_status"] == "CRITICAL_FAIL"
    finally:
        if os.path.exists(tmp_c):
            os.remove(tmp_c)

    # Modbus Skill Test
    modbus_log = "01 03 00 01 00 03 54 0B\n01 03 00 01 00 03 00 00\n"
    tmp_mb = "temp_test_mb.log"
    with open(tmp_mb, "w", encoding="utf-8") as f:
        f.write(modbus_log)
    try:
        res = subprocess.run([sys.executable, "run_skill.py", "--skill", "modbus-diagnostic", "--file", tmp_mb, "--json"],
                             capture_output=True, text=True)
        assert res.returncode == 1, "Should fail due to corrupted CRC"
        data = json.loads(res.stdout)
        assert data["overall_health"] == "BUS_FAULT"
    finally:
        if os.path.exists(tmp_mb):
            os.remove(tmp_mb)

    return True

def test_cortex_fault_decoder():
    """Validates ARM Cortex-M SCB->CFSR, HFSR, BFAR bitfield decoding logic"""
    def decode_fault(cfsr, hfsr, bfar=0):
        flags = []
        if cfsr & (1 << 1): flags.append("DACCVIOL")
        if cfsr & (1 << 7): flags.append("MMARVALID")
        if cfsr & (1 << 9): flags.append("PRECISERR")
        if cfsr & (1 << 15): flags.append("BFARVALID")
        if cfsr & (1 << 16): flags.append("UNDEFINSTR")
        if cfsr & (1 << 24): flags.append("UNALIGNED")
        if cfsr & (1 << 25): flags.append("DIVBYZERO")
        if hfsr & (1 << 30): flags.append("FORCED")
        return flags

    # Null pointer access (CFSR: 0x82, HFSR: 0x40000000)
    flags_null = decode_fault(0x00000082, 0x40000000)
    assert "DACCVIOL" in flags_null and "MMARVALID" in flags_null and "FORCED" in flags_null

    # Unaligned 32-bit access (CFSR: 0x01000000, HFSR: 0x40000000)
    flags_unalign = decode_fault(0x01000000, 0x40000000)
    assert "UNALIGNED" in flags_unalign and "FORCED" in flags_unalign

    # Bus Clock disabled access (CFSR: 0x00008200, HFSR: 0x40000000)
    flags_bus = decode_fault(0x00008200, 0x40000000, 0x40023800)
    assert "PRECISERR" in flags_bus and "BFARVALID" in flags_bus

    # Division by zero (CFSR: 0x02000000, HFSR: 0x40000000)
    flags_div = decode_fault(0x02000000, 0x40000000)
    assert "DIVBYZERO" in flags_div

    # Undefined instruction / stack overflow (CFSR: 0x00010000)
    flags_undef = decode_fault(0x00010000, 0x40000000)
    assert "UNDEFINSTR" in flags_undef

    return True

def test_canopen_cia402_vectors():
    """Validates CANopen COB-ID calculations and CiA 402 drive state machine decoding"""
    def get_cob_id(service, node_id):
        table = {
            "NMT": 0x000,
            "SYNC": 0x080,
            "EMCY": 0x080 + node_id,
            "TPDO1": 0x180 + node_id,
            "RPDO1": 0x200 + node_id,
            "SDO_TX": 0x580 + node_id,
            "SDO_RX": 0x600 + node_id,
            "HEARTBEAT": 0x700 + node_id
        }
        return table.get(service, 0)

    # Test COB-IDs for Node 5
    assert get_cob_id("NMT", 5) == 0x000
    assert get_cob_id("SYNC", 5) == 0x080
    assert get_cob_id("RPDO1", 5) == 0x205
    assert get_cob_id("TPDO1", 5) == 0x185
    assert get_cob_id("SDO_RX", 5) == 0x605
    assert get_cob_id("SDO_TX", 5) == 0x585
    assert get_cob_id("HEARTBEAT", 5) == 0x705

    # Test CiA 402 Statusword Decoding
    def decode_cia402_state(sw):
        m4f = sw & 0x004F
        m6f = sw & 0x006F
        if m4f == 0x0000: return "NOT_READY"
        if m4f == 0x0040: return "SWITCH_ON_DISABLED"
        if m6f == 0x0021: return "READY_TO_SWITCH_ON"
        if m6f == 0x0023: return "SWITCHED_ON"
        if m6f == 0x0027: return "OPERATION_ENABLED"
        if m6f == 0x0007: return "QUICK_STOP_ACTIVE"
        if m4f == 0x000F: return "FAULT_REACTION"
        if m4f == 0x0008: return "FAULT"
        return "UNKNOWN"

    assert decode_cia402_state(0x0040) == "SWITCH_ON_DISABLED"
    assert decode_cia402_state(0x0021) == "READY_TO_SWITCH_ON"
    assert decode_cia402_state(0x0023) == "SWITCHED_ON"
    assert decode_cia402_state(0x0237) == "OPERATION_ENABLED"
    assert decode_cia402_state(0x0217) == "QUICK_STOP_ACTIVE"
    assert decode_cia402_state(0x0008) == "FAULT"

    return True

def test_digital_pid_and_antiwindup_vectors():
    """Validates Discrete PID controller integration, clamping anti-windup, and tuning formulas"""
    import math

    # 1. Zero-Pole Cancellation Tuning Formulas
    # Motor parameters: L = 1.2 mH, R = 0.45 Ohm, Target BW = 1500 Hz
    L = 1.2e-3
    R = 0.45
    fc = 1500.0
    omega_c = 2 * math.pi * fc
    kp_expected = omega_c * L  # 2 * pi * 1500 * 1.2e-3 = 11.3097
    ki_expected = omega_c * R  # 2 * pi * 1500 * 0.45 = 4241.15
    assert abs(kp_expected - 11.31) < 0.05, f"Kp auto-tune mismatch: {kp_expected}"
    assert abs(ki_expected - 4241.15) < 1.0, f"Ki auto-tune mismatch: {ki_expected}"

    # 2. Clamping Anti-Windup Simulation
    Ts = 5e-5  # 20 kHz sampling
    V_max = 48.0
    Kp = 11.31
    Ki = 4241.15
    integrator = 0.0

    # Step 1: Positive error driving controller into saturation
    error = 10.0  # Large error
    p_term = Kp * error  # 113.1 V (exceeds 48V)
    v_unconstrained = p_term + integrator
    assert v_unconstrained > V_max

    # With Clamping: When saturated and error > 0, integrator must NOT accumulate!
    is_saturated = (v_unconstrained >= V_max and error > 0)
    if not is_saturated:
        integrator += Ki * Ts * error
    assert integrator == 0.0, "Anti-windup clamping failed: integrator accumulated during saturation!"

    # Step 2: Negative error (driving out of saturation) -> integrator should accumulate
    error_neg = -2.0
    p_term_neg = Kp * error_neg
    v_unconstrained_neg = p_term_neg + integrator
    is_saturated_neg = (v_unconstrained_neg >= V_max and error_neg > 0)
    if not is_saturated_neg:
        integrator += Ki * Ts * error_neg
    assert integrator < 0.0, "Integrator failed to recover on negative error"

    return True

def test_bearing_defect_frequencies_and_iso10816():
    """Validates bearing kinematics (BPFO/BPFI/BSF/FTF), ISO 10816-3 zones, and IEC 62439-3 PRP RCT parser"""
    import math

    # 1. 6205 Deep Groove Ball Bearing Kinematics at 1780 RPM
    rpm = 1780.0
    D = 39.04
    d = 7.94
    n = 9
    beta_deg = 0.0

    fr = rpm / 60.0
    beta_rad = math.radians(beta_deg)
    ratio = (d / D) * math.cos(beta_rad)

    bpfo = (n / 2.0) * fr * (1.0 - ratio)
    bpfi = (n / 2.0) * fr * (1.0 + ratio)
    bsf  = (D / (2.0 * d)) * fr * (1.0 - (ratio ** 2))
    ftf  = 0.5 * fr * (1.0 - ratio)

    assert abs(bpfo - 106.35) < 0.1, f"BPFO mismatch: {bpfo}"
    assert abs(bpfi - 160.65) < 0.1, f"BPFI mismatch: {bpfi}"
    assert abs(bsf - 69.92) < 0.1, f"BSF mismatch: {bsf}"
    assert abs(ftf - 11.82) < 0.1, f"FTF mismatch: {ftf}"

    # 2. ISO 10816-3 Vibration Severity Classification (Rigid Foundation, 15-300 kW)
    def classify_iso10816(rms):
        if rms <= 1.40: return "ZONE_A"
        if rms <= 2.80: return "ZONE_B"
        if rms <= 4.50: return "ZONE_C"
        return "ZONE_D"

    assert classify_iso10816(0.85) == "ZONE_A"
    assert classify_iso10816(2.20) == "ZONE_B"
    assert classify_iso10816(3.42) == "ZONE_C"
    assert classify_iso10816(4.95) == "ZONE_D"

    # 3. IEC 62439-3 PRP Redundancy Control Trailer (RCT) 6-Byte Decoder
    def parse_prp_rct(rct_bytes):
        assert len(rct_bytes) == 6, "PRP RCT must be exactly 6 bytes"
        seq_num = (rct_bytes[0] << 8) | rct_bytes[1]
        lan_and_size = (rct_bytes[2] << 8) | rct_bytes[3]
        lan_id = (lan_and_size >> 12) & 0x0F
        frame_size = lan_and_size & 0x0FFF
        prp_suffix = (rct_bytes[4] << 8) | rct_bytes[5]
        return {
            "seq_num": seq_num,
            "lan": "LAN_A" if lan_id == 0xA else ("LAN_B" if lan_id == 0xB else "UNKNOWN"),
            "size": frame_size,
            "suffix_valid": (prp_suffix == 0x88FB)
        }

    # Test Vector: Seq 0x0042 (66), LAN A (0xA054 -> 84 bytes), Suffix 0x88FB
    rct_raw = [0x00, 0x42, 0xA0, 0x54, 0x88, 0xFB]
    parsed = parse_prp_rct(rct_raw)
    assert parsed["seq_num"] == 66
    assert parsed["lan"] == "LAN_A"
    assert parsed["size"] == 84
    assert parsed["suffix_valid"] is True

    return True

def test_sensor_linearization_and_atex_intrinsic_safety():
    """Validates PT100 Callendar-Van Dusen equation, NAMUR NE 43 bands, and ATEX/IEC 60079-11 Entity Parameters"""
    import math

    # 1. PT100 Callendar-Van Dusen (DIN EN 60751)
    A = 3.9083e-3
    B = -5.7750e-7
    R0 = 100.0

    def pt100_temp_from_r(R):
        disc = (A * A) - 4.0 * B * (1.0 - (R / R0))
        return (-A + math.sqrt(disc)) / (2.0 * B)

    def pt100_r_from_temp(t):
        return R0 * (1.0 + A * t + B * t * t)

    # Validate 0 deg C, 100 deg C, 200 deg C
    assert abs(pt100_r_from_temp(0.0) - 100.00) < 0.01
    assert abs(pt100_r_from_temp(100.0) - 138.51) < 0.02
    assert abs(pt100_r_from_temp(200.0) - 175.86) < 0.02

    # Inversion accuracy
    assert abs(pt100_temp_from_r(100.00) - 0.00) < 0.01
    assert abs(pt100_temp_from_r(138.51) - 100.00) < 0.05
    assert abs(pt100_temp_from_r(175.86) - 200.00) < 0.05

    # 2. NAMUR NE 43 Current Loop Classifier
    def classify_namur_ne43(i_ma):
        if i_ma < 2.0: return "BROKEN_WIRE"
        if i_ma < 3.6: return "SENSOR_FAULT_LOW"
        if i_ma < 3.8: return "UNDER_RANGE"
        if i_ma <= 20.5: return "VALID_PROCESS"
        if i_ma <= 21.0: return "OVER_RANGE"
        return "SENSOR_FAULT_HIGH"

    assert classify_namur_ne43(1.2) == "BROKEN_WIRE"
    assert classify_namur_ne43(3.2) == "SENSOR_FAULT_LOW"
    assert classify_namur_ne43(3.7) == "UNDER_RANGE"
    assert classify_namur_ne43(12.0) == "VALID_PROCESS"
    assert classify_namur_ne43(20.8) == "OVER_RANGE"
    assert classify_namur_ne43(22.5) == "SENSOR_FAULT_HIGH"

    # 3. ATEX / IEC 60079-11 Intrinsic Safety Entity Parameter Evaluator
    def verify_is_loop(barrier, field_device, cable):
        violations = []
        if barrier["Uo"] > field_device["Ui"]: violations.append("Uo > Ui")
        if barrier["Io"] > field_device["Ii"]: violations.append("Io > Ii")
        if barrier["Po"] > field_device["Pi"]: violations.append("Po > Pi")
        if barrier["Co"] < (field_device["Ci"] + cable["Cc"]): violations.append("Co < Ci + Cc")
        if barrier["Lo"] < (field_device["Li"] + cable["Lc"]): violations.append("Lo < Li + Lc")
        return len(violations) == 0, violations

    # Valid IS loop (Zener Barrier MTL7787+ to Transmitter)
    barrier_ok = {"Uo": 28.0, "Io": 93.0, "Po": 0.65, "Co": 83.0, "Lo": 4.2}
    tx_ok = {"Ui": 30.0, "Ii": 100.0, "Pi": 0.75, "Ci": 12.0, "Li": 0.1}
    cable_ok = {"Cc": 50.0, "Lc": 0.5}

    is_safe, issues = verify_is_loop(barrier_ok, tx_ok, cable_ok)
    assert is_safe is True and len(issues) == 0

    # Hazardous loop exceeding cable capacitance limit (Cc = 80nF -> Ci + Cc = 92nF > 83nF)
    cable_unsafe = {"Cc": 80.0, "Lc": 0.5}
    is_safe_bad, issues_bad = verify_is_loop(barrier_ok, tx_ok, cable_unsafe)
    assert is_safe_bad is False and "Co < Ci + Cc" in issues_bad

    return True

def main():
    print("=" * 65)
    print(" PERSONAL CODEX 101-102: MASTER ENGINEERING TEST SUITE")
    print("=" * 65)

    passed_count = 0
    total_tests = 10

    # Test 1: CRC-16
    try:
        test_modbus_crc16()
        print("[TEST 1/10] Modbus RTU CRC-16 (ANSI 0xA001) Vectors:      [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 1/10] Modbus CRC-16 FAILED: {e}")

    # Test 2: JSON Files
    try:
        count = test_json_assets()
        print(f"[TEST 2/10] Skill Schemas & Rules Integrity ({count} files): [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 2/10] JSON Assets FAILED: {e}")

    # Test 3: Security Linter
    try:
        test_security_linter()
        print("[TEST 3/10] AI Pre-commit Security Linter (Exit Code 1):  [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 3/10] Security Linter FAILED: {e}")

    # Test 4: Gateway Simulator
    try:
        test_gateway_headless()
        print("[TEST 4/10] Industrial Gateway Telemetry Simulation:      [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 4/10] Gateway Simulator FAILED: {e}")

    # Test 5: Skill Runner CLI
    try:
        test_skill_runner_cli()
        print("[TEST 5/10] Multi-Skill CLI Audit & Schema Engine:        [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 5/10] Skill Runner CLI FAILED: {e}")

    # Test 6: Cortex Fault Decoder
    try:
        test_cortex_fault_decoder()
        print("[TEST 6/10] ARM Cortex-M Fault Bitfield Decoding Engine:  [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 6/10] Cortex Fault Decoder FAILED: {e}")

    # Test 7: CANopen CiA 402 Engine
    try:
        test_canopen_cia402_vectors()
        print("[TEST 7/10] CANopen CiA 402 Motion State Machine Vectors: [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 7/10] CANopen CiA 402 Engine FAILED: {e}")

    # Test 8: PID Controller & Anti-windup
    try:
        test_digital_pid_and_antiwindup_vectors()
        print("[TEST 8/10] Digital PID & Anti-Windup Discretization Math:[PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 8/10] PID & Anti-Windup Test FAILED: {e}")

    # Test 9: Bearing Defect Frequencies, ISO 10816-3 & PRP RCT
    try:
        test_bearing_defect_frequencies_and_iso10816()
        print("[TEST 9/10] Bearing Kinematics, ISO 10816 & PRP RCT:     [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 9/10] Bearing & ISO 10816 Test FAILED: {e}")

    # Test 10: Sensor Linearization & ATEX Intrinsic Safety
    try:
        test_sensor_linearization_and_atex_intrinsic_safety()
        print("[TEST 10/10] RTD Linearization, NAMUR NE 43 & ATEX Ex-i:  [PASSED]")
        passed_count += 1
    except Exception as e:
        print(f"[TEST 10/10] Sensor & ATEX Test FAILED: {e}")

    print("-" * 65)
    if passed_count == total_tests:
        print(f"🎉 ALL {total_tests} ENGINEERING VERIFICATION TESTS PASSED (100% HEALTHY)")
        sys.exit(0)
    else:
        print(f"🚨 {total_tests - passed_count} TEST(S) FAILED. Check logs above.")
        sys.exit(1)

if __name__ == "__main__":
    main()



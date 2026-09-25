import os
import zipfile
import hashlib
import json
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

FILES_TO_PACKAGE = [
    "personal-codex-course.html",
    "README.md",
    "run_all_engineering_tests.py",
    "run_skill.py",
    "ai_precommit_security_linter.py",
    "industrial_gateway_simulator.py",
    "start_course.bat",
    "start_course.ps1",
    "install_git_hooks.bat",
    "install_git_hooks.ps1"
]

SKILL_DIRS = [
    ".codex/skills/stm32-firmware-reviewer",
    ".codex/skills/kicad-pcb-reviewer",
    ".codex/skills/modbus-diagnostic"
]

BUNDLE_NAME = "personal_codex_offline_bundle.zip"
MANIFEST_NAME = "manifest.json"

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    print("=" * 68)
    print(" PERSONAL CODEX 101–102: OFFLINE PACKAGE & CRYPTOGRAPHIC BUILDER")
    print("=" * 68)

    all_files = list(FILES_TO_PACKAGE)
    for sdir in SKILL_DIRS:
        if os.path.exists(sdir):
            for root, _, files in os.walk(sdir):
                for file in files:
                    full_path = os.path.relpath(os.path.join(root, file), ".")
                    all_files.append(full_path.replace("\\", "/"))

    manifest = {
        "title": "PERSONAL CODEX 101–102: AI Work System Course",
        "specification": "Production-Grade AI Engineering Ecosystem",
        "version": "2.4.0-ACCREDITED",
        "timestamp": "2026-09-11T14:00:00Z",
        "total_files": len(all_files),
        "files": {}
    }

    print(f"[*] Calculating SHA-256 signatures for {len(all_files)} files...")
    for fpath in all_files:
        if not os.path.exists(fpath):
            print(f"[ERROR] Missing file: {fpath}")
            sys.exit(1)
        sha = compute_sha256(fpath)
        fsize = os.path.getsize(fpath)
        manifest["files"][fpath] = {
            "sha256": sha,
            "bytes": fsize
        }
        print(f"  + {fpath:<42} [SHA: {sha[:12]}... {fsize:>7} B]")

    # Save manifest.json
    with open(MANIFEST_NAME, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"[✓] Generated cryptographic manifest: {MANIFEST_NAME}")

    # Build ZIP archive
    print(f"[*] Compressing offline bundle: {BUNDLE_NAME}...")
    with zipfile.ZipFile(BUNDLE_NAME, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(MANIFEST_NAME, MANIFEST_NAME)
        for fpath in all_files:
            zf.write(fpath, fpath)

    bundle_size = os.path.getsize(BUNDLE_NAME)
    bundle_sha = compute_sha256(BUNDLE_NAME)
    print(f"[✓] Successfully generated {BUNDLE_NAME} ({bundle_size:,} bytes)")
    print(f"[*] Bundle SHA-256: {bundle_sha}")
    print("=" * 68)
    print("🎉 OFFLINE ENGINEERING ARCHIVE READY FOR DEPLOYMENT / ACCREDITATION")
    print("=" * 68)

if __name__ == "__main__":
    main()

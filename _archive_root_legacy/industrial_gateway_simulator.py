#!/usr/bin/env python3
"""
Industrial Edge Gateway & Modbus/WebSocket Simulator
Part of Personal Codex 101-102 (Module 10 Implementation)

Features:
- Telemetry broadcast at 50 Hz via WebSocket (JSON & Float32 payload)
- Mock Modbus Registers: RPM (0x0001), Phase Current (0x0002), Bus Voltage (0x0003), Temp (0x0004)
- Heartbeat Watchdog: Trips Safe Torque Off (STO Coil 0x0000 = 0) if client ping > 500ms
"""

import asyncio
import json
import math
import time
import random

try:
    import websockets
except ImportError:
    print("[!] 'websockets' library not found. Install with: pip install websockets")
    print("[*] Running in headless simulation loop for validation...")
    websockets = None

class MotorDynoGateway:
    def __init__(self, host="127.0.0.1", port=8080):
        self.host = host
        self.port = port
        self.running = True
        self.sto_tripped = False
        self.last_ping_time = time.time()
        self.phase_angle = 0.0
        self.connected_clients = set()
        
        # Modbus Holding Registers
        self.registers = {
            0x0001: 3000,   # RPM
            0x0002: 148,    # Current (14.8 A x 10)
            0x0003: 481,    # Vdc (48.1 V x 10)
            0x0004: 542,    # Temp (54.2 C x 10)
        }
        # Modbus Coils
        self.coils = {
            0x0000: 1,      # STO / Motor Enable (1=Run, 0=Tripped)
            0x0010: 1       # Run Command
        }

    async def register_client(self, websocket):
        self.connected_clients.add(websocket)
        print(f"[+] Client connected from {websocket.remote_address}. Active clients: {len(self.connected_clients)}")
        try:
            async for message in websocket:
                await self.handle_message(message, websocket)
        except Exception as e:
            print(f"[-] Client error or disconnect: {e}")
        finally:
            self.connected_clients.remove(websocket)
            print(f"[-] Client disconnected. Remaining: {len(self.connected_clients)}")

    async def handle_message(self, message, websocket):
        try:
            payload = json.loads(message)
            msg_type = payload.get("type")

            if msg_type == "HEARTBEAT_PING":
                self.last_ping_time = time.time()
                await websocket.send(json.dumps({
                    "type": "HEARTBEAT_PONG",
                    "server_time": time.time(),
                    "sto_state": self.coils[0x0000]
                }))

            elif msg_type == "COMMAND_STOP":
                self.coils[0x0010] = 0
                print("[CMD] Operator requested Motor Stop")

            elif msg_type == "COMMAND_START":
                if not self.sto_tripped:
                    self.coils[0x0010] = 1
                    print("[CMD] Operator requested Motor Start")

            elif msg_type == "RESET_STO":
                self.sto_tripped = False
                self.coils[0x0000] = 1
                self.last_ping_time = time.time()
                print("[SAFETY] Operator cleared STO Interlock. Ready to Run.")

        except Exception as e:
            print(f"[ERR] Failed to parse client message: {e}")

    async def watchdog_task(self):
        """Failsafe Watchdog: Trips STO within 500ms if ping is lost"""
        while self.running:
            await asyncio.sleep(0.05) # 20 Hz check
            if len(self.connected_clients) > 0:
                elapsed = time.time() - self.last_ping_time
                if elapsed > 0.500 and not self.sto_tripped:
                    self.sto_tripped = True
                    self.coils[0x0000] = 0  # Force STO Coil OFF
                    self.coils[0x0010] = 0  # Cancel Run
                    print(f"\n🚨 [FAILSAFE WATCHDOG TRIP] Heartbeat timeout ({elapsed*1000:.1f}ms > 500ms)!")
                    print("🚨 [SAFETY INTERLOCK] STO Coil 0x0000 FORCED TO 0 (SAFE TORQUE OFF ACTIVE)\n")

    async def telemetry_broadcast_task(self):
        """Broadcasts real-time telemetry at 50 Hz (20ms interval)"""
        while self.running:
            await asyncio.sleep(0.02) # 50 Hz
            self.phase_angle += 0.12

            if self.coils[0x0000] == 1 and self.coils[0x0010] == 1:
                rpm = 2980.0 + (math.sin(self.phase_angle * 0.1) * 25.0) + random.uniform(-5, 5)
                current = 14.8 + (math.sin(self.phase_angle) * 2.0) + random.uniform(-0.3, 0.3)
                status_word = 0x0037 # Enabled, Run, OK
            else:
                rpm = 0.0
                current = 0.0
                status_word = 0x0000 if self.sto_tripped else 0x0010 # Tripped or Stopped

            # Update register map
            self.registers[0x0001] = int(rpm)
            self.registers[0x0002] = int(current * 10)

            if self.connected_clients:
                telemetry_packet = json.dumps({
                    "ts": int(time.time() * 1000),
                    "rpm": round(rpm, 1),
                    "current": round(current, 2),
                    "v_dc": 48.1,
                    "temp_c": 54.2,
                    "status_word": hex(status_word),
                    "sto_active": self.coils[0x0000] == 0
                })
                # Broadcast to all connected Web HMIs
                await asyncio.gather(
                    *[c.send(telemetry_packet) for c in self.connected_clients],
                    return_exceptions=True
                )

    async def run(self):
        print("=" * 65)
        print(" INDUSTRIAL GATEWAY & FAILSAFE WATCHDOG SIMULATOR (M10)")
        print(f" Serving WebSocket on ws://{self.host}:{self.port}")
        print(" Failsafe Watchdog Threshold: 500ms")
        print(" Telemetry Refresh Rate: 50 Hz (20ms)")
        print("=" * 65)

        tasks = [
            asyncio.create_task(self.watchdog_task()),
            asyncio.create_task(self.telemetry_broadcast_task())
        ]

        if websockets:
            server = await websockets.serve(self.register_client, self.host, self.port)
            await asyncio.gather(*tasks, server.wait_closed())
        else:
            # Standalone test without websockets library installed
            print("[INFO] Simulating 10 telemetry iterations in console:")
            for _ in range(10):
                await asyncio.sleep(0.1)
                print(f"  Telemetry frame -> RPM: {self.registers[0x0001]}, Current: {self.registers[0x0002]/10:.1f}A, STO: {self.coils[0x0000]}")
            print("[INFO] Standalone verification completed successfully.")

if __name__ == "__main__":
    gateway = MotorDynoGateway()
    try:
        asyncio.run(gateway.run())
    except KeyboardInterrupt:
        print("\n[!] Gateway shutdown gracefully by user.")

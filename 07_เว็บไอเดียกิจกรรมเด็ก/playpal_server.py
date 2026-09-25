"""
PlayPal Local Web Server & PWA Host
Author: Antigravity
Provides local HTTP serving for PlayPal Web App with PWA, WiFi access for mobile devices, and MIME handling.
"""
import http.server
import socketserver
import socket
import os
import sys
import json
import webbrowser

# UTF-8 terminal encoding fix for Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8081
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_local_ip():
    """Find the local WiFi / LAN IP address for mobile access"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        # Doesn't need to be reachable, just used to detect outgoing interface
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

class PlayPalRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def guess_type(self, path):
        # Ensure correct MIME types for PWA
        if path.endswith('.json') or path.endswith('.webmanifest'):
            return 'application/manifest+json'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.html'):
            return 'text/html; charset=utf-8'
        return super().guess_type(path)

    def do_GET(self):
        # Route root path to kids_play_ideas.html
        if self.path in ('/', '/index.html'):
            self.path = '/kids_play_ideas.html'
            return super().do_GET()

        # Health / Ping API
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'app': 'PlayPal'}).encode('utf-8'))
            return

        return super().do_GET()

def start_server():
    global PORT
    local_ip = get_local_ip()
    
    # Try PORT, if taken, find next available port
    handler = PlayPalRequestHandler
    httpd = None
    for attempt_port in range(PORT, PORT + 20):
        try:
            httpd = socketserver.TCPServer(("", attempt_port), handler)
            PORT = attempt_port
            break
        except OSError:
            continue

    if not httpd:
        print("❌ ไม่สามารถเปิดพอร์ต 8081-8100 ได้ กรุณาลองตรวจสอบโปรแกรมอื่น")
        sys.exit(1)

    print("\n" + "=" * 65)
    print("  🎈  PlayPal Web App Server is Running!")
    print("=" * 65)
    print(f"  💻 ใช้งานบนคอมพิวเตอร์นี้:  http://localhost:{PORT}")
    if local_ip != '127.0.0.1':
        print(f"  📱 ใช้งานบนมือถือ (WiFi เดียวกัน): http://{local_ip}:{PORT}")
    print("=" * 65)
    print("  ✨ สามารถกดปุ่ม 'ติดตั้งแอป' (PWA) บนหน้าเว็บเพื่อใช้งานแบบออฟไลน์")
    print("  กด Ctrl + C เพื่อหยุดการทำงานของเซิร์ฟเวอร์\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 หยุดการทำงานของเซิร์ฟเวอร์เรียบร้อยแล้ว")
        httpd.server_close()

if __name__ == '__main__':
    start_server()

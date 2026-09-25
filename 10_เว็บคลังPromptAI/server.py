"""
Enhanced Production-Grade Web Server for Web Prompt Hub
Features:
- Static file serving (index.html, assets)
- Full CRUD REST API:
  - GET    /api/prompts
  - POST   /api/prompts       (Add new prompt)
  - PUT    /api/prompts/<id>  (Update prompt)
  - DELETE /api/prompts/<id>  (Delete prompt)
  - POST   /api/generate      (Gemini AI Execution Proxy)
  - GET    /api/health
"""
import http.server
import socketserver
import json
import os
import sys
import urllib.request
import urllib.error
import re

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
JSON_FILE = os.path.join(DIRECTORY, 'web_prompts_100.json')

def load_prompts():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_prompts(data):
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class PromptHubRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def _send_json(self, status_code, payload):
        content = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.path = '/web_prompt_hub.html'
            return super().do_GET()

        if self.path == '/api/prompts':
            data = load_prompts()
            return self._send_json(200, data)

        if self.path == '/api/health':
            prompts = load_prompts()
            return self._send_json(200, {
                "status": "ok",
                "total_prompts": len(prompts),
                "service": "Web Prompt Hub Pro"
            })

        # Match GET /api/prompts/<id>
        match = re.match(r'^/api/prompts/(\d+)$', self.path)
        if match:
            pid = int(match.group(1))
            prompts = load_prompts()
            found = next((p for p in prompts if p.get('id') == pid), None)
            if found:
                return self._send_json(200, found)
            return self._send_json(404, {"error": f"Prompt #{pid} not found"})

        return super().do_GET()

    def do_POST(self):
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len) if content_len > 0 else b'{}'
        try:
            req_data = json.loads(post_body.decode('utf-8'))
        except Exception:
            return self._send_json(400, {"error": "Invalid JSON body"})

        # Route: POST /api/prompts (Create New Prompt)
        if self.path == '/api/prompts':
            prompts = load_prompts()
            new_id = max((p.get('id', 0) for p in prompts), default=0) + 1
            
            prompt_text = req_data.get('prompt', '').strip()
            title = req_data.get('title', 'Untitled Prompt').strip()
            role = req_data.get('role', '').strip()
            cat_id = int(req_data.get('categoryId', 1))
            cat_name = req_data.get('categoryName', 'General')

            # Auto extract variables in [...]
            vars_found = list(dict.fromkeys(re.findall(r'\[([^\]]+)\]', prompt_text)))

            new_item = {
                "id": new_id,
                "categoryId": cat_id,
                "categoryName": cat_name,
                "title": title,
                "role": role,
                "prompt": prompt_text,
                "variables": vars_found
            }
            prompts.append(new_item)
            save_prompts(prompts)
            return self._send_json(201, {"message": "Prompt created successfully", "prompt": new_item})

        # Route: POST /api/generate (Call Gemini API or Simulated Generator)
        if self.path == '/api/generate':
            prompt_text = req_data.get('prompt', '').strip()
            api_key = req_data.get('apiKey', '').strip() or os.environ.get('GEMINI_API_KEY', '')

            if not prompt_text:
                return self._send_json(400, {"error": "Prompt text is required"})

            # If user has a Gemini API key, call official Gemini REST endpoint
            if api_key:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
                    payload = {
                        "contents": [{
                            "parts": [{"text": prompt_text}]
                        }]
                    }
                    req = urllib.request.Request(
                        url,
                        data=json.dumps(payload).encode('utf-8'),
                        headers={'Content-Type': 'application/json'}
                    )
                    with urllib.request.urlopen(req, timeout=30) as resp:
                        api_res = json.loads(resp.read().decode('utf-8'))
                        
                        candidates = api_res.get('candidates', [])
                        if candidates and 'content' in candidates[0]:
                            parts = candidates[0]['content'].get('parts', [])
                            answer = "".join([p.get('text', '') for p in parts])
                            return self._send_json(200, {
                                "source": "Gemini 2.5 Flash",
                                "output": answer
                            })
                        return self._send_json(200, {
                            "source": "Gemini 2.5 Flash",
                            "output": "No textual response received from model."
                        })
                except urllib.error.HTTPError as e:
                    err_msg = e.read().decode('utf-8')
                    return self._send_json(e.code, {"error": f"Gemini API Error: {err_msg}"})
                except Exception as e:
                    return self._send_json(500, {"error": f"Network Error: {str(e)}"})

            # If no API key provided, provide an intelligent blueprint preview & simulated execution
            return self._send_json(200, {
                "source": "AI Simulator (Demo Mode)",
                "output": f"🚀 [ผลลัพธ์จำลองสำหรับการทดสอบ Prompt]\n\n"
                          f"คำสั่งได้รับเข้าสู่ระบบ:\n> \"{prompt_text[:120]}...\"\n\n"
                          f"💡 ผลลัพธ์ตัวอย่างที่ AI จะสร้างให้เมื่อเชื่อมต่อ API Key:\n"
                          f"- โครงสร้างโค้ดและ Architecture ครบถ้วนตาม R-T-C-F Specification\n"
                          f"- ปฏิบัติตามมาตรฐานความปลอดภัยและ Performance สูงสุด\n"
                          f"- รองรับทั้ง TypeScript, Python, Tailwind CSS, และ SQL\n\n"
                          f"👉 หากต้องการรันโมเดลจริง สามารถระบุ Gemini API Key ได้ที่ปุ่ม '🔑 ตั้งค่า API Key' บนแถบเมนูด้านบน"
            })

        return self._send_json(404, {"error": "Endpoint not found"})

    def do_PUT(self):
        match = re.match(r'^/api/prompts/(\d+)$', self.path)
        if not match:
            return self._send_json(404, {"error": "Invalid PUT path"})

        pid = int(match.group(1))
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len) if content_len > 0 else b'{}'
        try:
            req_data = json.loads(post_body.decode('utf-8'))
        except Exception:
            return self._send_json(400, {"error": "Invalid JSON body"})

        prompts = load_prompts()
        found_idx = next((i for i, p in enumerate(prompts) if p.get('id') == pid), None)
        if found_idx is None:
            return self._send_json(404, {"error": f"Prompt #{pid} not found"})

        prompt_text = req_data.get('prompt', prompts[found_idx]['prompt']).strip()
        vars_found = list(dict.fromkeys(re.findall(r'\[([^\]]+)\]', prompt_text)))

        prompts[found_idx]['title'] = req_data.get('title', prompts[found_idx]['title']).strip()
        prompts[found_idx]['role'] = req_data.get('role', prompts[found_idx].get('role', '')).strip()
        prompts[found_idx]['prompt'] = prompt_text
        prompts[found_idx]['variables'] = vars_found
        if 'categoryId' in req_data:
            prompts[found_idx]['categoryId'] = int(req_data['categoryId'])
        if 'categoryName' in req_data:
            prompts[found_idx]['categoryName'] = req_data['categoryName']

        save_prompts(prompts)
        return self._send_json(200, {"message": "Prompt updated", "prompt": prompts[found_idx]})

    def do_DELETE(self):
        match = re.match(r'^/api/prompts/(\d+)$', self.path)
        if not match:
            return self._send_json(404, {"error": "Invalid DELETE path"})

        pid = int(match.group(1))
        prompts = load_prompts()
        initial_len = len(prompts)
        prompts = [p for p in prompts if p.get('id') != pid]

        if len(prompts) == initial_len:
            return self._send_json(404, {"error": f"Prompt #{pid} not found"})

        save_prompts(prompts)
        return self._send_json(200, {"message": f"Prompt #{pid} deleted successfully"})

def run_server():
    global PORT
    handler = PromptHubRequestHandler
    
    max_attempts = 10
    httpd = None
    for attempt in range(max_attempts):
        try:
            httpd = socketserver.TCPServer(("", PORT), handler)
            break
        except OSError:
            print(f"Port {PORT} in use, trying {PORT + 1}...")
            PORT += 1

    if not httpd:
        print("Failed to bind to an available port.")
        sys.exit(1)

    url = f"http://localhost:{PORT}"
    print("=" * 60)
    print(f" [OK] Web Prompt Hub Pro Server is running!")
    print(f" [URL] Web App:            {url}")
    print(f" [API] Prompts CRUD:       {url}/api/prompts")
    print(f" [API] AI Execution Proxy: {url}/api/generate")
    print(f" [API] Health Check:       {url}/api/health")
    print("=" * 60)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()

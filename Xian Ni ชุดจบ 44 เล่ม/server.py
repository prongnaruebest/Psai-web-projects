# -*- coding: utf-8 -*-
import sys, os, io, hashlib, urllib.parse, asyncio, http.server, socketserver
import edge_tts

PORT = 8088
CACHE_DIR = 'audio_cache'
os.makedirs(CACHE_DIR, exist_ok=True)

class SmartReaderHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/tts':
            query = urllib.parse.parse_qs(parsed.query)
            text = query.get('text', [''])[0].strip()
            voice = query.get('voice', ['th-TH-NiwatNeural'])[0]
            rate = query.get('rate', ['+0%'])[0]

            if not text:
                self.send_error(400, 'Missing text parameter')
                return

            # Compute hash for caching
            cache_key = f'{voice}_{rate}_{text}'
            file_hash = hashlib.md5(cache_key.encode('utf-8')).hexdigest()
            cache_path = os.path.join(CACHE_DIR, f'{file_hash}.mp3')

            if not os.path.exists(cache_path):
                try:
                    async def gen():
                        comm = edge_tts.Communicate(text, voice, rate=rate)
                        await comm.save(cache_path)
                    asyncio.run(gen())
                except Exception as e:
                    print('TTS Generation Error:', e)
                    self.send_error(500, f'TTS Error: {e}')
                    return

            try:
                with open(cache_path, 'rb') as f:
                    audio_data = f.read()

                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_data)))
                self.send_header('Cache-Control', 'public, max-age=86400')
                self.end_headers()
                self.wfile.write(audio_data)
            except Exception as e:
                self.send_error(500, f'File Error: {e}')
            return

        elif parsed.path == '/api/download_chapter':
            query = urllib.parse.parse_qs(parsed.query)
            try:
                vol_num = int(query.get('vol', [1])[0])
                chap_id = int(query.get('chap', [1])[0])
            except Exception:
                self.send_error(400, 'Invalid parameters')
                return

            voice = query.get('voice', ['th-TH-NiwatNeural'])[0]
            vol_str = f"{vol_num:02d}"
            vol_path = os.path.join('data', f'vol_{vol_str}.json')
            if not os.path.exists(vol_path):
                self.send_error(404, 'Volume not found')
                return

            import json
            with open(vol_path, 'r', encoding='utf-8') as jf:
                chaps = json.load(jf)

            chapter = next((c for c in chaps if c['id'] == chap_id), None)
            if not chapter:
                self.send_error(404, 'Chapter not found')
                return

            paras = chapter.get('paragraphs', [])
            full_text = f"{chapter['title']}\n\n" + "\n\n".join(paras)

            cache_path = os.path.join(CACHE_DIR, f"chapter_{vol_str}_{chap_id:04d}_{voice}.mp3")
            if not os.path.exists(cache_path):
                try:
                    async def gen_full():
                        comm = edge_tts.Communicate(full_text, voice)
                        await comm.save(cache_path)
                    asyncio.run(gen_full())
                except Exception as e:
                    self.send_error(500, f'Generation Error: {e}')
                    return

            try:
                with open(cache_path, 'rb') as f:
                    data = f.read()
                file_name = f"Xian_Ni_Vol{vol_str}_Chap{chap_id:04d}.mp3"
                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(data)))
                self.send_header('Content-Disposition', f'attachment; filename="{file_name}"')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_error(500, f'Download Error: {e}')
            return

        super().do_GET()

if __name__ == '__main__':
    with socketserver.TCPServer(('', PORT), SmartReaderHandler) as httpd:
        print(f'Server running at http://localhost:{PORT}/ with Neural TTS enabled!')
        httpd.serve_forever()

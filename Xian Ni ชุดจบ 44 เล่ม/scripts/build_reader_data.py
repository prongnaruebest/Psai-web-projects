# -*- coding: utf-8 -*-
import sys, os, io, re, csv, json, zipfile
from html.parser import HTMLParser

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

EPUB_DIR = 'Ebook EPUB'
DATA_DIR = 'data'
COVERS_DIR = 'covers'

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(COVERS_DIR, exist_ok=True)

class ChapterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.paragraphs = []
        self._current_tag = None
        self._buf = []

    def handle_starttag(self, tag, attrs):
        self._current_tag = tag
        if tag in ('h1', 'p', 'title'):
            self._buf = []

    def handle_endtag(self, tag):
        text = ''.join(self._buf).strip()
        if tag == 'h1' and not self.title:
            self.title = text
        elif tag == 'title' and not self.title:
            self.title = text
        elif tag == 'p' and text:
            self.paragraphs.append(text)
        self._current_tag = None

    def handle_data(self, data):
        if self._current_tag in ('h1', 'p', 'title'):
            self._buf.append(data)

meta_by_vol = {}
csv_path = 'รายการเล่ม.csv'
if os.path.exists(csv_path):
    with open(csv_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            vol = int(row['volume'])
            meta_by_vol[vol] = {
                'chapter_start': int(row['chapter_start']),
                'chapter_end': int(row['chapter_end']),
                'pages': int(row['pages_including_cover']),
                'filename': row['filename']
            }

manifest_volumes = []
search_index = []

print('Starting EPUB extraction for 44 volumes...')

epub_files = os.listdir(EPUB_DIR)

for vol_num in range(1, 45):
    vol_str = f'{vol_num:02d}'
    matched_epubs = [f for f in epub_files if f'เล่ม_{vol_str}_' in f or f'เล่ม_{vol_num}_' in f]
    if not matched_epubs:
        print(f'Volume {vol_num} not found in EPUB directory!')
        continue
    
    epub_path = os.path.join(EPUB_DIR, matched_epubs[0])
    meta = meta_by_vol.get(vol_num, {})
    chap_start = meta.get('chapter_start', 1)
    chap_end = meta.get('chapter_end', 47)
    
    with zipfile.ZipFile(epub_path, 'r') as z:
        cover_candidates = [n for n in z.namelist() if 'cover' in n.lower() and (n.endswith('.jpg') or n.endswith('.jpeg') or n.endswith('.png'))]
        cover_saved = f'covers/cover_{vol_str}.jpg'
        if cover_candidates:
            cover_data = z.read(cover_candidates[0])
            with open(cover_saved, 'wb') as cf:
                cf.write(cover_data)

        chap_files = [n for n in z.namelist() if re.search(r'chapter-\d+\.xhtml$', n)]
        chap_files.sort()
        
        volume_chapters = []
        vol_total_chars = 0
        
        for ch_file in chap_files:
            raw_html = z.read(ch_file).decode('utf-8', errors='ignore')
            parser = ChapterParser()
            parser.feed(raw_html)
            
            title = parser.title or ''
            fn_match = re.search(r'chapter-(\d+)', ch_file)
            chap_id = int(fn_match.group(1)) if fn_match else (len(volume_chapters) + chap_start)
            clean_title = title if title else f'ตอนที่ {chap_id}'
            
            for p in parser.paragraphs:
                vol_total_chars += len(p)
                
            volume_chapters.append({
                'id': chap_id,
                'title': clean_title,
                'paragraphs': parser.paragraphs
            })
            
            search_index.append({
                'id': chap_id,
                'title': clean_title,
                'vol': vol_num
            })
            
        vol_json_path = os.path.join(DATA_DIR, f'vol_{vol_str}.json')
        with open(vol_json_path, 'w', encoding='utf-8') as jf:
            json.dump(volume_chapters, jf, ensure_ascii=False)
            
        vol_js_path = os.path.join(DATA_DIR, f'vol_{vol_str}.js')
        with open(vol_js_path, 'w', encoding='utf-8') as jsf:
            jsf.write(f'window.XIAN_NI_VOLUMES = window.XIAN_NI_VOLUMES || {{}};\nwindow.XIAN_NI_VOLUMES[{vol_num}] = ')
            json.dump(volume_chapters, jsf, ensure_ascii=False)
            jsf.write(';\n')
            
        manifest_volumes.append({
            'volume': vol_num,
            'vol_str': vol_str,
            'title': f'Volume {vol_num}',
            'subtitle': f'Chapter {chap_start} - {chap_end}',
            'chapter_start': chap_start,
            'chapter_end': chap_end,
            'chapter_count': len(volume_chapters),
            'total_chars': vol_total_chars,
            'pdf_filename': meta.get('filename', f'Xian_Ni_เล่ม_{vol_str}.pdf'),
            'pdf_pages': meta.get('pages', 0),
            'cover_image': cover_saved,
            'data_file': f'data/vol_{vol_str}.json'
        })
        
        print(f'Vol {vol_str} done: {len(volume_chapters)} chapters, {vol_total_chars:,} chars.')

manifest_data = {
    'title': 'Xian Ni (Renegade Immortal) ฝืนลิขิตฟ้า ข้าขอเป็นเซียน',
    'total_volumes': len(manifest_volumes),
    'total_chapters': len(search_index),
    'status': 'Complete 44 Volumes',
    'volumes': manifest_volumes
}

with open(os.path.join(DATA_DIR, 'manifest.json'), 'w', encoding='utf-8') as mf:
    json.dump(manifest_data, mf, ensure_ascii=False, indent=2)

with open(os.path.join(DATA_DIR, 'manifest.js'), 'w', encoding='utf-8') as mjs:
    mjs.write('window.XIAN_NI_MANIFEST = ')
    json.dump(manifest_data, mjs, ensure_ascii=False, indent=2)
    mjs.write(';\n')

with open(os.path.join(DATA_DIR, 'search_index.json'), 'w', encoding='utf-8') as sf:
    json.dump(search_index, sf, ensure_ascii=False)

with open(os.path.join(DATA_DIR, 'search_index.js'), 'w', encoding='utf-8') as sjs:
    sjs.write('window.XIAN_NI_SEARCH_INDEX = ')
    json.dump(search_index, sjs, ensure_ascii=False)
    sjs.write(';\n')

print(f'Extraction Complete! Total {len(manifest_volumes)} volumes, {len(search_index)} chapters.')

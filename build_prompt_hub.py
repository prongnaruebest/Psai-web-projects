import json

with open('web_prompts_100.json', 'r', encoding='utf-8') as f:
    prompts_data = json.load(f)

json_str = json.dumps(prompts_data, ensure_ascii=False)

html_content = f"""<!DOCTYPE html>
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Prompt Hub Pro — 300 Master Prompts (200 AI Money + 100 Web Dev)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      darkMode: 'class',
      theme: {{
        extend: {{
          fontFamily: {{
            sans: ['"IBM Plex Sans Thai"', 'sans-serif'],
            display: ['Archivo', '"IBM Plex Sans Thai"', 'sans-serif'],
            mono: ['"IBM Plex Mono"', 'monospace']
          }}
        }}
      }}
    }}
  </script>
  <style>
    :root {{
      --reader-font-size: 14px;
    }}
    body {{
      background-color: #030014;
      color: #E2E8F0;
      font-family: 'IBM Plex Sans Thai', sans-serif;
    }}
    .custom-scrollbar::-webkit-scrollbar {{
      width: 6px;
      height: 6px;
    }}
    .custom-scrollbar::-webkit-scrollbar-track {{
      background: rgba(15, 23, 42, 0.6);
    }}
    .custom-scrollbar::-webkit-scrollbar-thumb {{
      background: #334155;
      border-radius: 9999px;
    }}
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {{
      background: #475569;
    }}
    .reader-text {{
      font-size: var(--reader-font-size);
      line-height: 1.75;
    }}
    .prompt-box {{
      background: rgba(11, 19, 43, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.15);
    }}
    .prompt-var-tag {{
      display: inline-block;
      padding: 1px 6px;
      border-radius: 6px;
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.3);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.9em;
      margin: 0 2px;
    }}
    .glass-card {{
      background: rgba(20, 31, 56, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(148, 163, 184, 0.12);
    }}
    .glass-card:hover {{
      border-color: rgba(56, 189, 248, 0.35);
      box-shadow: 0 10px 30px -10px rgba(14, 165, 233, 0.15);
    }}
    .money-card:hover {{
      border-color: rgba(52, 211, 153, 0.35) !important;
      box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.15) !important;
    }}
    html {{
      scroll-behavior: smooth;
    }}

    /* Print Stylesheet for PDF eBook */
    @media print {{
      header, aside, .no-print, button, #modal-customizer, #modal-new-prompt, #modal-api-key, #modal-export, #toast {{
        display: none !important;
      }}
      body {{
        background: white !important;
        color: black !important;
        font-family: 'IBM Plex Sans Thai', sans-serif !important;
      }}
      article {{
        page-break-inside: avoid;
        margin-bottom: 2rem !important;
        border: 1px solid #ccc !important;
        background: #fdfdfd !important;
        color: #111 !important;
        box-shadow: none !important;
      }}
      .prompt-box {{
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        color: #1e293b !important;
      }}
      .prompt-var-tag {{
        background: #fef3c7 !important;
        color: #92400e !important;
        border: 1px solid #fde68a !important;
      }}
      h1, h2, h3 {{
        color: #0f172a !important;
      }}
    }}
  </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950">

  <!-- Header -->
  <header class="sticky top-0 z-40 bg-[#030014]/95 backdrop-blur-md border-b border-cyan-900/50">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-xl font-bold text-white">
          
        </div>
        <div>
          <h1 class="font-display text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            PROMPT HUB <span class="text-cyan-400 font-extrabold">MAX</span>
            <span id="prompt-count-pill" class="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-emerald-500/30">300 Prompts</span>
          </h1>
          <p class="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
            <span>คลังโปรมป์ต์ 200 ข้อโหมด AI หาเงิน + 100 ข้อโหมดวิศวกรรมเว็บ (รวม 300 ข้อ)</span>
            <span class="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Online
            </span>
          </p>
        </div>
      </div>

      <!-- Controls & Actions -->
      <div class="flex items-center flex-wrap gap-2">
        
        <!-- View Toggle -->
        <div class="bg-slate-900 border border-blue-900/40 p-0.5 rounded-lg flex items-center text-xs">
          <button onclick="setViewMode('reader')" id="btn-view-reader" class="px-3 py-1.5 rounded-md font-semibold bg-cyan-600 text-white flex items-center gap-1.5 transition shadow-sm">
            <span> อ่านฉบับเต็ม</span>
          </button>
          <button onclick="setViewMode('grid')" id="btn-view-grid" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition">
            <span> การ์ดย่อ</span>
          </button>
        </div>

        <!-- Font Size Adjuster -->
        <div class="bg-slate-900 border border-blue-900/40 px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs text-slate-300">
          <span class="text-[10px] text-slate-500 font-mono">ขนาด:</span>
          <button onclick="adjustFontSize(-1)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold" title="ลดขนาด">A-</button>
          <button onclick="adjustFontSize(1)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold" title="เพิ่มขนาด">A+</button>
        </div>

        <!-- Print PDF -->
        <button onclick="window.print()" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition" title="พิมพ์เป็นเอกสาร PDF">
          <span> PDF / พิมพ์</span>
        </button>

        <button onclick="openExportModal()" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center gap-1.5 shadow-sm transition">
          <span> ศูนย์ส่งออก</span>
        </button>

        <button onclick="openNewPromptModal()" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-sm transition">
          <span> เพิ่ม</span>
        </button>
        
        <button onclick="openApiKeyModal()" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition">
          <span> AI</span>
          <span id="api-key-indicator" class="w-2 h-2 rounded-full bg-pink-500"></span>
        </button>

        <button id="btn-fav-filter" onclick="toggleFavoriteFilter()" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition">
          <span></span>
          <span id="fav-count-badge" class="px-1.5 py-0.2 bg-pink-500/20 text-pink-300 rounded-full font-mono text-[11px]">0</span>
        </button>

        <a href="https://github.com/prongnaruebest/Psai-web-projects" target="_blank" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition" title="ดู Source Code บน GitHub">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span class="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <div class="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-8 items-start">
    
    <!-- Sticky Sidebar -->
    <aside class="w-full lg:w-80 shrink-0 lg:sticky lg:top-20 space-y-5 bg-slate-900/60 p-4 rounded-2xl border border-cyan-900/50/80 backdrop-blur-md">
      
      <!-- Mode Switcher -->
      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">เลือกโหมดการใช้งาน</label>
        <div class="flex flex-col gap-1.5">
          <button onclick="switchMode('money')" id="mode-btn-money" class="w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-cyan-600/20 border border-emerald-500/30">
            <span class="flex items-center gap-2"><span></span> โหมดใช้ AI หาเงิน</span>
            <span class="px-2 py-0.5 rounded-full bg-cyan-900/80 text-cyan-200 font-mono text-[11px]" id="mode-count-money">200</span>
          </button>
          <button onclick="switchMode('web')" id="mode-btn-web" class="w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60">
            <span class="flex items-center gap-2"><span></span> โหมดพัฒนาเว็บ</span>
            <span class="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono text-[11px]" id="mode-count-web">100</span>
          </button>
          <button onclick="switchMode('all')" id="mode-btn-all" class="w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60">
            <span class="flex items-center gap-2"><span></span> ดูทั้งหมด (All)</span>
            <span class="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono text-[11px]" id="mode-count-all">300</span>
          </button>
        </div>
      </div>

      <!-- Quick Search in Sidebar -->
      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">ค้นหาแบบเรียลไทม์</label>
        <div class="relative">
          <input 
            type="text" 
            id="search-input" 
            placeholder="ค้นหา เช่น 'Ghostwriting', 'Chatbot', 'Notion' (กด /)..." 
            class="w-full pl-8 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            oninput="handleSearch()"
          >
          <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500 text-xs"></span>
          <button id="btn-clear-search" onclick="clearSearch()" class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300 hidden text-xs">✕</button>
        </div>
      </div>

      <!-- Difficulty / Level Filter -->
      <div>
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">ระดับความยาก / ทักษะ</label>
        <div class="grid grid-cols-2 gap-1 text-[11px]">
          <button onclick="filterDifficulty('')" class="diff-btn px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold border border-emerald-400" data-diff="">ทั้งหมด</button>
          <button onclick="filterDifficulty('Beginner')" class="diff-btn px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700" data-diff="Beginner"> มือใหม่</button>
          <button onclick="filterDifficulty('Intermediate')" class="diff-btn px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700" data-diff="Intermediate"> ปานกลาง</button>
          <button onclick="filterDifficulty('Advanced')" class="diff-btn px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700" data-diff="Advanced"> ขั้นสูง</button>
        </div>
      </div>

      <!-- Quick Jump to Category (TOC) -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400">สารบัญหมวดหมู่</label>
          <button onclick="filterCategory(0)" class="text-[11px] text-cyan-400 hover:underline">ดูทั้งหมด</button>
        </div>
        <div id="sidebar-categories" class="space-y-1 max-h-[42vh] overflow-y-auto custom-scrollbar pr-1 text-xs"></div>
      </div>

    </aside>

    <!-- Reading Feed Area -->
    <main class="flex-1 w-full min-w-0 space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-cyan-900/50 text-xs">
        <div class="flex items-center gap-3">
          <span id="result-counter" class="font-mono font-medium text-cyan-400">แสดง 200 รายการ</span>
          <span class="text-slate-600">|</span>
          <span id="active-category-label" class="text-slate-300 font-semibold">โหมดใช้ AI หาเงิน (200 ข้อ)</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="expandAllPrompts()" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px]">
             ขยายอ่านเต็ม
          </button>
          <button onclick="collapseAllPrompts()" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px]">
             ย่อกล่อง
          </button>
        </div>
      </div>

      <!-- Prompts Container (Reader Stream or Grid) -->
      <div id="prompts-container" class="space-y-6"></div>

      <!-- Empty State -->
      <div id="empty-state" class="hidden py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-cyan-900/50">
        <div class="text-4xl"></div>
        <h3 class="text-base font-semibold text-slate-200">ไม่พบโปรมป์ต์ที่ตรงกับคำค้นหา</h3>
        <p class="text-xs text-slate-400">ลองเปลี่ยนคำค้นหา หรือกดปุ่มรีเซ็ตตัวกรอง</p>
        <button onclick="resetAllFilters()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-semibold text-white transition">
          ล้างตัวกรองทั้งหมด
        </button>
      </div>

    </main>

  </div>

  <!-- Export Hub Modal -->
  <div id="modal-export" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span> ศูนย์ส่งออกข้อมูล (Export Hub)</span>
        </h3>
        <button onclick="closeExportModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        ส่งออกคลัง 300 Master Prompts ในรูปแบบไฟล์ที่คุณต้องการ นำไปเปิดใน Notion, Excel, Google Sheets, หรือสั่งพิมพ์เป็นหนังสือ PDF ในคลิกเดียว
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button onclick="exportToCsv()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-cyan-900/50 hover:border-emerald-500/40 rounded-xl flex flex-col items-start gap-1 transition text-left group">
          <span class="text-xl"></span>
          <span class="text-xs font-bold text-slate-200 group-hover:text-cyan-400">ไฟล์ CSV (Excel / Notion)</span>
          <span class="text-[11px] text-slate-500">นำเข้าตาราง Notion หรือ Excel ครบทุกฟิลด์</span>
        </button>
        <button onclick="exportToMarkdown()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-cyan-900/50 hover:border-emerald-500/40 rounded-xl flex flex-col items-start gap-1 transition text-left group">
          <span class="text-xl"></span>
          <span class="text-xs font-bold text-slate-200 group-hover:text-cyan-400">ไฟล์ Markdown (.md)</span>
          <span class="text-[11px] text-slate-500">สำหรับ Obsidian หรือเก็บบันทึกส่วนตัว</span>
        </button>
        <button onclick="exportToJson()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-cyan-900/50 hover:border-emerald-500/40 rounded-xl flex flex-col items-start gap-1 transition text-left group">
          <span class="text-xl"></span>
          <span class="text-xs font-bold text-slate-200 group-hover:text-cyan-400">ไฟล์ JSON (.json)</span>
          <span class="text-[11px] text-slate-500">Structured Data ครบ 300 Prompts สำหรับ API</span>
        </button>
        <button onclick="triggerPrintEbook()" class="p-4 bg-slate-950 hover:bg-slate-800 border border-cyan-900/50 hover:border-emerald-500/40 rounded-xl flex flex-col items-start gap-1 transition text-left group">
          <span class="text-xl"></span>
          <span class="text-xs font-bold text-slate-200 group-hover:text-cyan-400">บันทึกเป็น PDF eBook</span>
          <span class="text-[11px] text-slate-500">พิมพ์หน้าเว็บเป็นหนังสือ PDF สะอาดตา ไร้ปุ่มเกะกะ</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Interactive Customizer & AI Playground Modal -->
  <div id="modal-customizer" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-cyan-900/50 flex items-center justify-between bg-slate-900">
        <div class="flex items-center gap-3">
          <span id="modal-cat-badge" class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-400 border border-emerald-500/30">#101</span>
          <h3 id="modal-title" class="text-base font-bold text-white truncate max-w-lg">ปรับแต่ง Prompt & Playground</h3>
        </div>
        <button onclick="closeCustomizer()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
          ✕
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center gap-6 px-6 border-b border-cyan-900/50 bg-slate-950 text-xs font-medium text-slate-400">
        <button id="tab-btn-vars" onclick="switchModalTab('vars')" class="py-3 border-b-2 border-emerald-500 text-cyan-400 font-semibold flex items-center gap-2">
          <span>⚙ ปรับแต่งตัวแปร</span>
        </button>
        <button id="tab-btn-code" onclick="switchModalTab('code')" class="py-3 border-b-2 border-transparent hover:text-slate-200 transition flex items-center gap-2">
          <span> SDK Code Generator</span>
        </button>
        <button id="tab-btn-ai" onclick="switchModalTab('ai')" class="py-3 border-b-2 border-transparent hover:text-slate-200 transition flex items-center gap-2">
          <span> AI Live Playground</span>
          <span class="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono">Live</span>
        </button>
      </div>

      <!-- Modal Body Tabs -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
        
        <!-- Tab 1: Variables -->
        <div id="tab-content-vars" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">บทบาท (Role)</label>
            <div id="modal-role" class="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-cyan-900/50"></div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>แทนค่าตัวแปรในวงเล็บ `[...]`</span>
              <span class="text-[11px] text-pink-400 font-normal">พิมพ์ค่าเพื่ออัปเดตผลลัพธ์สด</span>
            </label>
            <div id="variable-inputs-container" class="space-y-3"></div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">ผลลัพธ์ Prompt พร้อมใช้งาน</label>
            <pre id="live-prompt-preview" class="w-full p-4 bg-slate-950 border border-cyan-900/50 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto custom-scrollbar"></pre>
          </div>
        </div>

        <!-- Tab 2: Code Snippets -->
        <div id="tab-content-code" class="space-y-4 hidden">
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">เลือกภาษาสำหรับเชื่อมต่อ API:</span>
            <div class="flex gap-2 text-xs">
              <button onclick="showCodeSnippet('python')" id="code-btn-python" class="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold">Python (google-genai)</button>
              <button onclick="showCodeSnippet('node')" id="code-btn-node" class="px-2.5 py-1 rounded bg-slate-800 text-slate-300">Node.js (@google/genai)</button>
              <button onclick="showCodeSnippet('curl')" id="code-btn-curl" class="px-2.5 py-1 rounded bg-slate-800 text-slate-300">cURL</button>
            </div>
          </div>
          <div class="relative">
            <pre id="code-snippet-box" class="w-full p-4 bg-slate-950 border border-cyan-900/50 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto custom-scrollbar"></pre>
            <button onclick="copyCurrentSnippet()" class="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700">
               คัดลอกโค้ด
            </button>
          </div>
        </div>

        <!-- Tab 3: AI Live Playground -->
        <div id="tab-content-ai" class="space-y-4 hidden">
          <div class="p-3 bg-cyan-950/40 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 text-cyan-200">
              <span> รันคำสั่งนี้ส่งตรงไปยังโมเดล AI</span>
              <span id="ai-provider-badge" class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[11px]">Gemini 2.5 Flash</span>
            </div>
            <button onclick="runAiGeneration()" id="btn-run-ai" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-lg shadow-md flex items-center gap-1.5 transition">
              <span id="btn-run-ai-icon"></span>
              <span id="btn-run-ai-text">สร้างผลลัพธ์เดี๋ยวนี้</span>
            </button>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">ผลลัพธ์จาก AI (AI Output)</label>
              <button onclick="copyAiOutput()" id="btn-copy-ai-output" class="text-xs text-cyan-400 hover:text-cyan-300 hidden"> คัดลอกผลลัพธ์</button>
            </div>
            <div id="ai-output-box" class="w-full min-h-[180px] max-h-[320px] p-4 bg-slate-950 border border-cyan-900/50 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-y-auto custom-scrollbar flex items-center justify-center text-slate-500 italic">
              กดปุ่ม 'สร้างผลลัพธ์เดี๋ยวนี้' ด้านบนเพื่อเริ่มรันผลลัพธ์
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-cyan-900/50 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">เปิดใน:</span>
          <button onclick="openInChatGPT()" class="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700">
            ChatGPT ↗
          </button>
          <button onclick="openInClaude()" class="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700">
            Claude ↗
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="closeCustomizer()" class="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition">
            ปิด
          </button>
          <button onclick="copyCustomizedPrompt()" class="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-2 shadow-lg shadow-cyan-500/25">
            <span></span>
            <span>คัดลอก Prompt ทันที</span>
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- Add New Prompt Modal -->
  <div id="modal-new-prompt" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
      <div class="px-6 py-4 border-b border-cyan-900/50 flex items-center justify-between bg-slate-900">
        <h3 class="text-base font-bold text-white"> เพิ่ม Prompt ใหม่เข้าสู่ระบบ</h3>
        <button onclick="closeNewPromptModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">โหมด</label>
            <select id="new-prompt-mode" onchange="updateNewPromptCatOptions()" class="w-full px-3 py-2 bg-slate-950 border border-cyan-900/50 rounded-lg text-xs text-slate-100 focus:border-emerald-500">
              <option value="money"> โหมดใช้ AI หาเงิน (Monetization)</option>
              <option value="web"> โหมดพัฒนาเว็บ (Web Dev)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">หมวดหมู่</label>
            <select id="new-prompt-cat" class="w-full px-3 py-2 bg-slate-950 border border-cyan-900/50 rounded-lg text-xs text-slate-100 focus:border-emerald-500"></select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">ชื่อโปรมป์ต์ (Title)</label>
          <input type="text" id="new-prompt-title" placeholder="เช่น สคริปต์ TikTok ขายสินค้า Affiliate" class="w-full px-3 py-2 bg-slate-950 border border-cyan-900/50 rounded-lg text-xs text-slate-100 focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">บทบาทของ AI (Role Persona)</label>
          <input type="text" id="new-prompt-role" placeholder="เช่น Master Affiliate Copywriter" class="w-full px-3 py-2 bg-slate-950 border border-cyan-900/50 rounded-lg text-xs text-slate-100 focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            เนื้อหา Prompt (สามารถใส่ตัวแปรในวงเล็บ `[...]` ได้ เช่น `[ระบุสินค้า]`)
          </label>
          <textarea id="new-prompt-content" rows="6" placeholder="คุณคือ... จงช่วยเขียน..." class="w-full px-3 py-2 bg-slate-950 border border-cyan-900/50 rounded-lg text-xs font-mono text-slate-100 focus:border-emerald-500"></textarea>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-cyan-900/50 bg-slate-950 flex justify-end gap-2">
        <button onclick="closeNewPromptModal()" class="px-4 py-2 text-xs text-slate-400 hover:text-white">ยกเลิก</button>
        <button onclick="saveNewPrompt()" class="px-5 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg">บันทึก Prompt</button>
      </div>
    </div>
  </div>

  <!-- API Key Settings Modal -->
  <div id="modal-api-key" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span> ตั้งค่า Gemini API Key</span>
        </h3>
        <button onclick="closeApiKeyModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <p class="text-xs text-slate-400">
        ระบุ Google Gemini API Key เพื่อเปิดใช้งานระบบรันคำสั่งสดในแท็บ AI Playground (คีย์จะถูกบันทึกไว้ใน Browser ของคุณเท่านั้น)
      </p>
      <div>
        <input type="password" id="input-api-key" placeholder="AIzaSy..." class="w-full px-3 py-2 bg-slate-950 border border-cyan-900/50 rounded-lg text-xs text-slate-100 font-mono focus:border-emerald-500">
      </div>
      <div class="flex items-center justify-between text-xs pt-2">
        <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-cyan-400 hover:underline">รับ API Key ฟรีที่นี่ ↗</a>
        <div class="flex gap-2">
          <button onclick="clearApiKey()" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-400">ล้างคีย์</button>
          <button onclick="saveApiKey()" class="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">บันทึก</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 bg-cyan-500 text-slate-950 px-4 py-3 rounded-xl font-medium text-xs shadow-2xl flex items-center gap-2">
    <span>✓</span>
    <span id="toast-message">คัดลอกลงคลิปบอร์ดแล้ว!</span>
  </div>

  <script>
    let PROMPTS = {json_str};
    let currentMode = 'money';
    let currentCategory = 0;
    let selectedDifficulty = '';
    let viewMode = 'reader';
    let currentFontSize = 14;
    let searchQuery = '';
    let filterOnlyFavorites = false;
    let favorites = JSON.parse(localStorage.getItem('web_prompts_favs') || '[]');
    let activeCustomizingPrompt = null;
    let variableValues = {{}};
    let activeCodeSnippetLang = 'python';

    const categoryMeta = {{
      // Web Dev (1-10)
      1: {{ name: 'Architecture', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' }},
      2: {{ name: 'UI/UX Design', color: 'bg-pink-500/15 text-pink-400 border-pink-500/30' }},
      3: {{ name: 'Frontend', color: 'bg-cyan-500/15 text-cyan-400 border-emerald-500/30' }},
      4: {{ name: 'Backend & API', color: 'bg-pink-500/15 text-pink-400 border-amber-500/30' }},
      5: {{ name: 'Database', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' }},
      6: {{ name: 'Security', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' }},
      7: {{ name: 'Testing & QA', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }},
      8: {{ name: 'Performance', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' }},
      9: {{ name: 'DevOps & CI/CD', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' }},
      10: {{ name: 'CRO & Copy', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' }},

      // AI Money 1-10 (11-20)
      11: {{ name: 'Digital Products', color: 'bg-cyan-500/15 text-cyan-300 border-emerald-500/30' }},
      12: {{ name: 'Freelancing', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30' }},
      13: {{ name: 'Content Creator', color: 'bg-pink-500/15 text-pink-300 border-amber-500/30' }},
      14: {{ name: 'Affiliate Marketing', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' }},
      15: {{ name: 'E-Commerce & POD', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' }},
      16: {{ name: 'AI Agency (AAA)', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' }},
      17: {{ name: 'Micro-SaaS & Tools', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' }},
      18: {{ name: 'Courses & Community', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' }},
      19: {{ name: 'High-Ticket Copy', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' }},
      20: {{ name: 'Business Intelligence', color: 'bg-lime-500/15 text-lime-300 border-lime-500/30' }},

      // AI Money 11-20 (21-30)
      21: {{ name: 'Executive Ghostwriting', color: 'bg-cyan-500/15 text-cyan-300 border-emerald-500/30' }},
      22: {{ name: 'Stock Art & Licensing', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30' }},
      23: {{ name: 'Translation & Dubbing', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' }},
      24: {{ name: 'Sales Chatbots', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30' }},
      25: {{ name: 'Podcasting & Audio', color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' }},
      26: {{ name: 'Paid Media & Ads', color: 'bg-pink-500/15 text-pink-300 border-amber-500/30' }},
      27: {{ name: 'Game Dev & Lore', color: 'bg-red-500/15 text-red-300 border-red-500/30' }},
      28: {{ name: 'Substack Newsletters', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' }},
      29: {{ name: 'Deal Sourcing', color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' }},
      30: {{ name: 'Enterprise AI Consulting', color: 'bg-cyan-500/15 text-cyan-300 border-emerald-500/30' }}
    }};

    const webCats = [
      {{ id: 1, label: '1. Architecture' }},
      {{ id: 2, label: '2. UI/UX Design' }},
      {{ id: 3, label: '3. Frontend' }},
      {{ id: 4, label: '4. Backend & API' }},
      {{ id: 5, label: '5. Database' }},
      {{ id: 6, label: '6. Security' }},
      {{ id: 7, label: '7. Testing & QA' }},
      {{ id: 8, label: '8. Performance' }},
      {{ id: 9, label: '9. DevOps' }},
      {{ id: 10, label: '10. CRO & Copy' }}
    ];

    const moneyCats = [
      {{ id: 11, label: '1. Digital Products' }},
      {{ id: 12, label: '2. Freelancing' }},
      {{ id: 13, label: '3. Content Creator' }},
      {{ id: 14, label: '4. Affiliate Marketing' }},
      {{ id: 15, label: '5. E-Commerce & POD' }},
      {{ id: 16, label: '6. AI Agency (AAA)' }},
      {{ id: 17, label: '7. Micro-SaaS' }},
      {{ id: 18, label: '8. Courses & Community' }},
      {{ id: 19, label: '9. High-Ticket Copy' }},
      {{ id: 20, label: '10. Business Intelligence' }},
      {{ id: 21, label: '11. Executive Ghostwriting' }},
      {{ id: 22, label: '12. Stock Art & Licensing' }},
      {{ id: 23, label: '13. Translation & Dubbing' }},
      {{ id: 24, label: '14. Sales Chatbots' }},
      {{ id: 25, label: '15. Podcasting & Audio' }},
      {{ id: 26, label: '16. Paid Media & Ads' }},
      {{ id: 27, label: '17. Game Dev & Lore' }},
      {{ id: 28, label: '18. Substack Newsletters' }},
      {{ id: 29, label: '19. Deal Sourcing' }},
      {{ id: 30, label: '20. Enterprise AI Consulting' }}
    ];

    function setViewMode(mode) {{
      viewMode = mode;
      const btnReader = document.getElementById('btn-view-reader');
      const btnGrid = document.getElementById('btn-view-grid');
      if (mode === 'reader') {{
        btnReader.className = 'px-3 py-1.5 rounded-md font-semibold bg-cyan-600 text-white flex items-center gap-1.5 transition shadow-sm';
        btnGrid.className = 'px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition';
      }} else {{
        btnGrid.className = 'px-3 py-1.5 rounded-md font-semibold bg-sky-600 text-white flex items-center gap-1.5 transition shadow-sm';
        btnReader.className = 'px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition';
      }}
      renderPrompts();
    }}

    function adjustFontSize(delta) {{
      currentFontSize = Math.max(12, Math.min(20, currentFontSize + delta));
      document.documentElement.style.setProperty('--reader-font-size', currentFontSize + 'px');
      showToast(`ขนาดตัวอักษร: ${{currentFontSize}}px`);
    }}

    function filterDifficulty(diff) {{
      selectedDifficulty = diff;
      document.querySelectorAll('.diff-btn').forEach(btn => {{
        if (btn.getAttribute('data-diff') === diff) {{
          btn.className = 'diff-btn px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold border border-emerald-400';
        }} else {{
          btn.className = 'diff-btn px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700';
        }}
      }});
      renderPrompts();
    }}

    function switchMode(mode) {{
      currentMode = mode;
      currentCategory = 0;

      ['all', 'money', 'web'].forEach(m => {{
        const b = document.getElementById(`mode-btn-${{m}}`);
        if (m === mode) {{
          if (m === 'money') {{
            b.className = 'w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-cyan-600/20 border border-emerald-500/30';
          }} else if (m === 'web') {{
            b.className = 'w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-600/20 border border-sky-500/30';
          }} else {{
            b.className = 'w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between bg-slate-700 text-white shadow-md border border-slate-600';
          }}
        }} else {{
          b.className = 'w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60';
        }}
      }});

      renderSidebarCategories();
      renderPrompts();
    }}

    function renderSidebarCategories() {{
      const container = document.getElementById('sidebar-categories');
      container.innerHTML = '';

      let catList = [];
      if (currentMode === 'money') catList = moneyCats;
      else if (currentMode === 'web') catList = webCats;
      else catList = [...moneyCats, ...webCats];

      catList.forEach(c => {{
        const count = PROMPTS.filter(p => p.categoryId === c.id).length;
        const btn = document.createElement('button');
        const isActive = currentCategory === c.id;
        btn.className = isActive
          ? 'w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-emerald-500/40 flex items-center justify-between'
          : 'w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center justify-between transition';
        btn.innerHTML = `<span>${{c.label}}</span> <span class="font-mono text-[11px] opacity-70">${{count}}</span>`;
        btn.onclick = () => filterCategory(c.id);
        container.appendChild(btn);
      }});
    }}

    function filterCategory(catId) {{
      currentCategory = catId;
      renderSidebarCategories();
      renderPrompts();
    }}

    function handleSearch() {{
      searchQuery = document.getElementById('search-input').value.trim().toLowerCase();
      const clearBtn = document.getElementById('btn-clear-search');
      if (searchQuery.length > 0) {{
        clearBtn.classList.remove('hidden');
      }} else {{
        clearBtn.classList.add('hidden');
      }}
      renderPrompts();
    }}

    function clearSearch() {{
      document.getElementById('search-input').value = '';
      searchQuery = '';
      document.getElementById('btn-clear-search').classList.add('hidden');
      renderPrompts();
    }}

    function resetAllFilters() {{
      clearSearch();
      currentCategory = 0;
      selectedDifficulty = '';
      document.querySelectorAll('.diff-btn').forEach((b, i) => {{
        b.className = i === 0 ? 'diff-btn px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold border border-emerald-400' : 'diff-btn px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700';
      }});
      if (filterOnlyFavorites) toggleFavoriteFilter();
      renderSidebarCategories();
      renderPrompts();
    }}

    function toggleFavorite(id, event) {{
      if (event) event.stopPropagation();
      const idx = favorites.indexOf(id);
      if (idx > -1) {{
        favorites.splice(idx, 1);
        showToast('นำออกจากรายการโปรดแล้ว');
      }} else {{
        favorites.push(id);
        showToast('เพิ่มในรายการโปรดแล้ว ');
      }}
      localStorage.setItem('web_prompts_favs', JSON.stringify(favorites));
      updateFavBadge();
      renderPrompts();
    }}

    function toggleFavoriteFilter() {{
      filterOnlyFavorites = !filterOnlyFavorites;
      const btn = document.getElementById('btn-fav-filter');
      if (filterOnlyFavorites) {{
        btn.classList.add('bg-pink-500/20', 'border-amber-500/50', 'text-pink-300');
        btn.classList.remove('bg-slate-800/80', 'text-slate-300');
      }} else {{
        btn.classList.remove('bg-pink-500/20', 'border-amber-500/50', 'text-pink-300');
        btn.classList.add('bg-slate-800/80', 'text-slate-300');
      }}
      renderPrompts();
    }}

    function updateFavBadge() {{
      document.getElementById('fav-count-badge').textContent = favorites.length;
    }}

    function updateCounters() {{
      const moneyCount = PROMPTS.filter(p => p.mode === 'money').length;
      const webCount = PROMPTS.filter(p => p.mode === 'web').length;
      document.getElementById('prompt-count-pill').textContent = PROMPTS.length + ' Prompts';
      document.getElementById('mode-count-all').textContent = PROMPTS.length;
      document.getElementById('mode-count-money').textContent = moneyCount;
      document.getElementById('mode-count-web').textContent = webCount;
    }}

    function copyPromptText(id, event) {{
      if (event) event.stopPropagation();
      const item = PROMPTS.find(p => p.id === id);
      if (!item) return;
      navigator.clipboard.writeText(item.prompt).then(() => {{
        showToast(`คัดลอก Prompt #${{id}} สำเร็จ!`);
      }});
    }}

    function showToast(msg) {{
      const toast = document.getElementById('toast');
      document.getElementById('toast-message').textContent = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {{
        toast.classList.add('translate-y-20', 'opacity-0');
      }}, 2500);
    }}

    function expandAllPrompts() {{
      document.querySelectorAll('.prompt-full-box').forEach(el => {{
        el.classList.remove('max-h-64');
      }});
      showToast('ขยายกล่องข้อความทั้งหมดแล้ว');
    }}

    function collapseAllPrompts() {{
      document.querySelectorAll('.prompt-full-box').forEach(el => {{
        el.classList.add('max-h-64');
      }});
      showToast('ย่อกล่องข้อความแล้ว');
    }}

    // Export Hub Actions
    function openExportModal() {{
      document.getElementById('modal-export').classList.remove('hidden');
    }}
    function closeExportModal() {{
      document.getElementById('modal-export').classList.add('hidden');
    }}
    function triggerPrintEbook() {{
      closeExportModal();
      window.print();
    }}

    function exportToJson() {{
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(PROMPTS, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'master_prompts_300.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      closeExportModal();
      showToast('ดาวน์โหลดไฟล์ JSON (300 Prompts) เรียบร้อย!');
    }}

    function exportToMarkdown() {{
      let md = '#  Master Prompts Collection (300 Master Prompts)\\n\\n';
      PROMPTS.forEach(p => {{
        md += `## #${{p.id}} ${{p.title}}\\n`;
        md += `**หมวด**: ${{p.categoryName}} | **บทบาท**: ${{p.role}}\\n\\n`;
        md += '```markdown\\n' + p.prompt + '\\n```\\n\\n---\\n\\n';
      }});
      const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'master_prompts_300.md');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      closeExportModal();
      showToast('ดาวน์โหลดไฟล์ Markdown เรียบร้อย!');
    }}

    function exportToCsv() {{
      const headers = ['ID', 'Mode', 'Category', 'Title', 'Role', 'Income_or_Level', 'Timeframe', 'Tools', 'Prompt'];
      const rows = PROMPTS.map(p => [
        p.id,
        p.mode,
        `"${{(p.categoryName || '').replace(/"/g, '""')}}"`,
        `"${{(p.title || '').replace(/"/g, '""')}}"`,
        `"${{(p.role || '').replace(/"/g, '""')}}"`,
        `"${{(p.income || p.level || '').replace(/"/g, '""')}}"`,
        `"${{(p.timeframe || p.tech || '').replace(/"/g, '""')}}"`,
        `"${{(p.tools ? p.tools.join(', ') : '').replace(/"/g, '""')}}"`,
        `"${{(p.prompt || '').replace(/"/g, '""')}}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\\n');
      const blob = new Blob(["\\ufeff" + csvContent], {{ type: 'text/csv;charset=utf-8;' }});
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute('download', 'master_prompts_300_notion_excel.csv');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      closeExportModal();
      showToast('ดาวน์โหลดไฟล์ CSV สำหรับ Notion/Excel สำเร็จ! ');
    }}

    // Render Prompts (Reader Stream Mode & Grid Mode)
    function renderPrompts() {{
      const container = document.getElementById('prompts-container');
      const emptyState = document.getElementById('empty-state');
      container.innerHTML = '';

      let filtered = PROMPTS.filter(p => {{
        if (currentMode !== 'all' && p.mode !== currentMode) return false;
        if (currentCategory !== 0 && p.categoryId !== currentCategory) return false;
        if (selectedDifficulty && p.difficulty && p.difficulty !== selectedDifficulty) return false;
        if (filterOnlyFavorites && !favorites.includes(p.id)) return false;
        if (searchQuery) {{
          const matchTitle = (p.title || '').toLowerCase().includes(searchQuery);
          const matchRole = (p.role || '').toLowerCase().includes(searchQuery);
          const matchPrompt = (p.prompt || '').toLowerCase().includes(searchQuery);
          const matchCategory = (p.categoryName || '').toLowerCase().includes(searchQuery);
          const matchTools = (p.tools ? p.tools.join(' ') : '').toLowerCase().includes(searchQuery);
          if (!matchTitle && !matchRole && !matchPrompt && !matchCategory && !matchTools) return false;
        }}
        return true;
      }});

      document.getElementById('result-counter').textContent = `แสดง ${{filtered.length}} จาก ${{PROMPTS.length}} รายการ`;
      
      let activeLabel = 'ทุกหมวดหมู่';
      if (currentCategory !== 0) {{
        const meta = categoryMeta[currentCategory];
        if (meta) activeLabel = meta.name;
      }}
      document.getElementById('active-category-label').textContent = `${{currentMode === 'money' ? ' โหมดหาเงิน (200 ข้อ)' : currentMode === 'web' ? ' โหมดสร้างเว็บ (100 ข้อ)' : ' ทั้งหมด (300 ข้อ)'}} > ${{activeLabel}}`;

      if (filtered.length === 0) {{
        emptyState.classList.remove('hidden');
        return;
      }}
      emptyState.classList.add('hidden');

      if (viewMode === 'grid') {{
        container.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5';
        filtered.forEach(p => {{
          const isFav = favorites.includes(p.id);
          const catInfo = categoryMeta[p.categoryId] || {{ name: p.categoryName || 'General', color: 'bg-slate-700' }};
          const isMoney = p.mode === 'money';

          const card = document.createElement('div');
          card.className = `glass-card ${{isMoney ? 'money-card' : ''}} rounded-2xl p-5 flex flex-col justify-between transition duration-200 group relative`;

          const previewLines = (p.prompt || '').split('\\n').slice(0, 5).join('\\n');

          card.innerHTML = `
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${{catInfo.color}}">
                    #${{String(p.id).padStart(2, '0')}} ${{catInfo.name}}
                  </span>
                  ${{isMoney ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300"> AI หาเงิน</span>' : ''}}
                </div>
                <div class="flex items-center gap-1">
                  <button onclick="toggleFavorite(${{p.id}}, event)" class="p-1 text-slate-400 hover:text-pink-400 transition text-sm">
                    ${{isFav ? '' : '☆'}}
                  </button>
                  <button onclick="deletePrompt(${{p.id}}, event)" class="p-1 text-slate-500 hover:text-rose-400 transition text-xs">
                    
                  </button>
                </div>
              </div>

              <h3 class="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition line-clamp-1 mb-1">
                ${{p.title}}
              </h3>

              <p class="text-xs font-mono text-cyan-400/80 mb-2 truncate">
                ${{p.role ? `คุณคือ ${{p.role}}` : ''}}
              </p>

              <!-- Mini Badges -->
              <div class="flex items-center gap-1.5 flex-wrap text-[10px] mb-3">
                ${{p.income ? `<span class="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-emerald-500/20"> ${{p.income}}</span>` : ''}}
                ${{p.timeframe ? `<span class="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-amber-500/20">⏱ ${{p.timeframe}}</span>` : ''}}
                ${{p.difficulty ? `<span class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">${{p.difficulty}}</span>` : ''}}
              </div>

              <div class="prompt-box rounded-xl p-3 text-[11px] font-mono text-slate-300 line-clamp-4 leading-relaxed mb-4 select-none">
                ${{previewLines.replace(/</g, '&lt;').replace(/>/g, '&gt;')}}
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-cyan-900/50/80">
              <button onclick="openCustomizer(${{p.id}}, 'vars')" class="py-2 px-2 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition">
                <span>⚙</span> ปรับแต่ง
              </button>
              <button onclick="openCustomizer(${{p.id}}, 'ai')" class="py-2 px-2 rounded-lg text-xs font-semibold bg-cyan-600/20 hover:bg-cyan-500 text-cyan-300 hover:text-white border border-emerald-500/30 flex items-center justify-center gap-1 transition">
                <span></span> รัน AI
              </button>
              <button onclick="copyPromptText(${{p.id}}, event)" class="py-2 px-2 rounded-lg text-xs font-semibold bg-sky-600/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/30 flex items-center justify-center gap-1 transition">
                <span></span> คัดลอก
              </button>
            </div>
          `;
          container.appendChild(card);
        }});
      }} else {{
        container.className = 'space-y-6';
        filtered.forEach(p => {{
          const isFav = favorites.includes(p.id);
          const catInfo = categoryMeta[p.categoryId] || {{ name: p.categoryName || 'General', color: 'bg-slate-700' }};
          const isMoney = p.mode === 'money';

          let formattedPrompt = (p.prompt || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          formattedPrompt = formattedPrompt.replace(/\\[([^\\]]+)\\]/g, '<span class="prompt-var-tag">[$1]</span>');

          const article = document.createElement('article');
          article.className = `glass-card ${{isMoney ? 'money-card' : ''}} rounded-2xl p-6 transition duration-200`;
          article.id = `prompt-${{p.id}}`;

          article.innerHTML = `
            <!-- Item Header -->
            <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-cyan-900/50/80">
              <div>
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${{catInfo.color}}">
                    #${{String(p.id).padStart(2, '0')}} ${{catInfo.name}}
                  </span>
                  ${{isMoney ? '<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-emerald-500/30"> โหมดหาเงิน</span>' : '<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30"> วิศวกรรมเว็บ</span>'}}
                  
                  <!-- Rich Intelligence Badges -->
                  ${{p.income ? `<span class="px-2 py-0.5 rounded-md text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-emerald-700/50"> ${{p.income}}</span>` : ''}}
                  ${{p.timeframe ? `<span class="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-950/80 text-pink-300 border border-amber-700/50">⏱ เริ่มได้ใน ${{p.timeframe}}</span>` : ''}}
                  ${{p.difficulty ? `<span class="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/50"> ${{p.difficulty}}</span>` : ''}}
                  ${{p.level ? `<span class="px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/50"> ${{p.level}}</span>` : ''}}
                </div>

                <h2 class="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition">
                  ${{p.title}}
                </h2>
                ${{p.role ? `<div class="text-xs font-mono text-cyan-400 mt-1">บทบาท AI: <span class="text-slate-300 font-sans font-medium">คุณคือ ${{p.role}}</span></div>` : ''}}

                <!-- Recommended Tools -->
                ${{p.tools && p.tools.length > 0 ? `
                  <div class="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] text-slate-400">
                    <span class="text-slate-500"> เครื่องมือแนะนำ:</span>
                    ${{p.tools.map(t => `<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">${{t}}</span>`).join('')}}
                  </div>
                ` : ''}}
              </div>

              <!-- Top Quick Actions -->
              <div class="flex items-center gap-2 no-print">
                <button onclick="toggleFavorite(${{p.id}}, event)" class="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition">
                  <span>${{isFav ? '' : '☆'}}</span>
                  <span class="hidden sm:inline">${{isFav ? 'บันทึกแล้ว' : 'รายการโปรด'}}</span>
                </button>
                <button onclick="copyPromptText(${{p.id}}, event)" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-sm transition">
                  <span></span> คัดลอก Prompt
                </button>
                <button onclick="deletePrompt(${{p.id}}, event)" class="p-1.5 text-slate-500 hover:text-rose-400 transition text-xs" title="ลบ Prompt">
                  
                </button>
              </div>
            </div>

            <!-- Full Prompt Body (Un-truncated, Easy to Read) -->
            <div class="mt-4">
              <div class="prompt-box prompt-full-box rounded-xl p-4 sm:p-5 font-mono text-slate-200 reader-text whitespace-pre-wrap leading-relaxed border border-cyan-900/50 overflow-y-auto custom-scrollbar select-text">
${{formattedPrompt}}
              </div>
            </div>

            <!-- Bottom Tool Actions -->
            <div class="mt-4 pt-3 border-t border-cyan-900/50/80 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
              <div class="flex items-center gap-2">
                <button onclick="openCustomizer(${{p.id}}, 'vars')" class="px-3.5 py-2 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition">
                  <span>⚙ ปรับแต่งตัวแปรในวงเล็บ</span>
                </button>
                <button onclick="openCustomizer(${{p.id}}, 'ai')" class="px-3.5 py-2 rounded-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-1.5 shadow-md transition">
                  <span> รันผลลัพธ์ผ่าน AI ทันที</span>
                </button>
                <button onclick="openCustomizer(${{p.id}}, 'code')" class="px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition">
                  <span> ดูโค้ด SDK</span>
                </button>
              </div>

              <div class="flex items-center gap-2">
                <button onclick="openExternalAi('chatgpt', ${{p.id}})" class="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition">
                  ChatGPT ↗
                </button>
                <button onclick="openExternalAi('claude', ${{p.id}})" class="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition">
                  Claude ↗
                </button>
              </div>
            </div>
          `;
          container.appendChild(article);
        }});
      }}
    }}

    function openExternalAi(service, id) {{
      const item = PROMPTS.find(p => p.id === id);
      if (!item) return;
      if (service === 'chatgpt') {{
        const url = 'https://chat.openai.com/?q=' + encodeURIComponent(item.prompt);
        window.open(url, '_blank');
      }} else {{
        navigator.clipboard.writeText(item.prompt).then(() => {{
          showToast('คัดลอก Prompt แล้ว กำลังเปิด Claude...');
          window.open('https://claude.ai/new', '_blank');
        }});
      }}
    }}

    // Customizer Modal
    function openCustomizer(id, startTab = 'vars') {{
      const item = PROMPTS.find(p => p.id === id);
      if (!item) return;
      activeCustomizingPrompt = item;
      variableValues = {{}};

      const catInfo = categoryMeta[item.categoryId] || {{ name: item.categoryName || 'General', color: 'bg-slate-700' }};
      document.getElementById('modal-cat-badge').textContent = `#${{String(item.id).padStart(2, '0')}} · ${{catInfo.name}}`;
      document.getElementById('modal-title').textContent = item.title;
      document.getElementById('modal-role').textContent = `คุณคือ ${{item.role}}`;

      const container = document.getElementById('variable-inputs-container');
      container.innerHTML = '';

      if (item.variables && item.variables.length > 0) {{
        item.variables.forEach((v) => {{
          variableValues[v] = '';
          const div = document.createElement('div');
          div.className = 'flex flex-col gap-1';
          div.innerHTML = `
            <label class="text-xs text-slate-400 font-mono">[${{v}}]</label>
            <input 
              type="text" 
              placeholder="ระบุค่าแทน ${{v.split(',')[0]}}..." 
              class="w-full px-3 py-2 bg-slate-950 border border-cyan-900/50 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
              data-var="${{v.replace(/"/g, '&quot;')}}"
              oninput="onVarInput(this)"
            >
          `;
          container.appendChild(div);
        }});
      }} else {{
        container.innerHTML = '<div class="text-xs text-slate-500 italic">ไม่มีตัวแปร [ ... ] ใน Prompt นี้ สามารถนำไปใช้ได้ทันที</div>';
      }}

      updateLivePreview();
      switchModalTab(startTab);
      document.getElementById('modal-customizer').classList.remove('hidden');
    }}

    function onVarInput(el) {{
      const v = el.getAttribute('data-var');
      variableValues[v] = el.value;
      updateLivePreview();
    }}

    function getCustomizedPromptText() {{
      if (!activeCustomizingPrompt) return '';
      let text = activeCustomizingPrompt.prompt;
      for (const [key, val] of Object.entries(variableValues)) {{
        if (val && val.trim() !== '') {{
          text = text.replaceAll(`[${{key}}]`, val.trim());
        }}
      }}
      return text;
    }}

    function updateLivePreview() {{
      const text = getCustomizedPromptText();
      document.getElementById('live-prompt-preview').textContent = text;
      showCodeSnippet(activeCodeSnippetLang);
    }}

    function switchModalTab(tab) {{
      const tabs = ['vars', 'code', 'ai'];
      tabs.forEach(t => {{
        const btn = document.getElementById(`tab-btn-${{t}}`);
        const content = document.getElementById(`tab-content-${{t}}`);
        if (t === tab) {{
          btn.className = 'py-3 border-b-2 border-emerald-500 text-cyan-400 font-semibold flex items-center gap-2';
          content.classList.remove('hidden');
        }} else {{
          btn.className = 'py-3 border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition flex items-center gap-2';
          content.classList.add('hidden');
        }}
      }});
      if (tab === 'code') showCodeSnippet(activeCodeSnippetLang);
    }}

    function showCodeSnippet(lang) {{
      activeCodeSnippetLang = lang;
      const text = getCustomizedPromptText();
      const escaped = JSON.stringify(text);

      ['python', 'node', 'curl'].forEach(l => {{
        const b = document.getElementById(`code-btn-${{l}}`);
        if (l === lang) {{
          b.className = 'px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold';
        }} else {{
          b.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700';
        }}
      }});

      let code = '';
      if (lang === 'python') {{
        code = `# Google GenAI Python SDK (gemini-2.5-flash)
from google import genai

client = genai.Client()
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=${{escaped}},
)
print(response.text)
`;
      }} else if (lang === 'node') {{
        code = `// Google GenAI JavaScript/TypeScript SDK
import {{ GoogleGenAI }} from '@google/genai';

const ai = new GoogleGenAI();
const response = await ai.models.generateContent({{
  model: 'gemini-2.5-flash',
  contents: ${{escaped}},
}});
console.log(response.text);
`;
      }} else {{
        code = `curl https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY \\\\
  -H 'Content-Type: application/json' \\\\
  -X POST \\\\
  -d '{{"contents": [{{"parts": [{{"text": ${{escaped}} }}]}}]}}'
`;
      }}
      document.getElementById('code-snippet-box').textContent = code;
    }}

    function copyCurrentSnippet() {{
      const code = document.getElementById('code-snippet-box').textContent;
      navigator.clipboard.writeText(code).then(() => {{
        showToast('คัดลอกโค้ด SDK สำเร็จ!');
      }});
    }}

    async function runAiGeneration() {{
      const promptText = getCustomizedPromptText();
      const apiKey = localStorage.getItem('gemini_api_key') || '';
      const btn = document.getElementById('btn-run-ai');
      const outBox = document.getElementById('ai-output-box');
      const copyBtn = document.getElementById('btn-copy-ai-output');

      if (!apiKey) {{
        openApiKeyModal();
        outBox.innerHTML = '<span class="text-pink-400 font-medium"> กรุณากรอก Gemini API Key เพื่อเริ่มรันคำสั่งสด<br><span class="text-slate-400 text-xs">สามารถรับ API Key ฟรีได้จาก <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-cyan-400 underline">Google AI Studio</a> แล้วนำมากรอกในช่องด้านบน</span></span>';
        return;
      }}

      btn.disabled = true;
      document.getElementById('btn-run-ai-icon').textContent = '';
      document.getElementById('btn-run-ai-text').textContent = 'กำลังประมวลผลกับ AI...';
      outBox.innerHTML = '<span class="text-cyan-400 animate-pulse">กำลังประมวลผลคำสั่งกับโมเดล Gemini 2.5 Flash...</span>';

      // 1. Direct call to Google Gemini REST API (CORS supported, works 100% on GitHub Pages & Localhost)
      try {{
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
        const res = await fetch(url, {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{
            contents: [{{
              parts: [{{ text: promptText }}]
            }}],
            generationConfig: {{
              temperature: 0.7,
              maxOutputTokens: 2048
            }}
          }})
        }});

        const data = await res.json();
        if (res.ok) {{
          const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '(ไม่มีข้อความตอบกลับจากแบบจำลอง)';
          outBox.textContent = textOutput;
          copyBtn.classList.remove('hidden');
          showToast('สร้างผลลัพธ์สำเร็จ! ');
        }} else {{
          // Fallback to gemini-1.5-flash if needed
          const fallbackUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
          const fbRes = await fetch(fallbackUrl, {{
            method: 'POST',
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify({{
              contents: [{{ parts: [{{ text: promptText }}] }}]
            }})
          }});
          const fbData = await fbRes.json();
          if (fbRes.ok) {{
            outBox.textContent = fbData.candidates?.[0]?.content?.parts?.[0]?.text || '(ไม่มีข้อความตอบกลับ)';
            copyBtn.classList.remove('hidden');
            showToast('สร้างผลลัพธ์สำเร็จด้วย Gemini 1.5 Flash! ');
          }} else {{
            outBox.textContent = ' Gemini API Error: ' + (data.error?.message || JSON.stringify(data.error));
          }}
        }}
      }} catch (directErr) {{
        // 2. Fallback to local server /api/generate if direct connection blocked
        try {{
          const localRes = await fetch('/api/generate', {{
            method: 'POST',
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify({{ prompt: promptText, apiKey: apiKey }})
          }});
          const localData = await localRes.json();
          if (localRes.ok) {{
            outBox.textContent = localData.output;
            copyBtn.classList.remove('hidden');
          }} else {{
            outBox.textContent = ' Error: ' + (localData.error || 'Failed');
          }}
        }} catch (localErr) {{
          outBox.textContent = ' Network Error: ไม่สามารถเชื่อมต่อ API ได้ (' + directErr.message + ')';
        }}
      }} finally {{
        btn.disabled = false;
        document.getElementById('btn-run-ai-icon').textContent = '';
        document.getElementById('btn-run-ai-text').textContent = 'สร้างผลลัพธ์เดี๋ยวนี้';
      }}
    }}

    function copyAiOutput() {{
      const text = document.getElementById('ai-output-box').textContent;
      navigator.clipboard.writeText(text).then(() => {{
        showToast('คัดลอกผลลัพธ์ AI เรียบร้อย!');
      }});
    }}

    function closeCustomizer() {{
      document.getElementById('modal-customizer').classList.add('hidden');
      activeCustomizingPrompt = null;
    }}

    function copyCustomizedPrompt() {{
      const text = getCustomizedPromptText();
      navigator.clipboard.writeText(text).then(() => {{
        showToast('คัดลอก Prompt สำเร็จ! ');
        closeCustomizer();
      }});
    }}

    function openInChatGPT() {{
      const text = getCustomizedPromptText();
      const url = 'https://chat.openai.com/?q=' + encodeURIComponent(text);
      window.open(url, '_blank');
    }}

    function openInClaude() {{
      const text = getCustomizedPromptText();
      navigator.clipboard.writeText(text).then(() => {{
        showToast('คัดลอกแล้ว กำลังเปิด Claude...');
        window.open('https://claude.ai/new', '_blank');
      }});
    }}

    // CRUD: Add Prompt (Supports both Localhost API & GitHub Pages localStorage)
    function getStoredCustomPrompts() {{
      try {{
        return JSON.parse(localStorage.getItem('web_prompts_custom') || '[]');
      }} catch(e) {{
        return [];
      }}
    }}

    function saveCustomPromptsToStorage(list) {{
      localStorage.setItem('web_prompts_custom', JSON.stringify(list));
    }}

    function mergeCustomPrompts() {{
      const customList = getStoredCustomPrompts();
      if (customList.length > 0) {{
        const existingIds = new Set(PROMPTS.map(p => p.id));
        customList.forEach(cp => {{
          if (!existingIds.has(cp.id)) {{
            PROMPTS.unshift(cp);
          }}
        }});
      }}
    }}

    function openNewPromptModal() {{
      updateNewPromptCatOptions();
      document.getElementById('modal-new-prompt').classList.remove('hidden');
    }}
    function closeNewPromptModal() {{
      document.getElementById('modal-new-prompt').classList.add('hidden');
    }}
    function updateNewPromptCatOptions() {{
      const mode = document.getElementById('new-prompt-mode').value;
      const select = document.getElementById('new-prompt-cat');
      select.innerHTML = '';
      const list = mode === 'money' ? moneyCats : webCats;
      list.forEach(c => {{
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.label;
        select.appendChild(opt);
      }});
    }}
    async function saveNewPrompt() {{
      const mode = document.getElementById('new-prompt-mode').value;
      const catId = parseInt(document.getElementById('new-prompt-cat').value);
      const catSelect = document.getElementById('new-prompt-cat');
      const catName = catSelect.options[catSelect.selectedIndex].text;
      const title = document.getElementById('new-prompt-title').value.trim();
      const role = document.getElementById('new-prompt-role').value.trim();
      const content = document.getElementById('new-prompt-content').value.trim();

      if (!title || !content) {{
        alert('กรุณากรอกชื่อและเนื้อหา Prompt');
        return;
      }}

      let savedViaApi = false;
      try {{
        const res = await fetch('/api/prompts', {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{ mode, categoryId: catId, categoryName: catName, title, role, prompt: content }})
        }});
        if (res.ok) {{
          savedViaApi = true;
          await fetchPromptsFromApi();
        }}
      }} catch (err) {{}}

      if (!savedViaApi) {{
        // Offline / GitHub Pages mode: Save to localStorage
        const customList = getStoredCustomPrompts();
        const newId = (PROMPTS.length ? Math.max(...PROMPTS.map(p => p.id)) : 0) + 1;
        const matches = content.match(/\\[([^\\]]+)\\]/g) || [];
        const variables = Array.from(new Set(matches.map(m => m.slice(1, -1))));

        const newPromptObj = {{
          id: newId,
          mode: mode,
          categoryId: catId,
          categoryName: catName,
          title: title,
          role: role || (mode === 'money' ? 'AI Entrepreneur' : 'Full Stack Developer'),
          prompt: content,
          variables: variables,
          level: mode === 'money' ? 'รายได้ 20,000 - 100,000+ บาท/เดือน' : 'Intermediate',
          tech: mode === 'money' ? 'AI Monetization' : 'Web Engineering',
          tools: ['Custom Prompt', 'User Saved']
        }};

        customList.unshift(newPromptObj);
        saveCustomPromptsToStorage(customList);
        PROMPTS.unshift(newPromptObj);
        updateCounters();
        renderSidebarCategories();
        renderPrompts();
      }}

      showToast('เพิ่ม Prompt ใหม่สำเร็จ! ');
      closeNewPromptModal();
    }}

    async function deletePrompt(id, event) {{
      if (event) event.stopPropagation();
      if (!confirm(`คุณต้องการลบ Prompt #${{id}} หรือไม่?`)) return;

      try {{
        await fetch(`/api/prompts/${{id}}`, {{ method: 'DELETE' }});
      }} catch (err) {{}}

      const customList = getStoredCustomPrompts().filter(p => p.id !== id);
      saveCustomPromptsToStorage(customList);
      PROMPTS = PROMPTS.filter(p => p.id !== id);

      updateCounters();
      renderSidebarCategories();
      renderPrompts();
      showToast(`ลบ Prompt #${{id}} สำเร็จ`);
    }}

    // API Key Settings
    function openApiKeyModal() {{
      document.getElementById('input-api-key').value = localStorage.getItem('gemini_api_key') || '';
      document.getElementById('modal-api-key').classList.remove('hidden');
    }}
    function closeApiKeyModal() {{
      document.getElementById('modal-api-key').classList.add('hidden');
    }}
    function saveApiKey() {{
      const val = document.getElementById('input-api-key').value.trim();
      if (val) {{
        localStorage.setItem('gemini_api_key', val);
        showToast('บันทึก Gemini API Key เรียบร้อย');
      }} else {{
        localStorage.removeItem('gemini_api_key');
      }}
      updateApiKeyIndicator();
      closeApiKeyModal();
    }}
    function clearApiKey() {{
      localStorage.removeItem('gemini_api_key');
      document.getElementById('input-api-key').value = '';
      updateApiKeyIndicator();
      showToast('ล้าง API Key แล้ว');
    }}
    function updateApiKeyIndicator() {{
      const k = localStorage.getItem('gemini_api_key');
      const ind = document.getElementById('api-key-indicator');
      if (k) {{
        ind.className = 'w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50';
      }} else {{
        ind.className = 'w-2 h-2 rounded-full bg-pink-500';
      }}
    }}

    async function fetchPromptsFromApi() {{
      try {{
        const res = await fetch('/api/prompts');
        if (res.ok) {{
          PROMPTS = await res.json();
        }}
      }} catch (e) {{}}
      mergeCustomPrompts();
      updateCounters();
      renderSidebarCategories();
      renderPrompts();
    }}

    window.addEventListener('keydown', (e) => {{
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {{
        e.preventDefault();
        document.getElementById('search-input').focus();
      }}
      if (e.key === 'Escape') {{
        closeCustomizer();
        closeNewPromptModal();
        closeApiKeyModal();
        closeExportModal();
      }}
    }});

    // Init
    mergeCustomPrompts();
    updateFavBadge();
    updateApiKeyIndicator();
    updateCounters();
    switchMode('money');
    fetchPromptsFromApi();
  </script>
</body>
</html>
"""

with open('web_prompt_hub.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Successfully generated Prompt Hub MAX with 300 Prompts (200 AI Money + 100 Web Dev)!')

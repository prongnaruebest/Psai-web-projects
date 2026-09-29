/**
 * Smart Zone AI (sZai) - PDF Studio & Interactive Flipbook
 * 100% Client-Side Private PDF Toolkit
 */

// Initialize PDF.js worker
if (window.pdfjsLib) {
  // On file:/// protocol, creating a Web Worker from a local file triggers a browser security error (origin null).
  // Because pdf.worker.min.js is included in <script>, globalThis.pdfjsWorker is already loaded and ready!
  if (window.location.protocol !== 'file:') {
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.min.js';
    } catch (e) {}
  }
}

// State Management
const state = {
  currentTab: 'home',
  theme: localStorage.getItem('szai_theme') || 'clear',
  lang: 'th', // 'th' or 'en'
  soundEnabled: true,
  audioCtx: null,

  // Global uploaded file / demo
  currentFile: null,
  currentPdfDoc: null, // PDF.js doc proxy
  currentPdfBytes: null, // Uint8Array
  pageCount: 0,
  pageImages: [], // Array of data URLs for flipbook / thumbnails
  
  // Flipbook state
  flipbookInstance: null,
  flipbookPage: 0,
  autoPlayTimer: null,
  
  // Editor state
  editorPage: 1,
  editorTool: 'select', // 'select', 'text', 'draw', 'highlight', 'redact', 'rect', 'signature', 'stamp'
  editorColor: '#1fe0ad',
  editorLineWidth: 3,
  editorFontSize: 18,
  editorAnnotations: {}, // pageNum -> array of annotations
  editorHistory: [], // Undo stack
  isDrawing: false,
  drawStart: null,
  currentDrawPath: [],

  // Merge state
  mergeFiles: [], // array of { file, name, size, pageCount, bytes }

  // Split state
  splitMode: 'all', // 'all' or 'range'

  // Organize state
  organizePages: [], // array of { originalIndex, rotation, dataUrl }

  // Images state
  imageFormat: 'png',
  imageScale: 2
};

// Translations Dictionary
const i18n = {
  th: {
    brand_sub: "PDF Toolkit & Flipbook",
    privacy_badge: "🔒 ประมวลผลบนเบราว์เซอร์ 100% • ปลอดภัย ไร้การอัปโหลด",
    nav_home: "หน้าหลัก",
    nav_flipbook: "ฟลิปบุ๊ก (Flipbook)",
    nav_edit: "แก้ไข PDF",
    nav_merge: "รวมไฟล์ PDF",
    nav_split: "แยกหน้า PDF",
    nav_organize: "จัดเรียงหน้า",
    nav_images: "แปลงเป็นรูปภาพ",
    hero_title: "เครื่องมือจัดการ PDF <span>ส่วนตัว & ไร้เซิร์ฟเวอร์</span>",
    hero_sub: "สร้างฟลิปบุ๊กสมจริง 3D, แก้ไขเอกสาร, ใส่ลายเซ็น, ปิดข้อความลับ, รวมและแยกหน้า PDF ได้รวดเร็ว ประมวลผลในเครื่องคุณ 100%",
    feature_1: "สมจริงด้วยฟิสิกส์ 3D",
    feature_2: "แก้ไขและลงลายเซ็น",
    feature_3: "ความปลอดภัยสูงสุด",
    feature_4: "ทำงานออฟไลน์ได้",
    drop_title: "ลากและวางไฟล์ PDF ที่นี่",
    drop_sub: "หรือคลิกเพื่อเลือกไฟล์จากคอมพิวเตอร์ของคุณ (รองรับไฟล์สูงสุด 500 MB)",
    btn_select_file: "เลือกไฟล์ PDF",
    btn_load_demo: "📄 โหลดไฟล์ตัวอย่าง Demo",
    btn_export_html: "💾 ส่งออกเป็นเว็บ Flipbook แบบ Standalone",
    btn_save_pdf: "💾 บันทึกและดาวน์โหลด PDF",
    btn_merge_now: "รวมไฟล์ PDF ทั้งหมด",
    btn_split_now: "แยกหน้าและดาวน์โหลด (ZIP)",
    btn_download_zip: "ดาวน์โหลดรูปทั้งหมดเป็น ZIP",
    toast_loaded: "โหลดไฟล์ PDF สำเร็จเรียบร้อย!",
    toast_exported: "สร้างไฟล์สำเร็จแล้ว กำลังดาวน์โหลด...",
    alert_select_pdf: "กรุณาเลือกไฟล์ PDF เท่านั้น"
  },
  en: {
    brand_sub: "PDF Toolkit & Flipbook",
    privacy_badge: "🔒 100% Client-Side • Zero Server Uploads • Private",
    nav_home: "Home",
    nav_flipbook: "Flipbook",
    nav_edit: "Edit PDF",
    nav_merge: "Merge PDFs",
    nav_split: "Split PDF",
    nav_organize: "Organize",
    nav_images: "PDF to Images",
    hero_title: "Private PDF Toolkit & <span>3D Flipbook Studio</span>",
    hero_sub: "Create realistic page-turning books, annotate, redact, sign, merge, split, and convert PDFs directly inside your browser without uploading to any server.",
    feature_1: "Realistic 3D Physics",
    feature_2: "Sign & Annotate",
    feature_3: "Zero Data Uploads",
    feature_4: "Works 100% Offline",
    drop_title: "Drop your PDF file here",
    drop_sub: "or click to browse from your computer (Supports files up to 500 MB)",
    btn_select_file: "Select PDF File",
    btn_load_demo: "📄 Load Sample PDF Demo",
    btn_export_html: "💾 Export Standalone HTML Flipbook",
    btn_save_pdf: "💾 Save & Download PDF",
    btn_merge_now: "Merge All PDFs",
    btn_split_now: "Split & Download (ZIP)",
    btn_download_zip: "Download All Images (ZIP)",
    toast_loaded: "PDF loaded successfully!",
    toast_exported: "Exported successfully! Downloading...",
    alert_select_pdf: "Please select a valid PDF file"
  }
};

// Synthesize realistic page flip swoosh sound using Web Audio API
function playPageFlipSound() {
  if (!state.soundEnabled) return;
  try {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) state.audioCtx = new AudioCtx();
    }
    if (!state.audioCtx) return;
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    const ctx = state.audioCtx;
    const bufferSize = ctx.sampleRate * 0.18; // 180ms swoosh
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered white noise with exponential decay
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI) * Math.exp(-progress * 3);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Lowpass filter for paper warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.18);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    console.warn('Audio playback not supported:', e);
  }
}

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: ${type === 'danger' ? '#ef4444' : '#1fe0ad'}">
      ${type === 'danger' ? '⚠️' : '✨'}
    </span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Loading Spinner Modal
function showLoading(title = 'กำลังประมวลผล...', sub = 'ทำงานในเครื่องของคุณ 100%') {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    document.getElementById('loading-text').textContent = title;
    document.getElementById('loading-subtext').textContent = sub;
    overlay.classList.add('active-loading');
  }
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('active-loading');
}

// Switch Active Tool Tab
function switchTab(tabId) {
  state.currentTab = tabId;

  // Update navbar button states
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Update views
  document.querySelectorAll('.workspace-container').forEach(view => {
    view.classList.remove('active-view');
  });

  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.classList.add('active-view');
  }

  // Hide or show hero & tools grid based on tab
  const homeElements = document.querySelectorAll('.home-only');
  if (tabId === 'home') {
    homeElements.forEach(el => el.style.display = '');
  } else {
    homeElements.forEach(el => el.style.display = 'none');
  }

  // Trigger view-specific re-renders
  if (tabId === 'flipbook' && state.currentPdfDoc) {
    initFlipbook();
  } else if (tabId === 'edit' && state.currentPdfDoc) {
    renderEditorPage(state.editorPage);
  } else if (tabId === 'organize' && state.currentPdfDoc) {
    renderOrganizeGrid();
  } else if (tabId === 'images' && state.currentPdfDoc) {
    renderImagesGrid();
  } else if (tabId === 'merge') {
    renderMergeList();
  }
}

// Load PDF from ArrayBuffer or File
async function loadPdfBytes(arrayBuffer, fileName = 'document.pdf') {
  showLoading('กำลังอ่านและเรนเดอร์ PDF...', 'วิเคราะห์โครงสร้างหน้าเอกสาร');
  try {
    state.currentPdfBytes = new Uint8Array(arrayBuffer);
    state.currentFile = { name: fileName, size: arrayBuffer.byteLength };
    
    // Load with PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: state.currentPdfBytes });
    state.currentPdfDoc = await loadingTask.promise;
    state.pageCount = state.currentPdfDoc.numPages;

    // Render high-res image previews for each page
    state.pageImages = [];
    state.organizePages = [];
    for (let i = 1; i <= state.pageCount; i++) {
      const page = await state.currentPdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      state.pageImages.push(dataUrl);

      state.organizePages.push({
        originalIndex: i - 1,
        rotation: 0,
        dataUrl: dataUrl
      });
    }

    // Update UI headers
    document.querySelectorAll('.file-name-display').forEach(el => el.textContent = fileName);
    document.querySelectorAll('.file-pages-display').forEach(el => el.textContent = `${state.pageCount} หน้า • ${(arrayBuffer.byteLength / (1024 * 1024)).toFixed(2)} MB`);

    showToast(i18n[state.lang].toast_loaded);

    // If still in home tab, automatically suggest switching to Flipbook
    if (state.currentTab === 'home') {
      switchTab('flipbook');
    } else {
      switchTab(state.currentTab);
    }
  } catch (err) {
    console.error('Error loading PDF:', err);
    showToast('เกิดข้อผิดพลาดในการโหลดไฟล์ PDF: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}

// Embedded Base64 for sample.pdf (Guarantees 100% offline & file:/// protocol execution)
const EMBEDDED_SAMPLE_PDF_BASE64 = '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';

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Load Demo Sample PDF (Works 100% offline & under file:/// protocol)
async function loadDemoPdf() {
  showLoading('กำลังโหลดไฟล์ตัวอย่าง Demo...', 'กำลังเปิดเอกสารตัวอย่าง 4 หน้า');
  try {
    let buffer = null;
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch('./sample.pdf');
        if (res.ok) buffer = await res.arrayBuffer();
      } catch (e) {}
    }
    if (!buffer) {
      buffer = base64ToArrayBuffer(EMBEDDED_SAMPLE_PDF_BASE64);
    }
    await loadPdfBytes(buffer, 'SmartZone_Sample_Presentation.pdf');
  } catch (err) {
    console.error('Failed to load demo:', err);
    showToast('ไม่สามารถโหลดไฟล์ตัวอย่างได้: ' + err.message, 'danger');
    hideLoading();
  }
}

/* ==========================================================================
   Tool 1: Interactive Flipbook
   ========================================================================== */
function initFlipbook() {
  const container = document.getElementById('flipbook-wrapper');
  if (!container || !state.pageImages.length) return;

  // Clean previous instance
  if (state.flipbookInstance) {
    try {
      state.flipbookInstance.destroy();
    } catch(e) {}
    state.flipbookInstance = null;
  }
  container.innerHTML = '';

  const bookEl = document.createElement('div');
  bookEl.id = 'st-flipbook';
  container.appendChild(bookEl);

  const containerWidth = Math.min(window.innerWidth - 60, 1000);
  const isMobile = window.innerWidth < 768;
  const bookWidth = isMobile ? Math.min(containerWidth, 480) : Math.min(containerWidth, 880);
  const pageWidth = isMobile ? bookWidth : Math.floor(bookWidth / 2);
  const pageHeight = Math.floor(pageWidth * 1.38);

  try {
    const PageFlip = window.St ? window.St.PageFlip : null;
    if (!PageFlip) throw new Error('PageFlip library is not available');

    const flip = new PageFlip(bookEl, {
      width: pageWidth,
      height: pageHeight,
      size: 'stretch',
      minWidth: 300,
      maxWidth: 1200,
      minHeight: 400,
      maxHeight: 1400,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: isMobile,
      startPage: state.flipbookPage || 0
    });

    flip.loadFromImages(state.pageImages);

    flip.on('flip', (e) => {
      state.flipbookPage = e.data;
      updateFlipbookControls(e.data);
      playPageFlipSound();
    });

    flip.on('changeState', (e) => {
      if (e.data === 'flipping') {
        playPageFlipSound();
      }
    });

    state.flipbookInstance = flip;
    updateFlipbookControls(state.flipbookPage || 0);
    renderFlipbookThumbnails();
  } catch (err) {
    console.warn('PageFlip canvas fallback:', err);
    renderFlipbookFallback(container);
  }
}

function renderFlipbookFallback(container) {
  container.innerHTML = `
    <div style="max-width:800px;width:100%;margin:0 auto;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:8px;box-shadow:var(--book-shadow);overflow:hidden;">
      <img id="fallback-page-img" src="${state.pageImages[state.flipbookPage || 0]}" style="width:100%;height:auto;max-height:650px;object-fit:contain;display:block;" />
    </div>
  `;
  updateFlipbookControls(state.flipbookPage || 0);
  renderFlipbookThumbnails();
}

function updateFlipbookControls(pageIdx) {
  const currentInput = document.getElementById('flip-page-input');
  const totalDisplay = document.getElementById('flip-total-pages');
  const btnPrev = document.getElementById('flip-btn-prev');
  const btnNext = document.getElementById('flip-btn-next');
  const fallbackImg = document.getElementById('fallback-page-img');

  if (fallbackImg && state.pageImages[pageIdx]) {
    fallbackImg.src = state.pageImages[pageIdx];
  }

  if (currentInput) currentInput.value = pageIdx + 1;
  if (totalDisplay) totalDisplay.textContent = `/ ${state.pageImages.length}`;
  if (btnPrev) btnPrev.disabled = pageIdx <= 0;
  if (btnNext) btnNext.disabled = pageIdx >= state.pageImages.length - 1;

  // Highlight thumbnail
  document.querySelectorAll('.thumb-card').forEach((card, idx) => {
    card.classList.toggle('active-thumb', idx === pageIdx);
  });
}

function renderFlipbookThumbnails() {
  const drawer = document.getElementById('flip-thumbnails-drawer');
  if (!drawer) return;
  drawer.innerHTML = '';

  state.pageImages.forEach((imgSrc, idx) => {
    const card = document.createElement('div');
    card.className = `thumb-card ${idx === state.flipbookPage ? 'active-thumb' : ''}`;
    card.innerHTML = `
      <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" />
      <span class="thumb-badge">${idx + 1}</span>
    `;
    card.addEventListener('click', () => {
      if (state.flipbookInstance) {
        state.flipbookInstance.flip(idx);
      }
    });
    drawer.appendChild(card);
  });
}

// Export Standalone HTML Flipbook (Self-contained offline webpage!)
function exportStandaloneFlipbook() {
  if (!state.pageImages.length) {
    showToast('ไม่มีหน้าสำหรับส่งออก', 'danger');
    return;
  }

  showLoading('กำลังจัดแพ็กเกจ Standalone Web Flipbook...', 'กำลังฝังข้อมูลภาพและระบบพลิกหน้า');

  try {
    const pagesJson = JSON.stringify(state.pageImages);
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${state.currentFile ? state.currentFile.name : 'Smart Zone AI'} - Interactive Flipbook</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at center, #1b2432 0%, #0c1017 100%);
      color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      overflow-x: hidden;
    }
    header {
      width: 100%;
      padding: 1rem 1.5rem;
      background: rgba(18, 24, 34, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1fe0ad;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .stage {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .book-frame {
      max-width: 900px;
      width: 100%;
      aspect-ratio: 1 / 1.414;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .book-frame img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      user-select: none;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(21, 27, 38, 0.9);
      padding: 0.6rem 1.25rem;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      margin-bottom: 1.5rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    button {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #fff;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    button:hover:not(:disabled) {
      background: #1fe0ad;
      color: #061713;
    }
    button:disabled { opacity: 0.35; cursor: not-allowed; }
    input {
      width: 48px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      text-align: center;
      border-radius: 4px;
      padding: 0.35rem 0;
    }
    footer {
      font-size: 0.75rem;
      color: #64748b;
      padding-bottom: 0.75rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span>📖</span> ${state.currentFile ? state.currentFile.name : 'Smart Zone AI'}
    </div>
    <div style="font-size: 0.8rem; color: #9ca3af;">Interactive HTML Flipbook</div>
  </header>

  <main class="stage">
    <div class="book-frame" id="book-frame">
      <img id="page-img" src="" alt="Flipbook Page" />
    </div>
  </main>

  <div class="controls">
    <button id="prev-btn">◀ Previous</button>
    <input type="number" id="page-num" min="1" value="1">
    <span id="page-total" style="font-size: 0.85rem; color: #9ca3af;"></span>
    <button id="next-btn">Next ▶</button>
    <button id="fs-btn">⛶ Fullscreen</button>
  </div>

  <footer>Exported by Smart Zone AI (sZai) PDF Studio • 100% Client-Side</footer>

  <script>
    const pages = ${pagesJson};
    let currentPage = 0;
    const img = document.getElementById('page-img');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const numInput = document.getElementById('page-num');
    const totalSpan = document.getElementById('page-total');
    const fsBtn = document.getElementById('fs-btn');

    function renderPage(idx) {
      currentPage = Math.max(0, Math.min(pages.length - 1, idx));
      img.src = pages[currentPage];
      numInput.value = currentPage + 1;
      totalSpan.textContent = '/ ' + pages.length;
      prevBtn.disabled = currentPage <= 0;
      nextBtn.disabled = currentPage >= pages.length - 1;
    }

    prevBtn.addEventListener('click', () => renderPage(currentPage - 1));
    nextBtn.addEventListener('click', () => renderPage(currentPage + 1));
    numInput.addEventListener('change', (e) => renderPage(parseInt(e.target.value) - 1));
    
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') renderPage(currentPage - 1);
      if (e.key === 'ArrowRight' || e.key === ' ') renderPage(currentPage + 1);
    });

    // Touch swipe navigation
    let touchStartX = 0;
    document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
    document.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff > 50) renderPage(currentPage - 1);
      else if (diff < -50) renderPage(currentPage + 1);
    });

    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    renderPage(0);
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${(state.currentFile ? state.currentFile.name.replace(/\.[^/.]+$/, '') : 'flipbook')}_standalone.html`;
    link.click();
    showToast(i18n[state.lang].toast_exported);
  } catch (err) {
    console.error('Export HTML failed:', err);
    showToast('การส่งออกล้มเหลว: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}

/* ==========================================================================
   Tool 2: Edit PDF Workspace
   ========================================================================== */
async function renderEditorPage(pageNum) {
  state.editorPage = pageNum;
  const container = document.getElementById('editor-canvas-container');
  if (!container || !state.currentPdfDoc) return;

  container.innerHTML = '';

  const page = await state.currentPdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.5 });

  const canvasWrapper = document.createElement('div');
  canvasWrapper.className = 'pdf-page-canvas-wrapper';
  canvasWrapper.style.width = `${viewport.width}px`;
  canvasWrapper.style.height = `${viewport.height}px`;

  // Base PDF render canvas
  const pdfCanvas = document.createElement('canvas');
  pdfCanvas.width = viewport.width;
  pdfCanvas.height = viewport.height;
  const pdfCtx = pdfCanvas.getContext('2d');
  await page.render({ canvasContext: pdfCtx, viewport }).promise;
  canvasWrapper.appendChild(pdfCanvas);

  // Overlay Drawing / Annotation Canvas
  const drawCanvas = document.createElement('canvas');
  drawCanvas.className = 'pdf-drawing-layer';
  drawCanvas.width = viewport.width;
  drawCanvas.height = viewport.height;
  canvasWrapper.appendChild(drawCanvas);
  container.appendChild(canvasWrapper);

  // Update editor header
  document.getElementById('editor-page-indicator').textContent = `หน้า ${pageNum} จาก ${state.pageCount}`;
  document.getElementById('editor-prev-btn').disabled = pageNum <= 1;
  document.getElementById('editor-next-btn').disabled = pageNum >= state.pageCount;

  // Redraw existing annotations for this page
  redrawEditorAnnotations(drawCanvas);

  // Setup drawing events
  setupEditorCanvasEvents(drawCanvas, viewport);
}

function redrawEditorAnnotations(drawCanvas) {
  const ctx = drawCanvas.getContext('2d');
  ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

  const annotations = state.editorAnnotations[state.editorPage] || [];
  annotations.forEach(ann => {
    ctx.save();
    if (ann.type === 'draw') {
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = ann.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ann.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    } else if (ann.type === 'highlight') {
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = ann.width || 18;
      ctx.lineCap = 'square';
      ctx.globalAlpha = 0.38;
      ctx.beginPath();
      ann.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    } else if (ann.type === 'redact') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(ann.x, ann.y, ann.w, ann.h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText('[REDACTED]', ann.x + 4, ann.y + 12);
    } else if (ann.type === 'rect') {
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = ann.width;
      ctx.strokeRect(ann.x, ann.y, ann.w, ann.h);
    } else if (ann.type === 'text') {
      ctx.fillStyle = ann.color;
      ctx.font = `${ann.size}px 'Inter', sans-serif`;
      ctx.fillText(ann.text, ann.x, ann.y);
    } else if (ann.type === 'image' && ann.imgObj) {
      ctx.drawImage(ann.imgObj, ann.x, ann.y, ann.w, ann.h);
    } else if (ann.type === 'stamp') {
      ctx.save();
      ctx.translate(drawCanvas.width / 2, drawCanvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.fillStyle = ann.color || 'rgba(239, 68, 68, 0.25)';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ann.text, 0, 0);
      ctx.strokeStyle = ann.color || 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 4;
      ctx.strokeRect(-180, -45, 360, 65);
      ctx.restore();
    }
    ctx.restore();
  });
}

function setupEditorCanvasEvents(canvas, viewport) {
  const ctx = canvas.getContext('2d');

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  const startDraw = (e) => {
    if (state.editorTool === 'select') return;
    state.isDrawing = true;
    const pos = getPos(e);
    state.drawStart = pos;
    state.currentDrawPath = [pos];

    if (state.editorTool === 'text') {
      state.isDrawing = false;
      const text = prompt('พิมพ์ข้อความที่ต้องการเพิ่ม:', 'ข้อความใหม่');
      if (text) {
        if (!state.editorAnnotations[state.editorPage]) state.editorAnnotations[state.editorPage] = [];
        state.editorAnnotations[state.editorPage].push({
          type: 'text',
          text,
          x: pos.x,
          y: pos.y,
          color: state.editorColor,
          size: state.editorFontSize
        });
        redrawEditorAnnotations(canvas);
      }
    }
  };

  const moveDraw = (e) => {
    if (!state.isDrawing) return;
    const pos = getPos(e);

    if (state.editorTool === 'draw' || state.editorTool === 'highlight') {
      state.currentDrawPath.push(pos);
      redrawEditorAnnotations(canvas);
      ctx.save();
      ctx.strokeStyle = state.editorColor;
      ctx.lineWidth = state.editorTool === 'highlight' ? 20 : state.editorLineWidth;
      if (state.editorTool === 'highlight') ctx.globalAlpha = 0.38;
      ctx.lineCap = 'round';
      ctx.beginPath();
      state.currentDrawPath.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();
    } else if (state.editorTool === 'redact' || state.editorTool === 'rect') {
      redrawEditorAnnotations(canvas);
      const w = pos.x - state.drawStart.x;
      const h = pos.y - state.drawStart.y;
      ctx.save();
      if (state.editorTool === 'redact') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(state.drawStart.x, state.drawStart.y, w, h);
      } else {
        ctx.strokeStyle = state.editorColor;
        ctx.lineWidth = state.editorLineWidth;
        ctx.strokeRect(state.drawStart.x, state.drawStart.y, w, h);
      }
      ctx.restore();
    }
  };

  const endDraw = (e) => {
    if (!state.isDrawing) return;
    state.isDrawing = false;
    if (!state.editorAnnotations[state.editorPage]) state.editorAnnotations[state.editorPage] = [];

    if (state.editorTool === 'draw' || state.editorTool === 'highlight') {
      if (state.currentDrawPath.length > 1) {
        state.editorAnnotations[state.editorPage].push({
          type: state.editorTool,
          points: [...state.currentDrawPath],
          color: state.editorColor,
          width: state.editorTool === 'highlight' ? 20 : state.editorLineWidth
        });
      }
    } else if (state.editorTool === 'redact' || state.editorTool === 'rect') {
      const endPos = state.currentDrawPath[state.currentDrawPath.length - 1] || state.drawStart;
      const x = Math.min(state.drawStart.x, endPos.x);
      const y = Math.min(state.drawStart.y, endPos.y);
      const w = Math.abs(endPos.x - state.drawStart.x);
      const h = Math.abs(endPos.y - state.drawStart.y);
      if (w > 5 && h > 5) {
        state.editorAnnotations[state.editorPage].push({
          type: state.editorTool,
          x, y, w, h,
          color: state.editorColor,
          width: state.editorLineWidth
        });
      }
    }

    state.currentDrawPath = [];
    state.drawStart = null;
    redrawEditorAnnotations(canvas);
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchmove', moveDraw);
  canvas.addEventListener('touchend', endDraw);
}

// Burn annotations into PDF and save with PDF-Lib
async function saveEditedPdf() {
  if (!state.currentPdfBytes) {
    showToast('ไม่มีไฟล์ PDF เพื่อบันทึก', 'danger');
    return;
  }

  showLoading('กำลังเบิร์นและประกอบเอกสาร PDF...', 'ประมวลผลเวกเตอร์และเลเยอร์กราฟิก');

  try {
    const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
    const pdfDoc = await PDFDocument.load(state.currentPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();

    // Iterate through annotated pages
    for (const [pageNumStr, annotations] of Object.entries(state.editorAnnotations)) {
      const pageIndex = parseInt(pageNumStr, 10) - 1;
      if (pageIndex < 0 || pageIndex >= pages.length) continue;
      const pdfPage = pages[pageIndex];
      const { width: pageWidth, height: pageHeight } = pdfPage.getSize();

      for (const ann of annotations) {
        if (ann.type === 'redact') {
          // Invert y coordinate because PDF-lib origin is bottom-left
          // scale factor 1.5 was used when rendering
          const scaleX = pageWidth / (pageWidth * 1.5);
          const scaleY = pageHeight / (pageHeight * 1.5);
          const x = ann.x * scaleX;
          const y = pageHeight - ((ann.y + ann.h) * scaleY);
          const w = ann.w * scaleX;
          const h = ann.h * scaleY;

          pdfPage.drawRectangle({
            x, y, width: w, height: h,
            color: rgb(0, 0, 0)
          });
        } else if (ann.type === 'rect') {
          const scaleX = pageWidth / (pageWidth * 1.5);
          const scaleY = pageHeight / (pageHeight * 1.5);
          const x = ann.x * scaleX;
          const y = pageHeight - ((ann.y + ann.h) * scaleY);
          const w = ann.w * scaleX;
          const h = ann.h * scaleY;

          pdfPage.drawRectangle({
            x, y, width: w, height: h,
            borderColor: rgb(0.12, 0.88, 0.68),
            borderWidth: ann.width * scaleX
          });
        } else if (ann.type === 'text') {
          const scaleX = pageWidth / (pageWidth * 1.5);
          const scaleY = pageHeight / (pageHeight * 1.5);
          const x = ann.x * scaleX;
          const y = pageHeight - (ann.y * scaleY);

          pdfPage.drawText(ann.text, {
            x, y,
            size: ann.size * scaleX,
            font: fontBold,
            color: rgb(0.12, 0.88, 0.68)
          });
        } else if (ann.type === 'stamp') {
          pdfPage.drawText(ann.text, {
            x: pageWidth / 4,
            y: pageHeight / 2,
            size: 38,
            font: fontBold,
            color: rgb(0.9, 0.2, 0.2),
            opacity: 0.35,
            rotate: window.PDFLib.degrees(30)
          });
        } else if (ann.type === 'image' && ann.dataUrl) {
          const pngImage = await pdfDoc.embedPng(ann.dataUrl);
          const scaleX = pageWidth / (pageWidth * 1.5);
          const scaleY = pageHeight / (pageHeight * 1.5);
          pdfPage.drawImage(pngImage, {
            x: ann.x * scaleX,
            y: pageHeight - ((ann.y + ann.h) * scaleY),
            width: ann.w * scaleX,
            height: ann.h * scaleY
          });
        }
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `edited_${state.currentFile ? state.currentFile.name : 'document.pdf'}`;
    link.click();
    showToast(i18n[state.lang].toast_exported);
  } catch (err) {
    console.error('Save edited PDF failed:', err);
    showToast('การบันทึก PDF ล้มเหลว: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}

// Signature Modal
function openSignatureModal() {
  const modal = document.getElementById('signature-modal');
  if (!modal) return;
  modal.classList.add('active-modal');

  const canvas = document.getElementById('signature-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000000';

  let isSigDrawing = false;
  const startSig = (e) => {
    isSigDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const moveSig = (e) => {
    if (!isSigDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const stopSig = () => isSigDrawing = false;

  canvas.onmousedown = startSig;
  canvas.onmousemove = moveSig;
  canvas.onmouseup = stopSig;
  canvas.ontouchstart = startSig;
  canvas.ontouchmove = moveSig;
  canvas.ontouchend = stopSig;
}

function insertSignature() {
  const canvas = document.getElementById('signature-canvas');
  const dataUrl = canvas.toDataURL('image/png');
  const imgObj = new Image();
  imgObj.onload = () => {
    if (!state.editorAnnotations[state.editorPage]) state.editorAnnotations[state.editorPage] = [];
    state.editorAnnotations[state.editorPage].push({
      type: 'image',
      dataUrl,
      imgObj,
      x: 100,
      y: 100,
      w: 180,
      h: 90
    });
    document.getElementById('signature-modal').classList.remove('active-modal');
    renderEditorPage(state.editorPage);
    showToast('ใส่ลายเซ็นแล้ว! คุณสามารถวาดหรือเพิ่มองค์ประกอบอื่นต่อได้');
  };
  imgObj.src = dataUrl;
}

/* ==========================================================================
   Tool 3: Merge PDFs Workspace
   ========================================================================== */
function setupMergeDropzone() {
  const dropzone = document.getElementById('merge-dropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.style.borderColor = 'var(--accent)';
      dropzone.style.background = 'var(--accent-subtle)';
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.style.borderColor = 'var(--border-card)';
      dropzone.style.background = 'var(--bg-card)';
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addFilesToMerge(files);
    }
  });
}

function renderMergeList() {
  const container = document.getElementById('merge-files-list');
  if (!container) return;
  container.innerHTML = '';

  if (state.mergeFiles.length === 0) {
    container.innerHTML = `
      <div class="merge-empty-dropzone" id="merge-dropzone" style="text-align:center;padding:3.5rem 1.5rem;color:var(--text-dim);background:var(--bg-card);border:2px dashed var(--border-card);border-radius:var(--radius-lg);transition:all 0.2s;">
        <div style="font-size:2.8rem;margin-bottom:0.75rem;">📑</div>
        <p style="font-size:1.1rem;font-weight:700;color:var(--text-main);margin-bottom:0.4rem;">ลากไฟล์ PDF มาวางที่นี่ หรือคลิกปุ่มเพื่อเลือกไฟล์</p>
        <p style="font-size:0.88rem;color:var(--text-dim);margin-bottom:1.5rem;max-width:480px;margin-left:auto;margin-right:auto;">รองรับการรวมไฟล์ PDF หลายไฟล์พร้อมกัน จัดลำดับหน้าก่อน-หลังได้อิสระ ประมวลผลปลอดภัยในเครื่อง 100%</p>
        <div style="display:flex;gap:0.85rem;justify-content:center;flex-wrap:wrap;">
          <button class="btn-primary" onclick="document.getElementById('merge-multi-input').click()">
            📂 เลือกไฟล์ PDF จากเครื่อง
          </button>
          <button class="btn-secondary" onclick="loadDemoMergeFiles()">
            📄 โหลดไฟล์ตัวอย่าง 2 ไฟล์ (ทดสอบ)
          </button>
        </div>
      </div>
    `;
    setupMergeDropzone();
    const btnMerge = document.getElementById('btn-execute-merge');
    if (btnMerge) btnMerge.disabled = true;
    return;
  }

  // Header info summary
  const totalPages = state.mergeFiles.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);
  const totalSizeKb = (state.mergeFiles.reduce((acc, curr) => acc + curr.size, 0) / 1024).toFixed(1);

  const summaryBar = document.createElement('div');
  summaryBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;background:var(--bg-card-hover);border-radius:var(--radius-sm);border:1px solid var(--border-card);margin-bottom:0.75rem;font-size:0.88rem;';
  summaryBar.innerHTML = `
    <div><strong>รายการที่เลือก:</strong> ${state.mergeFiles.length} ไฟล์ • รวม ${totalPages} หน้า • ${totalSizeKb} KB</div>
    <div style="display:flex;gap:0.5rem;">
      <button class="btn-icon-sm" onclick="clearAllMergeFiles()" title="ล้างรายการทั้งหมด" style="width:auto;padding:0.3rem 0.6rem;font-size:0.8rem;color:var(--danger);">🗑️ ล้างทั้งหมด</button>
    </div>
  `;
  container.appendChild(summaryBar);

  state.mergeFiles.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'merge-item';
    el.innerHTML = `
      <div class="merge-item-left">
        <span class="merge-order-badge">${index + 1}</span>
        <div>
          <div style="font-weight:700;font-size:0.95rem;color:var(--text-main);">${escapeHtml(item.name)}</div>
          <div style="font-size:0.78rem;color:var(--text-dim);margin-top:0.2rem;">${item.pageCount} หน้า • ${(item.size / 1024).toFixed(1)} KB</div>
        </div>
      </div>
      <div class="merge-item-actions">
        <button class="btn-icon-sm" onclick="moveMergeItem(${index}, -1)" ${index === 0 ? 'disabled' : ''} title="เลื่อนขึ้น">▲</button>
        <button class="btn-icon-sm" onclick="moveMergeItem(${index}, 1)" ${index === state.mergeFiles.length - 1 ? 'disabled' : ''} title="เลื่อนลง">▼</button>
        <button class="btn-icon-sm btn-danger" onclick="removeMergeItem(${index})" title="ลบไฟล์นี้">✕</button>
      </div>
    `;
    container.appendChild(el);
  });

  const bottomActions = document.createElement('div');
  bottomActions.style.cssText = 'display:flex;gap:0.75rem;justify-content:center;margin-top:1rem;';
  bottomActions.innerHTML = `
    <button class="btn-secondary" onclick="document.getElementById('merge-multi-input').click()" style="font-size:0.88rem;">
      ➕ เพิ่มไฟล์ PDF อีก
    </button>
  `;
  container.appendChild(bottomActions);

  const btnMerge = document.getElementById('btn-execute-merge');
  if (btnMerge) btnMerge.disabled = state.mergeFiles.length < 2;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.moveMergeItem = (index, dir) => {
  const target = index + dir;
  if (target < 0 || target >= state.mergeFiles.length) return;
  const temp = state.mergeFiles[index];
  state.mergeFiles[index] = state.mergeFiles[target];
  state.mergeFiles[target] = temp;
  renderMergeList();
};

window.removeMergeItem = (index) => {
  state.mergeFiles.splice(index, 1);
  renderMergeList();
};

window.clearAllMergeFiles = () => {
  state.mergeFiles = [];
  renderMergeList();
  showToast('ล้างรายการไฟล์ทั้งหมดแล้ว');
};

async function addFilesToMerge(fileList) {
  const files = Array.from(fileList);
  if (!files || files.length === 0) return;

  const validFiles = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
  if (validFiles.length === 0) {
    showToast('กรุณาเลือกไฟล์ PDF เท่านั้น (.pdf)', 'danger');
    return;
  }

  showLoading('กำลังประมวลผลไฟล์ PDF...', `อ่านข้อมูล ${validFiles.length} รายการ`);

  try {
    for (const file of validFiles) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let pageCount = 1;

      try {
        if (window.PDFLib) {
          const pdfDoc = await window.PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
        } else if (window.pdfjsLib) {
          const doc = await window.pdfjsLib.getDocument({ data: bytes }).promise;
          pageCount = doc.numPages;
        }
      } catch (cntErr) {
        console.warn('Page count fallback for', file.name, cntErr);
      }

      state.mergeFiles.push({
        file,
        name: file.name,
        size: file.size,
        pageCount: pageCount,
        bytes: bytes
      });
    }

    renderMergeList();
    showToast(`เพิ่ม ${validFiles.length} ไฟล์ลงในรายการรวมไฟล์แล้ว!`);
  } catch (err) {
    console.error('addFilesToMerge failed:', err);
    showToast('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message, 'danger');
  } finally {
    const input = document.getElementById('merge-multi-input');
    if (input) input.value = '';
    hideLoading();
  }
}

// Load 2 distinct demo PDFs for instant merge testing
async function loadDemoMergeFiles() {
  showLoading('กำลังโหลดไฟล์ตัวอย่าง...', 'เตรียมเอกสาร PDF 2 ชุดสำหรับการทดสอบรวมไฟล์');
  try {
    if (!window.PDFLib) {
      throw new Error('PDF-Lib library not loaded');
    }
    const { PDFDocument } = window.PDFLib;
    const baseBytes = new Uint8Array(base64ToArrayBuffer(EMBEDDED_SAMPLE_PDF_BASE64));
    const srcDoc = await PDFDocument.load(baseBytes, { ignoreEncryption: true });
    const total = srcDoc.getPageCount();

    // Part 1: First half
    const part1Doc = await PDFDocument.create();
    const half = Math.max(1, Math.floor(total / 2));
    const part1Indices = Array.from({ length: half }, (_, i) => i);
    const pages1 = await part1Doc.copyPages(srcDoc, part1Indices);
    pages1.forEach(p => part1Doc.addPage(p));
    const bytes1 = await part1Doc.save();

    // Part 2: Second half
    const part2Doc = await PDFDocument.create();
    const part2Indices = Array.from({ length: total - half }, (_, i) => i + half);
    const pages2 = await part2Doc.copyPages(srcDoc, part2Indices);
    pages2.forEach(p => part2Doc.addPage(p));
    const bytes2 = await part2Doc.save();

    state.mergeFiles = [
      {
        name: 'SmartZone_Part1_Introduction.pdf',
        size: bytes1.byteLength,
        pageCount: pages1.length,
        bytes: bytes1
      },
      {
        name: 'SmartZone_Part2_Analytics.pdf',
        size: bytes2.byteLength,
        pageCount: pages2.length,
        bytes: bytes2
      }
    ];

    renderMergeList();
    showToast('โหลดไฟล์ตัวอย่าง 2 ไฟล์เรียบร้อย! คลิกปุ่ม "รวมไฟล์ PDF ทั้งหมด" ด้านบนเพื่อทดสอบได้ทันที');
  } catch (err) {
    console.error('loadDemoMergeFiles failed:', err);
    showToast('โหลดไฟล์ตัวอย่างล้มเหลว: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}
window.loadDemoMergeFiles = loadDemoMergeFiles;

async function executeMerge() {
  if (state.mergeFiles.length < 2) {
    showToast('ต้องมีอย่างน้อย 2 ไฟล์เพื่อรวมเข้าด้วยกัน', 'danger');
    return;
  }

  showLoading('กำลังรวมไฟล์ PDF ทั้งหมด...', `รวมเอกสาร ${state.mergeFiles.length} รายการเข้าด้วยกัน`);

  try {
    if (!window.PDFLib) {
      throw new Error('PDF-Lib is not initialized');
    }
    const { PDFDocument } = window.PDFLib;
    const mergedDoc = await PDFDocument.create();

    for (let i = 0; i < state.mergeFiles.length; i++) {
      const item = state.mergeFiles[i];
      const srcDoc = await PDFDocument.load(item.bytes, { ignoreEncryption: true });
      const indices = srcDoc.getPageIndices();
      const copiedPages = await mergedDoc.copyPages(srcDoc, indices);
      copiedPages.forEach(page => mergedDoc.addPage(page));
    }

    const mergedBytes = await mergedDoc.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartzone_merged_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);

    showToast('🎉 รวมไฟล์ PDF สำเร็จและเริ่มดาวน์โหลดไฟล์แล้ว!');
  } catch (err) {
    console.error('Merge failed:', err);
    showToast('รวมไฟล์ล้มเหลว: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}

/* ==========================================================================
   Tool 4: Split PDF Workspace
   ========================================================================== */
async function executeSplit() {
  if (!state.currentPdfBytes) {
    showToast('กรุณาเลือกไฟล์ PDF ก่อน', 'danger');
    return;
  }

  const mode = document.querySelector('input[name="split-mode"]:checked')?.value || 'all';

  showLoading('กำลังแยกหน้า PDF...', 'ประมวลผลและสร้างไฟล์แยก');

  try {
    const { PDFDocument } = window.PDFLib;
    const srcDoc = await PDFDocument.load(state.currentPdfBytes);
    const total = srcDoc.getPageCount();

    if (mode === 'all') {
      const zip = new JSZip();

      for (let i = 0; i < total; i++) {
        const singleDoc = await PDFDocument.create();
        const [copied] = await singleDoc.copyPages(srcDoc, [i]);
        singleDoc.addPage(copied);
        const singleBytes = await singleDoc.save();
        zip.file(`page_${String(i + 1).padStart(3, '0')}.pdf`, singleBytes);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${state.currentFile ? state.currentFile.name.replace(/\.[^/.]+$/, '') : 'pages'}_split.zip`;
      link.click();
    } else {
      // Range mode
      const rangeStr = document.getElementById('split-range-input').value.trim();
      const pagesToExtract = parsePageRanges(rangeStr, total);
      if (!pagesToExtract.length) {
        throw new Error('ช่วงหน้าไม่ถูกต้อง กรุณาระบุ เช่น 1-3, 5');
      }

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, pagesToExtract.map(p => p - 1));
      copiedPages.forEach(p => newDoc.addPage(p));
      const extractedBytes = await newDoc.save();

      const blob = new Blob([extractedBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `extracted_pages_${pagesToExtract.join('_')}.pdf`;
      link.click();
    }

    showToast(i18n[state.lang].toast_exported);
  } catch (err) {
    console.error('Split failed:', err);
    showToast('แยกไฟล์ล้มเหลว: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}

function parsePageRanges(str, maxPages) {
  const result = new Set();
  const parts = str.split(',');
  for (const part of parts) {
    const clean = part.trim();
    if (!clean) continue;
    if (clean.includes('-')) {
      const [start, end] = clean.split('-').map(n => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          result.add(i);
        }
      }
    } else {
      const page = parseInt(clean, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        result.add(page);
      }
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

/* ==========================================================================
   Tool 5: Organize Pages Workspace
   ========================================================================== */
function renderOrganizeGrid() {
  const container = document.getElementById('organize-grid');
  if (!container) return;
  container.innerHTML = '';

  state.organizePages.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'page-card';
    card.innerHTML = `
      <div class="page-preview-box">
        <img src="${item.dataUrl}" style="transform: rotate(${item.rotation}deg);" alt="Page ${index + 1}" />
      </div>
      <div class="page-card-actions">
        <span class="page-num-tag">หน้า ${index + 1} (${item.rotation}°)</span>
        <div class="page-action-btns">
          <button class="btn-icon-sm" onclick="rotatePage(${index}, -90)" title="หมุนทวนเข็ม 90°">↺</button>
          <button class="btn-icon-sm" onclick="rotatePage(${index}, 90)" title="หมุนตามเข็ม 90°">↻</button>
          <button class="btn-icon-sm" onclick="movePage(${index}, -1)" ${index === 0 ? 'disabled' : ''} title="เลื่อนซ้าย">◀</button>
          <button class="btn-icon-sm" onclick="movePage(${index}, 1)" ${index === state.organizePages.length - 1 ? 'disabled' : ''} title="เลื่อนขวา">▶</button>
          <button class="btn-icon-sm btn-danger" onclick="deletePage(${index})" title="ลบหน้านี้">🗑</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.rotatePage = (index, angle) => {
  state.organizePages[index].rotation = (state.organizePages[index].rotation + angle) % 360;
  renderOrganizeGrid();
};

window.movePage = (index, dir) => {
  const target = index + dir;
  if (target < 0 || target >= state.organizePages.length) return;
  const temp = state.organizePages[index];
  state.organizePages[index] = state.organizePages[target];
  state.organizePages[target] = temp;
  renderOrganizeGrid();
};

window.deletePage = (index) => {
  if (state.organizePages.length <= 1) {
    showToast('ไม่สามารถลบหน้าทั้งหมดได้ ต้องเหลืออย่างน้อย 1 หน้า', 'danger');
    return;
  }
  state.organizePages.splice(index, 1);
  renderOrganizeGrid();
};

async function saveOrganizedPdf() {
  if (!state.currentPdfBytes) return;

  showLoading('กำลังจัดเรียงและบันทึก PDF ใหม่...', 'บันทึกการหมุนและลำดับหน้า');

  try {
    const { PDFDocument, degrees } = window.PDFLib;
    const srcDoc = await PDFDocument.load(state.currentPdfBytes);
    const newDoc = await PDFDocument.create();

    for (const item of state.organizePages) {
      const [copied] = await newDoc.copyPages(srcDoc, [item.originalIndex]);
      const currentRot = copied.getRotation().angle;
      copied.setRotation(degrees((currentRot + item.rotation) % 360));
      newDoc.addPage(copied);
    }

    const bytes = await newDoc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `organized_${state.currentFile ? state.currentFile.name : 'document.pdf'}`;
    link.click();
    showToast(i18n[state.lang].toast_exported);
  } catch (err) {
    console.error('Save organized PDF failed:', err);
    showToast('บันทึกหน้าล้มเหลว: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}

/* ==========================================================================
   Tool 6: PDF to Images Workspace
   ========================================================================== */
async function renderImagesGrid() {
  const container = document.getElementById('images-gallery');
  if (!container || !state.currentPdfDoc) return;
  container.innerHTML = '';

  state.pageImages.forEach((imgUrl, index) => {
    const card = document.createElement('div');
    card.className = 'image-export-card';
    card.innerHTML = `
      <div class="image-export-preview">
        <img src="${imgUrl}" alt="Page ${index + 1}" />
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:700;font-size:0.88rem;">หน้า ${index + 1}</span>
        <button class="tool-btn" onclick="downloadSingleImage(${index})">⬇ ดาวน์โหลด</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.downloadSingleImage = (index) => {
  const link = document.createElement('a');
  link.href = state.pageImages[index];
  link.download = `page_${index + 1}.${state.imageFormat}`;
  link.click();
};

async function downloadAllImagesZip() {
  if (!state.currentPdfDoc) return;

  showLoading('กำลังแปลงและแพ็กภาพเป็น ZIP...', 'เรนเดอร์ภาพความละเอียดสูง');

  try {
    const zip = new JSZip();
    const scale = state.imageScale || 2;
    const format = state.imageFormat || 'png';
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';

    for (let i = 1; i <= state.pageCount; i++) {
      const page = await state.currentPdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      const base64 = canvas.toDataURL(mime, 0.95).split(',')[1];
      zip.file(`page_${String(i).padStart(3, '0')}.${format}`, base64, { base64: true });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${state.currentFile ? state.currentFile.name.replace(/\.[^/.]+$/, '') : 'document'}_images.zip`;
    link.click();
    showToast(i18n[state.lang].toast_exported);
  } catch (err) {
    console.error('ZIP images failed:', err);
    showToast('สร้าง ZIP รูปภาพล้มเหลว: ' + err.message, 'danger');
  } finally {
    hideLoading();
  }
}

// Event Listeners setup on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Navigation tabs
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Tool cards on home
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const tab = card.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Theme toggle & initialization
  applyTheme(state.theme);
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    const nextTheme = state.theme === 'clear' ? 'dark' : 'clear';
    applyTheme(nextTheme);
    showToast(nextTheme === 'clear' ? '✨ เปลี่ยนเป็นธีม Clear (คลีน สว่างตา)' : '🌙 เปลี่ยนเป็นธีม Dark (มืด ไซเบอร์)');
  });

  // Language switcher
  document.getElementById('btn-lang-toggle')?.addEventListener('click', () => {
    state.lang = state.lang === 'th' ? 'en' : 'th';
    document.getElementById('lang-label').textContent = state.lang.toUpperCase();
    applyLanguage();
  });

  // Sound toggle
  document.getElementById('btn-sound-toggle')?.addEventListener('click', (e) => {
    state.soundEnabled = !state.soundEnabled;
    e.target.textContent = state.soundEnabled ? '🔊 เสียงเปิด' : '🔇 เสียงปิด';
    showToast(state.soundEnabled ? 'เปิดเสียงพลิกหน้าแล้ว' : 'ปิดเสียงพลิกหน้าแล้ว');
  });

  // File upload input
  const fileInput = document.getElementById('global-pdf-input');
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast(i18n[state.lang].alert_select_pdf, 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => loadPdfBytes(evt.target.result, file.name);
    reader.readAsArrayBuffer(file);
  });

  // Drag and Drop Zone
  const dropZone = document.getElementById('upload-dropzone');
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
      });
    });
    dropZone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
        const reader = new FileReader();
        reader.onload = (evt) => loadPdfBytes(evt.target.result, file.name);
        reader.readAsArrayBuffer(file);
      } else {
        showToast(i18n[state.lang].alert_select_pdf, 'danger');
      }
    });
  }

  // Load Demo buttons
  document.querySelectorAll('.btn-load-demo-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      loadDemoPdf();
    });
  });

  // Flipbook controls
  document.getElementById('flip-btn-prev')?.addEventListener('click', () => {
    if (state.flipbookInstance) state.flipbookInstance.flipPrev();
  });
  document.getElementById('flip-btn-next')?.addEventListener('click', () => {
    if (state.flipbookInstance) state.flipbookInstance.flipNext();
  });
  document.getElementById('flip-page-input')?.addEventListener('change', (e) => {
    const target = parseInt(e.target.value, 10) - 1;
    if (state.flipbookInstance && !isNaN(target)) state.flipbookInstance.flip(target);
  });
  document.getElementById('btn-export-standalone')?.addEventListener('click', exportStandaloneFlipbook);

  // Editor controls
  document.querySelectorAll('.editor-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.editor-tool-btn').forEach(b => b.classList.remove('active-tool'));
      btn.classList.add('active-tool');
      state.editorTool = btn.dataset.tool;
    });
  });
  document.getElementById('editor-color-picker')?.addEventListener('input', (e) => {
    state.editorColor = e.target.value;
  });
  document.getElementById('editor-prev-btn')?.addEventListener('click', () => {
    if (state.editorPage > 1) renderEditorPage(state.editorPage - 1);
  });
  document.getElementById('editor-next-btn')?.addEventListener('click', () => {
    if (state.editorPage < state.pageCount) renderEditorPage(state.editorPage + 1);
  });
  document.getElementById('btn-save-edited-pdf')?.addEventListener('click', saveEditedPdf);
  document.getElementById('btn-open-sig-modal')?.addEventListener('click', openSignatureModal);
  document.getElementById('btn-insert-sig')?.addEventListener('click', insertSignature);
  document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
    const canvas = document.getElementById('signature-canvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  });
  document.getElementById('btn-close-sig-modal')?.addEventListener('click', () => {
    document.getElementById('signature-modal').classList.remove('active-modal');
  });

  // Stamp buttons
  document.querySelectorAll('.btn-stamp-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const stampText = btn.dataset.stamp;
      if (!state.editorAnnotations[state.editorPage]) state.editorAnnotations[state.editorPage] = [];
      state.editorAnnotations[state.editorPage].push({
        type: 'stamp',
        text: stampText,
        color: 'rgba(239, 68, 68, 0.35)'
      });
      renderEditorPage(state.editorPage);
      showToast(`ประทับตรา "${stampText}" แล้ว!`);
    });
  });

  // Merge controls
  const mergeInput = document.getElementById('merge-multi-input');
  mergeInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToMerge(e.target.files);
    }
  });
  document.getElementById('btn-execute-merge')?.addEventListener('click', executeMerge);

  const mergeSection = document.getElementById('view-merge');
  if (mergeSection) {
    ['dragenter', 'dragover'].forEach(name => {
      mergeSection.addEventListener(name, (e) => e.preventDefault());
    });
    mergeSection.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFilesToMerge(e.dataTransfer.files);
      }
    });
  }

  // Split controls
  document.getElementById('btn-execute-split')?.addEventListener('click', executeSplit);

  // Organize controls
  document.getElementById('btn-save-organize')?.addEventListener('click', saveOrganizedPdf);

  // Images controls
  document.getElementById('select-image-format')?.addEventListener('change', (e) => {
    state.imageFormat = e.target.value;
  });
  document.getElementById('select-image-scale')?.addEventListener('change', (e) => {
    state.imageScale = parseFloat(e.target.value);
  });
  document.getElementById('btn-download-all-images')?.addEventListener('click', downloadAllImagesZip);
});

function applyLanguage() {
  const dict = i18n[state.lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.innerHTML = dict[key];
  });
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('szai_theme', theme);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) {
    btn.innerHTML = theme === 'clear' ? '☀️ ธีม Clear' : '🌙 ธีม Dark';
    btn.title = theme === 'clear' ? 'สลับเป็นธีม Dark (มืด ไซเบอร์)' : 'สลับเป็นธีม Clear (คลีน สว่างตา)';
  }
}


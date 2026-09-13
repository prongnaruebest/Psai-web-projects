/**
 * ==========================================================================
 * Xian Ni Web Reader - Universal Application Script
 * 44 Volumes, 2,088 Chapters, 12,504 PDF Pages
 * Supports: Netlify, Cloudflare, Vercel, Local Server, and Direct file:// Offline
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Global State ---
  const state = {
    manifest: null,
    searchIndex: null,
    currentVolumeNum: 1,
    currentChapterId: 1,
    currentVolumeData: null,
    volumeCache: new Map(),
    bookmarks: [],
    history: {},
    settings: {
      fontFamily: 'font-sarabun',
      theme: 'sepia',
      fontSize: 20,
      lineHeight: 1.85,
      pageWidth: 'width-standard',
      textAlign: 'align-left'
    },
    viewMode: 'bookshelf',
    isDrawerOpen: false,
    activeModal: null
  };

  // --- DOM Elements ---
  const dom = {
    body: document.body,
    progressBar: document.getElementById('readingProgressBar'),
    
    // Header
    mainHeader: document.getElementById('mainHeader'),
    btnToggleNav: document.getElementById('btnToggleNav'),
    btnGoHome: document.getElementById('btnGoHome'),
    headerReadingInfo: document.getElementById('headerReadingInfo'),
    headerVolBadge: document.getElementById('headerVolBadge'),
    headerChapTitle: document.getElementById('headerChapTitle'),
    headerPdfTag: document.getElementById('headerPdfTag'),
    headerPdfPageText: document.getElementById('headerPdfPageText'),
    btnSearch: document.getElementById('btnSearch'),
    btnBookmark: document.getElementById('btnBookmark'),
    bookmarkIcon: document.getElementById('bookmarkIcon'),
    btnThemeToggle: document.getElementById('btnThemeToggle'),
    btnSettings: document.getElementById('btnSettings'),
    
    // Bookshelf View
    bookshelfView: document.getElementById('bookshelfView'),
    heroCoverImg: document.getElementById('heroCoverImg'),
    btnHeroResume: document.getElementById('btnHeroResume'),
    resumeLabel: document.getElementById('resumeLabel'),
    btnHeroStart: document.getElementById('btnHeroStart'),
    volumeFilterInput: document.getElementById('volumeFilterInput'),
    volumesGrid: document.getElementById('volumesGrid'),
    
    // Reader View
    readerView: document.getElementById('readerView'),
    btnBackToShelf: document.getElementById('btnBackToShelf'),
    volSelectDropdown: document.getElementById('volSelectDropdown'),
    chapSelectDropdown: document.getElementById('chapSelectDropdown'),
    readerVolTag: document.getElementById('readerVolTag'),
    readerChapTitle: document.getElementById('readerChapTitle'),
    pdfFilenameText: document.getElementById('pdfFilenameText'),
    pdfPageRangeText: document.getElementById('pdfPageRangeText'),
    pdfTotalPagesText: document.getElementById('pdfTotalPagesText'),
    chapterContentArea: document.getElementById('chapterContentArea'),
    btnPrevChapterBottom: document.getElementById('btnPrevChapterBottom'),
    btnNextChapterBottom: document.getElementById('btnNextChapterBottom'),
    bottomChapStatus: document.getElementById('bottomChapStatus'),
    chapterSlider: document.getElementById('chapterSlider'),
    volumeEndNotice: document.getElementById('volumeEndNotice'),
    endedVolNum: document.getElementById('endedVolNum'),
    btnNextVolume: document.getElementById('btnNextVolume'),
    
    // Floating Controls
    floatingControls: document.getElementById('floatingControls'),
    btnFloatingPrev: document.getElementById('btnFloatingPrev'),
    btnFloatingToc: document.getElementById('btnFloatingToc'),
    btnFloatingNext: document.getElementById('btnFloatingNext'),
    btnFloatingTop: document.getElementById('btnFloatingTop'),
    
    // Table of Contents Drawer
    tocDrawerOverlay: document.getElementById('tocDrawerOverlay'),
    tocDrawer: document.getElementById('tocDrawer'),
    btnCloseToc: document.getElementById('btnCloseToc'),
    drawerTabs: document.querySelectorAll('.drawer-tab'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    tocFilterInput: document.getElementById('tocFilterInput'),
    tocVolumeList: document.getElementById('tocVolumeList'),
    bookmarksList: document.getElementById('bookmarksList'),
    bookmarkCountBadge: document.getElementById('bookmarkCountBadge'),
    
    // Search Modal
    searchModalOverlay: document.getElementById('searchModalOverlay'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    btnClearSearch: document.getElementById('btnClearSearch'),
    btnCloseSearch: document.getElementById('btnCloseSearch'),
    searchResultsArea: document.getElementById('searchResultsArea'),
    
    // Settings Modal
    settingsModalOverlay: document.getElementById('settingsModalOverlay'),
    btnCloseSettings: document.getElementById('btnCloseSettings'),
    btnDoneSettings: document.getElementById('btnDoneSettings'),
    btnResetSettings: document.getElementById('btnResetSettings'),
    fontOptionBtns: document.querySelectorAll('.font-option-btn'),
    themeCardBtns: document.querySelectorAll('.theme-card-btn'),
    fontSizeDisplay: document.getElementById('fontSizeDisplay'),
    fontSizeSlider: document.getElementById('fontSizeSlider'),
    btnFontDec: document.getElementById('btnFontDec'),
    btnFontInc: document.getElementById('btnFontInc'),
    lineHeightBtns: document.querySelectorAll('#lineHeightGroup .seg-btn'),
    pageWidthBtns: document.querySelectorAll('#pageWidthGroup .seg-btn'),
    textAlignBtns: document.querySelectorAll('#textAlignGroup .seg-btn'),
    
    // Toast
    toastNotification: document.getElementById('toastNotification'),

    // AI Audio Companion
    btnToggleAudio: document.getElementById('btnToggleAudio'),
    btnFloatingAudio: document.getElementById('btnFloatingAudio'),
    aiAudioBar: document.getElementById('aiAudioBar'),
    btnAudioPrev: document.getElementById('btnAudioPrev'),
    btnAudioPlayPause: document.getElementById('btnAudioPlayPause'),
    btnAudioStop: document.getElementById('btnAudioStop'),
    btnAudioNext: document.getElementById('btnAudioNext'),
    audioVoiceSelect: document.getElementById('audioVoiceSelect'),
    audioSpeedSelect: document.getElementById('audioSpeedSelect'),
    btnAudioAutoScroll: document.getElementById('btnAudioAutoScroll'),
    btnCloseAudioBar: document.getElementById('btnCloseAudioBar'),
    audioPlayIcon: document.getElementById('audioPlayIcon'),
    audioSubStatus: document.getElementById('audioSubStatus')
  };

  // --- AI Speech Companion (Neural AI + Web Speech API) ---
  const speechReader = {
    synth: window.speechSynthesis,
    utterance: null,
    audioElement: new Audio(),
    isPlaying: false,
    isPaused: false,
    autoScroll: true,
    currentParagraphIndex: 0,
    rate: 1.0,
    selectedVoice: 'th-TH-NiwatNeural',
    webVoice: null,
    paragraphs: [],

    init() {
      // Audio element callbacks for Neural voice
      this.audioElement.addEventListener('ended', () => {
        if (this.isPlaying) {
          this.currentParagraphIndex++;
          this.speakCurrentParagraph();
        }
      });

      this.audioElement.addEventListener('error', (e) => {
        console.warn('Neural audio playback error, trying next paragraph:', e);
        if (this.isPlaying) {
          this.currentParagraphIndex++;
          this.speakCurrentParagraph();
        }
      });

      // Browser Web Speech voices setup
      if (this.synth) {
        const updateVoices = () => {
          const voices = this.synth.getVoices();
          this.webVoice = voices.find(v => v.lang === 'th-TH' || v.lang.startsWith('th')) || null;
        };
        updateVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = updateVoices;
        }
      }

      if (dom.audioVoiceSelect) {
        this.selectedVoice = dom.audioVoiceSelect.value;
      }
    },

    toggleAudioBar() {
      if (!dom.aiAudioBar) return;
      if (dom.aiAudioBar.classList.contains('hidden')) {
        dom.aiAudioBar.classList.remove('hidden');
        if (state.viewMode === 'reader') {
          showToast('เปิดระบบเสียง AI Neural แล้ว • แตะย่อหน้าเพื่อเริ่มฟัง');
        } else {
          showToast('กรุณาเลือกตอนเพื่อเริ่มฟังเสียงอ่าน');
        }
      } else {
        this.stop();
        dom.aiAudioBar.classList.add('hidden');
      }
    },

    start(fromIndex = 0) {
      this.stop();
      this.paragraphs = Array.from(dom.chapterContentArea.querySelectorAll('p'));
      if (!this.paragraphs.length) return;

      this.currentParagraphIndex = Math.max(0, Math.min(fromIndex, this.paragraphs.length - 1));
      this.isPlaying = true;
      this.isPaused = false;
      this.updatePlayPauseIcon(true);

      if (dom.aiAudioBar) dom.aiAudioBar.classList.remove('hidden');
      const icon = dom.aiAudioBar ? dom.aiAudioBar.querySelector('.audio-status-icon') : null;
      if (icon) icon.classList.add('playing');

      this.speakCurrentParagraph();
    },

    speakCurrentParagraph() {
      if (!this.isPlaying || this.currentParagraphIndex >= this.paragraphs.length) {
        this.stop();
        showToast('อ่านจบตอนแล้ว');
        if (state.currentVolumeNum < 44) {
          setTimeout(() => {
            goToNextChapter();
            setTimeout(() => speechReader.start(0), 1200);
          }, 1500);
        }
        return;
      }

      if (this.synth) this.synth.cancel();
      this.audioElement.pause();

      const p = this.paragraphs[this.currentParagraphIndex];
      const text = p ? p.textContent.trim() : '';

      this.paragraphs.forEach(el => el.classList.remove('speaking-highlight'));
      if (p) {
        p.classList.add('speaking-highlight');
        if (this.autoScroll) {
          p.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      if (dom.audioSubStatus) {
        const vName = this.selectedVoice.includes('Niwat') ? 'เสียงนิวัต (ชาย)' : (this.selectedVoice.includes('Premwadee') ? 'เสียงเปรมวดี (หญิง)' : 'Web Speech');
        dom.audioSubStatus.textContent = `[${vName}] ย่อหน้าที่ ${this.currentParagraphIndex + 1} / ${this.paragraphs.length}`;
      }

      if (!text) {
        this.currentParagraphIndex++;
        this.speakCurrentParagraph();
        return;
      }

      // 1. Neural AI Voice Mode (Server API - Highest Natural Quality)
      if (this.selectedVoice !== 'webspeech') {
        const rateParam = this.rate === 1.0 ? '+0%' : (this.rate > 1.0 ? `+${Math.round((this.rate - 1.0) * 100)}%` : `-${Math.round((1.0 - this.rate) * 100)}%`);
        const url = `/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(this.selectedVoice)}&rate=${encodeURIComponent(rateParam)}`;

        this.audioElement.src = url;
        this.audioElement.playbackRate = 1.0;
        this.audioElement.play().catch(err => {
          console.warn('Neural audio play failed, falling back to Web Speech:', err);
          this.speakWithWebSpeech(text);
        });

        // Pre-buffer next paragraph for instant continuous playback
        if (this.currentParagraphIndex + 1 < this.paragraphs.length) {
          const nextText = this.paragraphs[this.currentParagraphIndex + 1].textContent.trim();
          if (nextText) {
            const nextUrl = `/api/tts?text=${encodeURIComponent(nextText)}&voice=${encodeURIComponent(this.selectedVoice)}&rate=${encodeURIComponent(rateParam)}`;
            const prefetch = new Audio();
            prefetch.src = nextUrl;
            prefetch.preload = 'auto';
          }
        }
      } else {
        // 2. Fallback to Browser Web Speech API
        this.speakWithWebSpeech(text);
      }
    },

    speakWithWebSpeech(text) {
      if (!this.synth) return;
      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.lang = 'th-TH';
      this.utterance.rate = this.rate;
      if (this.webVoice) this.utterance.voice = this.webVoice;

      this.utterance.onend = () => {
        if (this.isPlaying) {
          this.currentParagraphIndex++;
          this.speakCurrentParagraph();
        }
      };

      this.utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          this.currentParagraphIndex++;
          this.speakCurrentParagraph();
        }
      };

      this.synth.speak(this.utterance);
    },

    pauseResume() {
      if (!this.isPlaying) {
        this.start(0);
        return;
      }
      if (this.isPaused) {
        if (this.selectedVoice !== 'webspeech' && this.audioElement.src) {
          this.audioElement.play();
        } else if (this.synth) {
          this.synth.resume();
        }
        this.isPaused = false;
        this.updatePlayPauseIcon(true);
        const icon = dom.aiAudioBar ? dom.aiAudioBar.querySelector('.audio-status-icon') : null;
        if (icon) icon.classList.add('playing');
        if (dom.audioSubStatus) {
          dom.audioSubStatus.textContent = `กำลังอ่านย่อหน้าที่ ${this.currentParagraphIndex + 1} / ${this.paragraphs.length}`;
        }
      } else {
        if (this.selectedVoice !== 'webspeech') {
          this.audioElement.pause();
        } else if (this.synth) {
          this.synth.pause();
        }
        this.isPaused = true;
        this.updatePlayPauseIcon(false);
        const icon = dom.aiAudioBar ? dom.aiAudioBar.querySelector('.audio-status-icon') : null;
        if (icon) icon.classList.remove('playing');
        if (dom.audioSubStatus) {
          dom.audioSubStatus.textContent = 'หยุดชั่วคราว (กด Play หรือเคาะ P เพื่อฟังต่อ)';
        }
      }
    },

    stop() {
      if (this.synth) this.synth.cancel();
      this.audioElement.pause();
      this.audioElement.src = '';
      this.isPlaying = false;
      this.isPaused = false;
      this.updatePlayPauseIcon(false);
      if (this.paragraphs) {
        this.paragraphs.forEach(el => el.classList.remove('speaking-highlight'));
      }
      const icon = dom.aiAudioBar ? dom.aiAudioBar.querySelector('.audio-status-icon') : null;
      if (icon) icon.classList.remove('playing');
      if (dom.audioSubStatus) {
        dom.audioSubStatus.textContent = 'พร้อมอ่านตอนปัจจุบัน • แตะย่อหน้าเพื่อเริ่ม';
      }
    },

    next() {
      if (this.currentParagraphIndex < this.paragraphs.length - 1) {
        this.currentParagraphIndex++;
        this.speakCurrentParagraph();
      }
    },

    prev() {
      if (this.currentParagraphIndex > 0) {
        this.currentParagraphIndex--;
        this.speakCurrentParagraph();
      }
    },

    updatePlayPauseIcon(playing) {
      if (!dom.audioPlayIcon) return;
      dom.audioPlayIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
  };

  // --- Utilities ---
  function showToast(message, duration = 2500) {
    dom.toastNotification.textContent = message;
    dom.toastNotification.classList.add('show');
    clearTimeout(dom.toastNotification._timer);
    dom.toastNotification._timer = setTimeout(() => {
      dom.toastNotification.classList.remove('show');
    }, duration);
  }

  function padZero(num, size = 2) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  // --- Storage Management ---
  const STORAGE_KEYS = {
    SETTINGS: 'xianni_reader_settings',
    LAST_READ: 'xianni_reader_last_read',
    BOOKMARKS: 'xianni_reader_bookmarks',
    PROGRESS: 'xianni_reader_progress'
  };

  function loadSavedData() {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        state.settings = Object.assign(state.settings, JSON.parse(savedSettings));
      }
      
      const savedLastRead = localStorage.getItem(STORAGE_KEYS.LAST_READ);
      if (savedLastRead) {
        const lr = JSON.parse(savedLastRead);
        state.currentVolumeNum = lr.vol || 1;
        state.currentChapterId = lr.chap || 1;
      }
      
      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (savedBookmarks) {
        state.bookmarks = JSON.parse(savedBookmarks);
      }
      
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (savedProgress) {
        state.history = JSON.parse(savedProgress);
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
    } catch (e) {}
  }

  function saveLastRead(volNum, chapId) {
    try {
      const data = { vol: volNum, chap: chapId, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(data));
      
      state.history[volNum] = Math.max(state.history[volNum] || 0, chapId);
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(state.history));
      
      updateResumeButton();
      updateVolumeProgressBars();
      if (typeof cultivationManager !== 'undefined') {
        cultivationManager.update();
      }
    } catch (e) {}
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(state.bookmarks));
      updateBookmarksUI();
    } catch (e) {}
  }

  // --- Apply Settings to DOM ---
  function applySettings() {
    const s = state.settings;
    
    dom.body.className = dom.body.className.replace(/font-\w+/g, '').trim();
    dom.body.classList.add(s.fontFamily);
    
    dom.body.className = dom.body.className.replace(/theme-\w+/g, '').trim();
    dom.body.classList.add(`theme-${s.theme}`);
    dom.body.setAttribute('data-theme', s.theme);
    document.documentElement.setAttribute('data-theme', s.theme);
    
    dom.body.className = dom.body.className.replace(/width-\w+/g, '').trim();
    dom.body.classList.add(s.pageWidth);
    
    dom.body.style.setProperty('--font-size', `${s.fontSize}px`);
    dom.body.style.setProperty('--line-height', s.lineHeight);
    dom.body.style.setProperty('--text-align', s.textAlign === 'align-justify' ? 'justify' : 'left');
    
    dom.fontSizeDisplay.textContent = `${s.fontSize}px`;
    dom.fontSizeSlider.value = s.fontSize;
    
    dom.fontOptionBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === s.fontFamily);
    });
    
    dom.themeCardBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === s.theme);
    });
    
    dom.lineHeightBtns.forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.lh) === parseFloat(s.lineHeight));
    });
    
    dom.pageWidthBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.width === s.pageWidth);
    });
    
    dom.textAlignBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.align === s.textAlign);
    });
  }

  // --- Universal Data Fetching & Loading ---
  async function initApp() {
    loadSavedData();
    applySettings();
    updateBookmarksUI();
    speechReader.init();
    
    try {
      // 1. Load Manifest (Check window global, standard path, and fallback path)
      if (window.XIAN_NI_MANIFEST) {
        state.manifest = window.XIAN_NI_MANIFEST;
      } else {
        try {
          const manifestRes = await fetch('data/manifest.json');
          if (manifestRes.ok) {
            state.manifest = await manifestRes.json();
          } else {
            throw new Error('manifest.json 404');
          }
        } catch (e) {
          const res2 = await fetch('data%5Cmanifest.json');
          state.manifest = await res2.json();
        }
      }
      
      // 2. Load Search Index
      if (window.XIAN_NI_SEARCH_INDEX) {
        state.searchIndex = window.XIAN_NI_SEARCH_INDEX;
      } else {
        fetch('data/search_index.json')
          .then(res => res.ok ? res.json() : fetch('data%5Csearch_index.json').then(r => r.json()))
          .then(data => { state.searchIndex = data; })
          .catch(() => {});
      }
      
      // 3. Render Bookshelf & Setup UI
      renderBookshelf(state.manifest.volumes);
      populateVolumeDropdown(state.manifest.volumes);
      renderTocAccordion(state.manifest.volumes);
      updateResumeButton();
      
      cultivationManager.init();
      characterWiki.init();
      ambientSoundEngine.updateUI();
    } catch (err) {
      console.error('Initialization error:', err);
      dom.volumesGrid.innerHTML = `
        <div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--accent-color);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <h3>ไม่สามารถโหลดข้อมูลหนังสือได้</h3>
          <p style="margin-top: 0.5rem; color: var(--text-muted);">กรุณาเปิดผ่าน Web Server หรืออัปโหลดไฟล์ Zip ใหม่</p>
        </div>
      `;
    }
  }

  async function loadVolumeData(volNum) {
    if (state.volumeCache.has(volNum)) {
      return state.volumeCache.get(volNum);
    }
    
    if (window.XIAN_NI_VOLUMES && window.XIAN_NI_VOLUMES[volNum]) {
      const data = window.XIAN_NI_VOLUMES[volNum];
      state.volumeCache.set(volNum, data);
      return data;
    }
    
    const volStr = padZero(volNum, 2);
    
    // Try standard POSIX path
    try {
      const res = await fetch(`data/vol_${volStr}.json`);
      if (res.ok) {
        const data = await res.json();
        state.volumeCache.set(volNum, data);
        return data;
      }
    } catch (e) {}
    
    // Try fallback backslash encoded path
    try {
      const res2 = await fetch(`data%5Cvol_${volStr}.json`);
      if (res2.ok) {
        const data = await res2.json();
        state.volumeCache.set(volNum, data);
        return data;
      }
    } catch (e) {}
    
    // Fallback: Load vol_XX.js dynamically
    try {
      await loadScript(`data/vol_${volStr}.js`);
      if (window.XIAN_NI_VOLUMES && window.XIAN_NI_VOLUMES[volNum]) {
        const data = window.XIAN_NI_VOLUMES[volNum];
        state.volumeCache.set(volNum, data);
        return data;
      }
    } catch (scriptErr) {}
    
    // Fallback 2: Load vol_XX.js with encoded path
    try {
      await loadScript(`data%5Cvol_${volStr}.js`);
      if (window.XIAN_NI_VOLUMES && window.XIAN_NI_VOLUMES[volNum]) {
        const data = window.XIAN_NI_VOLUMES[volNum];
        state.volumeCache.set(volNum, data);
        return data;
      }
    } catch (scriptErr2) {}
    
    throw new Error(`Could not load volume ${volNum} data`);
  }

  // --- Bookshelf View Rendering ---
  function renderBookshelf(volumes) {
    dom.volumesGrid.innerHTML = '';
    
    volumes.forEach(vol => {
      const card = document.createElement('div');
      card.className = 'volume-card';
      card.dataset.vol = vol.volume;
      
      const lastReadInVol = state.history[vol.volume] || 0;
      const progressPercent = lastReadInVol ? Math.min(100, Math.round(((lastReadInVol - vol.chapter_start + 1) / vol.chapter_count) * 100)) : 0;
      
      // Fallback for cover image if flat path
      const coverPath = vol.cover_image.replace('\\', '/');
      
      card.innerHTML = `
        <div class="volume-card-cover">
          <img src="${coverPath}" alt="เล่มที่ ${vol.volume}" loading="lazy" onerror="this.onerror=null; this.src='covers%5Ccover_${vol.vol_str}.jpg';">
          <div class="volume-num-badge">เล่มที่ ${vol.volume}</div>
          <div class="volume-pdf-badge" title="จำนวนหน้าในไฟล์ PDF ต้นฉบับ">
            <i class="fa-regular fa-file-pdf"></i> ${vol.pdf_pages} หน้า
          </div>
        </div>
        <div class="volume-card-body">
          <h3 class="volume-card-title">เล่มที่ ${vol.volume}</h3>
          <div class="volume-card-sub">${vol.subtitle}</div>
          <div class="volume-card-meta">
            <span><i class="fa-solid fa-list"></i> ${vol.chapter_count} ตอน</span>
            <span><i class="fa-solid fa-file-lines"></i> ${vol.pdf_filename.replace('.pdf', '')}</span>
          </div>
          <div class="volume-progress-container" title="อ่านแล้ว ${progressPercent}%">
            <div class="volume-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        const targetChap = lastReadInVol >= vol.chapter_start ? lastReadInVol : vol.chapter_start;
        openChapter(vol.volume, targetChap);
      });
      
      dom.volumesGrid.appendChild(card);
    });
  }

  function updateVolumeProgressBars() {
    if (!state.manifest) return;
    const cards = dom.volumesGrid.querySelectorAll('.volume-card');
    cards.forEach(card => {
      const volNum = parseInt(card.dataset.vol, 10);
      const vol = state.manifest.volumes.find(v => v.volume === volNum);
      if (vol) {
        const lastReadInVol = state.history[volNum] || 0;
        const progressPercent = lastReadInVol ? Math.min(100, Math.round(((lastReadInVol - vol.chapter_start + 1) / vol.chapter_count) * 100)) : 0;
        const bar = card.querySelector('.volume-progress-bar');
        if (bar) bar.style.width = `${progressPercent}%`;
      }
    });
  }

  function updateResumeButton() {
    const vol = state.currentVolumeNum || 1;
    const chap = state.currentChapterId || 1;
    dom.resumeLabel.textContent = `เล่มที่ ${vol} ตอนที่ ${chap}`;
  }

  // --- Volume & Chapter Dropdowns ---
  function populateVolumeDropdown(volumes) {
    dom.volSelectDropdown.innerHTML = '';
    volumes.forEach(vol => {
      const opt = document.createElement('option');
      opt.value = vol.volume;
      opt.textContent = `เล่มที่ ${vol.volume} (${vol.subtitle})`;
      dom.volSelectDropdown.appendChild(opt);
    });
  }

  function populateChapterDropdown(chapters) {
    dom.chapSelectDropdown.innerHTML = '';
    chapters.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch.id;
      opt.textContent = ch.title;
      dom.chapSelectDropdown.appendChild(opt);
    });
  }

  // --- Reading View / Chapter Opener ---
  async function openChapter(volNum, chapterId, scrollToTop = true) {
    try {
      state.viewMode = 'reader';
      dom.bookshelfView.classList.add('hidden');
      dom.readerView.classList.remove('hidden');
      dom.headerReadingInfo.classList.remove('hidden');
      
      state.currentVolumeNum = volNum;
      state.currentChapterId = chapterId;
      
      const volData = await loadVolumeData(volNum);
      state.currentVolumeData = volData;

      const chapters = Array.isArray(volData) ? volData : (volData.chapters || []);
      const volMeta = (state.manifest && state.manifest.volumes) ? state.manifest.volumes.find(v => v.volume === volNum) : null;
      const pdfPages = volData.pdf_pages || (volMeta ? volMeta.pdf_pages : 0);
      const pdfFilename = volData.pdf_filename || (volMeta ? volMeta.pdf_filename : `Xian_Ni_เล่ม_${volNum}.pdf`);

      let chapter = chapters.find(c => c.id === chapterId);
      if (!chapter) {
        chapter = chapters[0];
        state.currentChapterId = chapter ? chapter.id : 1;
      }
      if (!chapter) return;

      dom.headerVolBadge.textContent = `เล่มที่ ${volNum}`;
      dom.headerChapTitle.textContent = chapter.title;
      const pageStart = chapter.page_start || 1;
      const pageEnd = chapter.page_end || pdfPages;
      dom.headerPdfPageText.textContent = `PDF หน้า ${pageStart}-${pageEnd} / ${pdfPages}`;

      dom.volSelectDropdown.value = volNum;
      populateChapterDropdown(chapters);
      dom.chapSelectDropdown.value = chapter.id;

      dom.readerVolTag.textContent = `เล่มที่ ${volNum} (จากชุด 44 เล่ม)`;
      dom.readerChapTitle.textContent = chapter.title;
      dom.pdfFilenameText.textContent = pdfFilename;
      dom.pdfPageRangeText.textContent = `${pageStart} - ${pageEnd}`;
      dom.pdfTotalPagesText.textContent = pdfPages;

      if (Array.isArray(chapter.paragraphs)) {
        dom.chapterContentArea.innerHTML = chapter.paragraphs.map((p, idx) => `<p data-p-idx="${idx}">${p}</p>`).join('');
      } else {
        dom.chapterContentArea.innerHTML = chapter.content || '';
      }

      // Allow click-to-speak on any paragraph
      dom.chapterContentArea.querySelectorAll('p').forEach((pEl, pIdx) => {
        pEl.addEventListener('click', () => {
          speechReader.start(pIdx);
        });
      });

      if (speechReader.isPlaying) {
        speechReader.stop();
      }

      const chapIndex = chapters.findIndex(c => c.id === chapter.id);
      const isFirst = (volNum === 1 && chapIndex === 0);
      const isLast = (volNum === 44 && chapIndex === chapters.length - 1);

      dom.btnPrevChapterBottom.disabled = isFirst;
      dom.btnNextChapterBottom.disabled = isLast;
      dom.btnFloatingPrev.disabled = isFirst;
      dom.btnFloatingNext.disabled = isLast;

      dom.chapterSlider.min = 0;
      dom.chapterSlider.max = chapters.length - 1;
      dom.chapterSlider.value = chapIndex;
      dom.bottomChapStatus.textContent = `ตอนที่ ${chapIndex + 1} จาก ${chapters.length} ในเล่มนี้`;

      if (chapIndex === chapters.length - 1 && volNum < 44) {
        dom.volumeEndNotice.classList.remove('hidden');
        dom.endedVolNum.textContent = volNum;
      } else {
        dom.volumeEndNotice.classList.add('hidden');
      }
      
      updateBookmarkIcon();
      highlightActiveTocChapter(chapter.id);
      saveLastRead(volNum, chapter.id);
      
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      
      closeDrawer();
      
    } catch (err) {
      console.error('Error opening chapter:', err);
      showToast('เกิดข้อผิดพลาดในการเปิดตอน');
    }
  }

  function goToPreviousChapter() {
    if (!state.currentVolumeData) return;
    const chaps = Array.isArray(state.currentVolumeData) ? state.currentVolumeData : (state.currentVolumeData.chapters || []);
    const currIndex = chaps.findIndex(c => c.id === state.currentChapterId);
    
    if (currIndex > 0) {
      openChapter(state.currentVolumeNum, chaps[currIndex - 1].id);
    } else if (state.currentVolumeNum > 1) {
      const prevVol = state.currentVolumeNum - 1;
      loadVolumeData(prevVol).then(pData => {
        const pChaps = Array.isArray(pData) ? pData : (pData.chapters || []);
        const lastChap = pChaps[pChaps.length - 1];
        if (lastChap) openChapter(prevVol, lastChap.id);
      });
    }
  }

  function goToNextChapter() {
    if (!state.currentVolumeData) return;
    const chaps = Array.isArray(state.currentVolumeData) ? state.currentVolumeData : (state.currentVolumeData.chapters || []);
    const currIndex = chaps.findIndex(c => c.id === state.currentChapterId);
    
    if (currIndex < chaps.length - 1) {
      openChapter(state.currentVolumeNum, chaps[currIndex + 1].id);
    } else if (state.currentVolumeNum < 44) {
      const nextVol = state.currentVolumeNum + 1;
      loadVolumeData(nextVol).then(nData => {
        const nChaps = Array.isArray(nData) ? nData : (nData.chapters || []);
        const firstChap = nChaps[0];
        if (firstChap) openChapter(nextVol, firstChap.id);
      });
    }
  }

  function showBookshelf() {
    state.viewMode = 'bookshelf';
    dom.readerView.classList.add('hidden');
    dom.bookshelfView.classList.remove('hidden');
    dom.headerReadingInfo.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeDrawer();
  }

  // --- Table of Contents Drawer ---
  function renderTocAccordion(volumes) {
    dom.tocVolumeList.innerHTML = '';
    
    volumes.forEach(vol => {
      const volItem = document.createElement('div');
      volItem.className = 'toc-volume-item';
      volItem.dataset.vol = vol.volume;
      
      volItem.innerHTML = `
        <div class="toc-volume-header">
          <div class="toc-vol-left">
            <i class="fa-solid fa-chevron-right chevron-icon"></i>
            <strong>เล่มที่ ${vol.volume}</strong>
            <span>(${vol.subtitle})</span>
          </div>
          <div class="toc-vol-right">
            <span><i class="fa-regular fa-file-pdf"></i> ${vol.pdf_pages} น.</span>
          </div>
        </div>
        <div class="toc-chapter-list" id="tocChapList_${vol.volume}">
          <div style="padding: 0.5rem 1rem; color: var(--text-muted); font-size: 0.8rem;">
            <i class="fa-solid fa-spinner fa-spin"></i> กำลังโหลดรายการตอน...
          </div>
        </div>
      `;
      
      const header = volItem.querySelector('.toc-volume-header');
      header.addEventListener('click', async () => {
        const isOpen = volItem.classList.contains('open');
        dom.tocVolumeList.querySelectorAll('.toc-volume-item.open').forEach(el => {
          if (el !== volItem) {
            el.classList.remove('open');
            const icon = el.querySelector('.chevron-icon');
            if (icon) icon.className = 'fa-solid fa-chevron-right chevron-icon';
          }
        });
        
        if (!isOpen) {
          volItem.classList.add('open');
          const icon = volItem.querySelector('.chevron-icon');
          if (icon) icon.className = 'fa-solid fa-chevron-down chevron-icon';
          
          const chapListContainer = volItem.querySelector('.toc-chapter-list');
          if (!chapListContainer.dataset.loaded) {
            const vData = await loadVolumeData(vol.volume);
            chapListContainer.innerHTML = '';
            vData.chapters.forEach(ch => {
              const chItem = document.createElement('div');
              chItem.className = `toc-chapter-item ${ch.id === state.currentChapterId ? 'active' : ''}`;
              chItem.dataset.chapId = ch.id;
              chItem.innerHTML = `
                <span>${ch.title}</span>
                <span class="toc-chap-page">น. ${ch.page_start}</span>
              `;
              chItem.addEventListener('click', (e) => {
                e.stopPropagation();
                openChapter(vol.volume, ch.id);
              });
              chapListContainer.appendChild(chItem);
            });
            chapListContainer.dataset.loaded = 'true';
          }
        } else {
          volItem.classList.remove('open');
          const icon = volItem.querySelector('.chevron-icon');
          if (icon) icon.className = 'fa-solid fa-chevron-right chevron-icon';
        }
      });
      
      dom.tocVolumeList.appendChild(volItem);
    });
  }

  function highlightActiveTocChapter(chapId) {
    dom.tocVolumeList.querySelectorAll('.toc-chapter-item').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.chapId, 10) === chapId);
    });
  }

  function openDrawer() {
    state.isDrawerOpen = true;
    dom.tocDrawerOverlay.classList.add('active');
    dom.tocDrawer.classList.add('active');
    
    if (state.currentVolumeNum) {
      const volItem = dom.tocVolumeList.querySelector(`.toc-volume-item[data-vol="${state.currentVolumeNum}"]`);
      if (volItem && !volItem.classList.contains('open')) {
        volItem.querySelector('.toc-volume-header').click();
      }
    }
  }

  function closeDrawer() {
    state.isDrawerOpen = false;
    dom.tocDrawerOverlay.classList.remove('active');
    dom.tocDrawer.classList.remove('active');
  }

  // --- Bookmarks Management ---
  function isCurrentChapterBookmarked() {
    return state.bookmarks.some(b => b.vol === state.currentVolumeNum && b.chap === state.currentChapterId);
  }

  function updateBookmarkIcon() {
    const isBookmarked = isCurrentChapterBookmarked();
    if (isBookmarked) {
      dom.bookmarkIcon.className = 'fa-solid fa-bookmark';
      dom.bookmarkIcon.style.color = 'var(--accent-color)';
    } else {
      dom.bookmarkIcon.className = 'fa-regular fa-bookmark';
      dom.bookmarkIcon.style.color = '';
    }
  }

  function toggleCurrentBookmark() {
    if (state.viewMode !== 'reader' || !state.currentVolumeData) {
      showToast('กรุณาเปิดตอนที่ต้องการคั่นหน้าก่อน');
      return;
    }
    
    const currChap = state.currentVolumeData.chapters.find(c => c.id === state.currentChapterId);
    if (!currChap) return;
    
    const index = state.bookmarks.findIndex(b => b.vol === state.currentVolumeNum && b.chap === state.currentChapterId);
    
    if (index >= 0) {
      state.bookmarks.splice(index, 1);
      showToast('ลบที่คั่นหน้านี้แล้ว');
    } else {
      state.bookmarks.unshift({
        vol: state.currentVolumeNum,
        chap: state.currentChapterId,
        title: currChap.title,
        pdfPage: currChap.page_start,
        timestamp: Date.now()
      });
      showToast('คั่นหน้านี้เรียบร้อยแล้ว');
    }
    
    saveBookmarks();
    updateBookmarkIcon();
  }

  function updateBookmarksUI() {
    dom.bookmarkCountBadge.textContent = state.bookmarks.length;
    
    if (state.bookmarks.length === 0) {
      dom.bookmarksList.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-bookmark"></i>
          <p>ยังไม่มีที่คั่นหน้า</p>
          <span>กดปุ่ม "คั่นหน้า" หรือกดคีย์ <strong>B</strong> ขณะอ่านเพื่อบันทึกตอนโปรด</span>
        </div>
      `;
      return;
    }
    
    dom.bookmarksList.innerHTML = '';
    state.bookmarks.forEach((bm, idx) => {
      const item = document.createElement('div');
      item.className = 'bookmark-item';
      
      const dateStr = new Date(bm.timestamp).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      
      item.innerHTML = `
        <div class="bm-left">
          <strong>${bm.title}</strong>
          <span>เล่มที่ ${bm.vol} • PDF หน้า ${bm.pdfPage} • ${dateStr}</span>
        </div>
        <button class="bm-delete-btn" title="ลบที่คั่นหน้า"><i class="fa-solid fa-trash-can"></i></button>
      `;
      
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.bm-delete-btn')) {
          openChapter(bm.vol, bm.chap);
        }
      });
      
      const delBtn = item.querySelector('.bm-delete-btn');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.bookmarks.splice(idx, 1);
        saveBookmarks();
        updateBookmarkIcon();
        showToast('ลบที่คั่นหน้าแล้ว');
      });
      
      dom.bookmarksList.appendChild(item);
    });
  }

  // --- Search System ---
  function openSearchModal() {
    state.activeModal = dom.searchModalOverlay;
    dom.searchModalOverlay.classList.add('active');
    dom.globalSearchInput.focus();
  }

  function closeSearchModal() {
    dom.searchModalOverlay.classList.remove('active');
    state.activeModal = null;
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    
    if (!q) {
      dom.btnClearSearch.style.display = 'none';
      dom.searchResultsArea.innerHTML = `
        <div class="search-hints">
          <p><i class="fa-solid fa-lightbulb"></i> เคล็ดลับการค้นหา:</p>
          <ul>
            <li>พิมพ์เลขตอนโดยตรง เช่น <code>1</code>, <code>100</code>, <code>2088</code></li>
            <li>พิมพ์ชื่อหรือคำค้น เช่น <code>หวังหลิน</code>, <code>สวรรค์</code>, <code>เซียน</code>, <code>สังหาร</code></li>
          </ul>
        </div>
      `;
      return;
    }
    
    dom.btnClearSearch.style.display = 'block';
    
    if (!state.searchIndex) {
      dom.searchResultsArea.innerHTML = `<div class="search-hints"><i class="fa-solid fa-spinner fa-spin"></i> กำลังโหลดฐานข้อมูลค้นหา...</div>`;
      return;
    }
    
    const numMatch = q.match(/^(\d+)$/);
    let results = [];
    
    if (numMatch) {
      const targetNum = parseInt(numMatch[1], 10);
      results = state.searchIndex.filter(item => item.id === targetNum);
    }
    
    const kwResults = state.searchIndex.filter(item => item.title.toLowerCase().includes(q));
    const finalResults = [...new Set([...results, ...kwResults])].slice(0, 50);
    
    if (finalResults.length === 0) {
      dom.searchResultsArea.innerHTML = `
        <div class="search-hints" style="text-align: center; padding: 2rem;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; opacity: 0.3; margin-bottom: 0.5rem;"></i>
          <p>ไม่พบผลลัพธ์สำหรับ "<strong>${query}</strong>"</p>
        </div>
      `;
      return;
    }
    
    dom.searchResultsArea.innerHTML = '';
    finalResults.forEach(item => {
      const resItem = document.createElement('div');
      resItem.className = 'search-result-item';
      resItem.innerHTML = `
        <span class="res-title">${highlightQuery(item.title, q)}</span>
        <div class="res-meta">
          <span class="current-vol-badge" style="font-size: 0.7rem; padding: 1px 6px;">เล่มที่ ${item.vol}</span>
          <span>PDF น. ${item.page}</span>
        </div>
      `;
      
      resItem.addEventListener('click', () => {
        closeSearchModal();
        openChapter(item.vol, item.id);
      });
      
      dom.searchResultsArea.appendChild(resItem);
    });
  }

  function highlightQuery(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return text;
    const match = text.substring(idx, idx + query.length);
    return text.substring(0, idx) + `<mark style="background: var(--gold-bg); color: var(--gold-color); padding: 0 2px; border-radius: 2px;">${match}</mark>` + text.substring(idx + query.length);
  }

  // --- Settings Modal ---
  function openSettingsModal() {
    state.activeModal = dom.settingsModalOverlay;
    dom.settingsModalOverlay.classList.add('active');
  }

  function closeSettingsModal() {
    dom.settingsModalOverlay.classList.remove('active');
    state.activeModal = null;
  }

  // --- Zen Ambient Soundscape Synthesizer (Web Audio API) ---
  const ambientSoundEngine = {
    ctx: null,
    masterGain: null,
    windGain: null,
    rainGain: null,
    bellGain: null,
    streamGain: null,
    bellTimer: null,
    isPlaying: false,
    activePreset: 'meditation',
    volumes: {
      master: 0.7,
      wind: 0.4,
      bell: 0.5,
      rain: 0.0,
      stream: 0.0
    },

    ensureContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volumes.master, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.windGain = this.ctx.createGain();
        this.rainGain = this.ctx.createGain();
        this.bellGain = this.ctx.createGain();
        this.streamGain = this.ctx.createGain();

        this.windGain.gain.setValueAtTime(this.volumes.wind, this.ctx.currentTime);
        this.rainGain.gain.setValueAtTime(this.volumes.rain, this.ctx.currentTime);
        this.bellGain.gain.setValueAtTime(this.volumes.bell, this.ctx.currentTime);
        this.streamGain.gain.setValueAtTime(this.volumes.stream, this.ctx.currentTime);

        this.windGain.connect(this.masterGain);
        this.rainGain.connect(this.masterGain);
        this.bellGain.connect(this.masterGain);
        this.streamGain.connect(this.masterGain);

        this.setupGenerators();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    createNoiseBuffer() {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      return noiseBuffer;
    },

    setupGenerators() {
      const noiseBuf = this.createNoiseBuffer();

      // 1. Wind (Swept Bandpass)
      const windSrc = this.ctx.createBufferSource();
      windSrc.buffer = noiseBuf;
      windSrc.loop = true;
      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      windFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();

      windSrc.connect(windFilter);
      windFilter.connect(this.windGain);
      windSrc.start();

      // 2. Rain (Lowpass)
      const rainSrc = this.ctx.createBufferSource();
      rainSrc.buffer = noiseBuf;
      rainSrc.loop = true;
      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      rainSrc.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      rainSrc.start();

      // 3. Stream (Resonant mid-band)
      const streamSrc = this.ctx.createBufferSource();
      streamSrc.buffer = noiseBuf;
      streamSrc.loop = true;
      const streamFilter = this.ctx.createBiquadFilter();
      streamFilter.type = 'bandpass';
      streamFilter.frequency.setValueAtTime(750, this.ctx.currentTime);
      streamFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);
      streamSrc.connect(streamFilter);
      streamFilter.connect(this.streamGain);
      streamSrc.start();
    },

    ringBell() {
      this.ensureContext();
      if (this.volumes.bell <= 0 || this.volumes.master <= 0) return;
      
      const now = this.ctx.currentTime;
      const baseFreq = 432;
      const harmonics = [1.0, 2.02, 3.05, 4.2];
      const gains = [0.6, 0.25, 0.12, 0.05];

      harmonics.forEach((h, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * h, now);
        
        const targetGain = gains[idx] * this.volumes.bell;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(g);
        g.connect(this.bellGain);

        osc.start(now);
        osc.stop(now + 4.6);
      });
    },

    startBellTimer() {
      this.stopBellTimer();
      const scheduleNext = () => {
        const delay = (20 + Math.random() * 8) * 1000;
        this.bellTimer = setTimeout(() => {
          if (this.isPlaying && this.volumes.bell > 0) {
            this.ringBell();
          }
          scheduleNext();
        }, delay);
      };
      scheduleNext();
    },

    stopBellTimer() {
      if (this.bellTimer) {
        clearTimeout(this.bellTimer);
        this.bellTimer = null;
      }
    },

    setPreset(preset) {
      this.ensureContext();
      this.activePreset = preset;
      if (preset === 'meditation') {
        this.volumes.master = 0.7;
        this.volumes.wind = 0.4;
        this.volumes.bell = 0.5;
        this.volumes.rain = 0.0;
        this.volumes.stream = 0.0;
        this.isPlaying = true;
      } else if (preset === 'rain') {
        this.volumes.master = 0.7;
        this.volumes.wind = 0.2;
        this.volumes.bell = 0.3;
        this.volumes.rain = 0.6;
        this.volumes.stream = 0.0;
        this.isPlaying = true;
      } else if (preset === 'bamboo') {
        this.volumes.master = 0.7;
        this.volumes.wind = 0.3;
        this.volumes.bell = 0.2;
        this.volumes.rain = 0.0;
        this.volumes.stream = 0.5;
        this.isPlaying = true;
      } else if (preset === 'mute') {
        this.volumes.master = 0.0;
        this.isPlaying = false;
      }
      this.applyVolumes();
      this.updateUI();
      if (this.isPlaying) {
        this.startBellTimer();
        if (preset === 'meditation') this.ringBell();
      } else {
        this.stopBellTimer();
      }
    },

    applyVolumes() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(this.volumes.master, now + 0.05);
      this.windGain.gain.linearRampToValueAtTime(this.volumes.wind, now + 0.05);
      this.rainGain.gain.linearRampToValueAtTime(this.volumes.rain, now + 0.05);
      this.bellGain.gain.linearRampToValueAtTime(this.volumes.bell, now + 0.05);
      this.streamGain.gain.linearRampToValueAtTime(this.volumes.stream, now + 0.05);
    },

    updateUI() {
      const sMaster = document.getElementById('sliderMasterAmbient');
      const sWind = document.getElementById('sliderWindAmbient');
      const sBell = document.getElementById('sliderBellAmbient');
      const sRain = document.getElementById('sliderRainAmbient');
      const sStream = document.getElementById('sliderStreamAmbient');

      if (sMaster) sMaster.value = Math.round(this.volumes.master * 100);
      if (sWind) sWind.value = Math.round(this.volumes.wind * 100);
      if (sBell) sBell.value = Math.round(this.volumes.bell * 100);
      if (sRain) sRain.value = Math.round(this.volumes.rain * 100);
      if (sStream) sStream.value = Math.round(this.volumes.stream * 100);

      const lblMaster = document.getElementById('ambientMasterVal');
      const lblWind = document.getElementById('ambientWindVal');
      const lblBell = document.getElementById('ambientBellVal');
      const lblRain = document.getElementById('ambientRainVal');
      const lblStream = document.getElementById('ambientStreamVal');

      if (lblMaster) lblMaster.textContent = `${Math.round(this.volumes.master * 100)}%`;
      if (lblWind) lblWind.textContent = `${Math.round(this.volumes.wind * 100)}%`;
      if (lblBell) lblBell.textContent = `${Math.round(this.volumes.bell * 100)}%`;
      if (lblRain) lblRain.textContent = `${Math.round(this.volumes.rain * 100)}%`;
      if (lblStream) lblStream.textContent = `${Math.round(this.volumes.stream * 100)}%`;

      document.querySelectorAll('.preset-card-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === this.activePreset);
      });

      const btnHeader = document.getElementById('btnToggleAmbient');
      const btnFloat = document.getElementById('btnFloatingAmbient');
      const isActive = this.isPlaying && this.volumes.master > 0;
      if (btnHeader) btnHeader.classList.toggle('btn-ambient-active', isActive);
      if (btnFloat) btnFloat.classList.toggle('btn-ambient-active', isActive);
    }
  };

  // --- Character Wiki Module ---
  const characterWiki = {
    data: [
      {
        id: 'wangLin',
        category: 'protagonist',
        nameTh: 'หวังหลิน',
        nameCn: '王林',
        alias: 'เถี่ยจู / หวังหม่าจื่อ / เซียนสังหาร / มหาปฐมเทพ 8 ดาว',
        realm: 'สถิตเหนือกฎเกณฑ์ (ก้าวที่สี่ - สวรรค์เหยียบย่ำ)',
        artifacts: ['ลูกปัดฝืนลิขิตฟ้า (มุกสวรรค์)', 'กระบี่เซียน', 'ธงวิญญาณร้อยลี้', 'เตาหลอมวิญญาณ'],
        desc: 'เด็กหนุ่มชนบทผู้มีพรสวรรค์ธรรมดาแต่จิตใจแน่วแน่เด็ดเดี่ยว ไม่ยอมจำนนต่อโชคชะตา บังเอิญได้ครอบครองลูกปัดฝืนลิขิตฟ้า ผ่านการสูญเสียครอบครัวและคนรักจนเข้าใจวิถีแห่งการเอาชีวิตรอด ใครดีมาดีตอบ ใครร้ายมาร้ายกลับร้อยเท่าพันทวี สังหารศัตรูอย่างเด็ดขาด แต่รักมั่นคงต่อหลี่มู่หว่านเพียงผู้เดียว',
        quote: '"หากฟ้ากำหนดให้ข้าต้องตาย ข้าจะฝืนลิขิตฟ้า... หากเซียนขวางทาง ข้าจะสังหารเซียน!"'
      },
      {
        id: 'situNan',
        category: 'mentor',
        nameTh: 'ซื่อถูหนาน',
        nameCn: '司徒南',
        alias: 'บรรพชนรุ่นที่หนึ่งแห่งดาวซู่ซิง / เจ้าชายจอมสำราญแดนเซียน',
        realm: 'ขั้นหยั่งรู้เซียน ➔ ก้าวที่สอง',
        artifacts: ['วิชาเซียนมาร', 'พลังหยินหยางดาวซู่ซิง'],
        desc: 'วิญญาณแรกเริ่มระดับบรรพชนที่สถิตอยู่ในลูกปัดฝืนลิขิตฟ้า อาจารย์และสหายร่วมเป็นร่วมตายคนแรกของหวังหลิน คอยชี้แนะวิชาเซียนมารและช่วยชีวิตหวังหลินนับครั้งไม่ถ้วน นิสัยห่าม รักสนุก สุรานารี แต่จริงใจต่อมิตรสหายอย่างที่สุด',
        quote: '"ไอ้หนูเอ๋ย... ในโลกเซียนนี้น่ะ ความอ่อนแอคือบาปมหันต์ มีเพียงความแข็งแกร่งเท่านั้นที่จะรอด!"'
      },
      {
        id: 'liMuwan',
        category: 'love',
        nameTh: 'หลี่มู่หว่าน',
        nameCn: '李慕婉',
        alias: 'ยอดปรมาจารย์แห่งการปรุงโอสถแห่งสำนักลั่วหวง',
        realm: 'ขั้นก่อแก่นปราณ ➔ ก่อกำเนิดวิญญาณ',
        artifacts: ['เตาหลอมโอสถเก้าสวรรค์', 'โอสถวิญญาณชั้นสูง'],
        desc: 'หญิงคนรักแท้หนึ่งเดียวของหวังหลิน อ่อนโยน จิตใจบริสุทธิ์ และเปี่ยมพรสวรรค์ด้านโอสถ แม้นางจะสิ้นอายุขัย หวังหลินก็ไม่ยอมรับชะตากรรม ฝืนกฎวัฏจักรวิญญาณช่วงชิงดวงวิญญาณของนางจากมัจจุราช และใช้เวลาทั้งชีวิตเพื่อชุบชีวิตนางกลับมา',
        quote: '"หวังหลิน... ชาตินี้ได้พบเจ้า แม้ข้าต้องดับสูญ ก็ไม่นึกเสียดายเลยสักนิด"'
      },
      {
        id: 'tengHuayuan',
        category: 'enemy',
        nameTh: 'เถิงฮว่าหยวน',
        nameCn: '藤化元',
        alias: 'บรรพชนตระกูลเถิงแห่งแคว้นจ้าว',
        realm: 'ขั้นก่อกำเนิดวิญญาณ (Nascent Soul)',
        artifacts: ['โลหิตอาฆาต', 'ศิลาวิญญาณตระกูลเถิง'],
        desc: 'ศัตรูคู่อาฆาตตัวฉกาจผู้จุดไฟแค้นสะเทือนปฐพี หลังจากหวังหลินสังหารเถิงลี่ผู้เป็นหลาน เถิงฮว่าหยวนนำคนบุกฆ่าล้างตระกูลหวังจนหมดสิ้นและเสียบหัวคนในครอบครัวหวังหลินประจาน หลายร้อยปีต่อมา หวังหลินบรรลุวิชาเซียนกลับมาล้างแค้น สังหารตระกูลเถิงจนสิ้นซาก',
        quote: '"ตระกูลเถิงของข้าจะตามล่าเจ้าไปจนสุดหล้าฟ้าเขียว!"'
      },
      {
        id: 'zhouYi',
        category: 'mentor',
        nameTh: 'โจวอี้',
        nameCn: '周佚',
        alias: 'กระบี่คลั่งแห่งความรัก / อดีตยอดฝีมือแดนซู่ซิง',
        realm: 'ขั้นแปรวิญญาณ (Soul Transformation)',
        artifacts: ['กระบี่เซียนโบราณ', 'จิตวิญญาณกระบี่แห่งรัก'],
        desc: 'ชายผู้ยึดมั่นในความรักอย่างสุดหัวใจ เฝ้าศพหญิงคนรัก "ถิงเอ๋อร์" ในหุบเขาเซียนพินาศนานนับพันปี เขาประทับใจในความรักที่หวังหลินมีต่อหลี่มู่หว่าน จึงมอบกระบี่เซียนและชี้นำเต๋าแห่งความรักอันลึกซึ้งให้แก่หวังหลิน',
        quote: '"ความรักของข้า แม้ฟ้าดินจะพินาศ ก็ไม่อาจลบล้างความรู้สึกในใจข้าได้"'
      },
      {
        id: 'tuSi',
        category: 'ancient',
        nameTh: 'กู่เสินถูซือ',
        nameCn: '涂司',
        alias: 'มหาปฐมเทพโบราณ 8 ดาว (Royal Ancient God)',
        realm: 'ปฐมเทพโบราณ 8 ดาว (เทียบเท่าเซียนชั้นสูงสุด)',
        artifacts: ['ทะเลดวงดาวปฐมเทพ', 'ดวงตาโลหิต', 'กายาศิลาอมตะ'],
        desc: 'หนึ่งในยอดคนเผ่าพันธุ์โบราณที่ยิ่งใหญ่ที่สุดในจักรวาล ร่างเนื้อดับสูญแต่ทิ้งมรดกความทรงจำและสายเลือดปฐมเทพไว้ หวังหลินผ่านบททดสอบจนได้ครอบครองมรดกความทรงจำและสืบทอดสายเลือดปฐมเทพ กลายเป็นยอดฝีมือสองสาย (เซียนและปฐมเทพ)',
        quote: '"ผู้ที่สืบทอดสายเลือดของข้า จะต้องเป็นผู้ที่เหยียบย่ำดวงดาราทั้งจักรวาล!"'
      },
      {
        id: 'liuMei',
        category: 'love',
        nameTh: 'หลิ่วเหมย',
        nameCn: '柳眉',
        alias: 'สตรีงามล่มเมืองแห่งแดนซู่ซิง / ร่างจำแลงเทพเซียน',
        realm: 'ขั้นแปรวิญญาณ ➔ ชำระวิญญาณ',
        artifacts: ['กระจกมายาพันพัว', 'วิชาเต๋าไร้ใจ'],
        desc: 'สตรีผู้ฝึกวิชาเต๋าพันพัวและเต๋าไร้ใจ ใช้มารยาและเสน่ห์ควบคุมผู้ฝึกตน มีโชคชะตาผูกพันอันซับซ้อนและเจ็บปวดกับหวังหลิน และเป็นมารดาของหวังผิง ความสัมพันธ์ระหว่างนางกับหวังหลินสะท้อนถึงภาพลวงตาและความจริงแท้ในโลกบำเพ็ญเพียร',
        quote: '"เต๋าของข้าคือความไร้ใจ... แต่เหตุใดในใจข้ายังคงมีเงาของเจ้าอยู่เสมอ"'
      },
      {
        id: 'wangPing',
        category: 'protagonist',
        nameTh: 'หวังผิง',
        nameCn: '王平',
        alias: 'บุตรชายของหวังหลิน / มนุษย์ปุถุชน',
        realm: 'มนุษย์ธรรมดา (เลือกไม่ฝึกเซียน)',
        artifacts: ['หยกคุ้มครองวิญญาณของหวังหลิน'],
        desc: 'บุตรชายของหวังหลิน เพื่อไม่ให้ลูกต้องทนทุกข์กับความโหดเหี้ยมของเส้นทางฝึกเซียน หวังหลินจึงเลือกให้หวังผิงใช้ชีวิตอย่างสงบสุขเยี่ยงมนุษย์ธรรมดา หวังหลินแปลงเป็นชายชราเฝ้าดูแลบุตรชายตลอดชั่วอายุขัยจนกระทั่งแก่ชราและจากไปอย่างสงบ เป็นหนึ่งในฉากที่ซาบซึ้งและตราตรึงที่สุดในเรื่อง',
        quote: '"ท่านพ่อ... ลูกขอขอบคุณที่มอบชีวิตที่อบอุ่นและสงบสุขนี้ให้แก่ข้า"'
      }
    ],

    init() {
      this.renderCards('all');
      this.setupListeners();
    },

    renderCards(filter) {
      const grid = document.getElementById('wikiCardsGrid');
      if (!grid) return;
      grid.innerHTML = '';

      const filtered = filter === 'all' 
        ? this.data 
        : this.data.filter(c => c.category === filter);

      filtered.forEach(c => {
        const card = document.createElement('div');
        card.className = 'char-card';
        
        const artifactsHtml = c.artifacts.map(a => `<span class="artifact-pill"><i class="fa-solid fa-gem"></i> ${a}</span>`).join('');
        
        let avatarIcon = 'fa-user-ninja';
        if (c.category === 'love') avatarIcon = 'fa-spa';
        else if (c.category === 'mentor') avatarIcon = 'fa-dragon';
        else if (c.category === 'enemy') avatarIcon = 'fa-skull';
        else if (c.category === 'ancient') avatarIcon = 'fa-ankh';

        card.innerHTML = `
          <div class="char-card-header">
            <div class="char-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
            <div class="char-info">
              <div class="char-names">
                <span class="char-thai-name">${c.nameTh}</span>
                <span class="char-chinese-name">${c.nameCn}</span>
              </div>
              <span class="char-title-tag">${c.alias}</span>
            </div>
          </div>
          <div class="char-realm-badge"><i class="fa-solid fa-bolt"></i> ${c.realm}</div>
          <div class="char-artifacts">${artifactsHtml}</div>
          <p class="char-desc">${c.desc}</p>
          <div class="char-quote">${c.quote}</div>
        `;
        grid.appendChild(card);
      });
    },

    setupListeners() {
      const tags = document.querySelectorAll('.wiki-tag');
      tags.forEach(t => {
        t.addEventListener('click', () => {
          tags.forEach(x => x.classList.remove('active'));
          t.classList.add('active');
          this.renderCards(t.dataset.filter);
        });
      });
    }
  };

  // --- Reader Cultivation Progression Module ---
  const cultivationManager = {
    ranks: [
      { min: 0, max: 0, name: 'ปุถุชนคนธรรมดา', desc: 'มนุษย์ธรรมดาผู้ยังไม่สัมผัสพลังปราณฟ้าดิน', icon: 'fa-user' },
      { min: 1, max: 47, name: 'รวบรวมลมปราณ', desc: 'สัมผัสและชักนำพลังปราณฟ้าดินเข้าสู่จุดชีพจร เล่ม 1', icon: 'fa-seedling' },
      { min: 48, max: 150, name: 'สร้างรากฐาน', desc: 'หลอมรวมพลังปราณของเหลวสร้างรากฐานอันมั่นคง เล่ม 2-4', icon: 'fa-shield-halved' },
      { min: 151, max: 350, name: 'ก่อแก่นปราณ (จินตัน)', desc: 'กลั่นพลังปราณให้ตกผลึกเป็นแก่นแท้ทองคำ อายุขัย 500 ปี', icon: 'fa-gem' },
      { min: 351, max: 650, name: 'ก่อกำเนิดวิญญาณ (หยวนอิง)', desc: 'ทารกวิญญาณก่อกำเนิด กายเนื้อดับแต่วิญญาณยังไม่สูญ', icon: 'fa-wand-magic-sparkles' },
      { min: 651, max: 950, name: 'แปรวิญญาณ (ฮว่าเซิน)', desc: 'หลอมรวมพลังเต๋าแห่งชีวิตและความตาย ควบคุมกฎฟ้าดิน', icon: 'fa-yin-yang' },
      { min: 951, max: 1200, name: 'หยั่งรู้เซียน (เวิ่นติ่ง)', desc: 'ขั้นสูงสุดของก้าวแรก เตรียมตัดพันธนาการก้าวสู่แดนเซียน', icon: 'fa-mountain-sun' },
      { min: 1201, max: 1400, name: 'ส่องนิพพาน (คุยมี่)', desc: 'มองเห็นวัฏจักรแห่งการเกิดดับ หลอมรวมเจตจำนงสู่สวรรค์', icon: 'fa-eye' },
      { min: 1401, max: 1600, name: 'ชำระนิพพาน (จิ้งมี่)', desc: 'ขจัดมลทินในดวงวิญญาณ ปลดปล่อยพลังทำลายล้างดวงดาว', icon: 'fa-fire-flame-curved' },
      { min: 1601, max: 1800, name: 'แหลกนิพพาน (ซุยมี่)', desc: 'ทำลายนิพพานเพื่อก้าวข้าม สรรสร้างมิติกฎเกณฑ์ของตนเอง', icon: 'fa-burst' },
      { min: 1801, max: 2000, name: 'นิพพานว่างเปล่า (คงเนี่ย)', desc: 'ขอบเขตขั้นที่สาม ก้าวข้าม 9 วิบัติแห่งความว่างเปล่า', icon: 'fa-circle-nodes' },
      { min: 2001, max: 2088, name: 'สวรรค์เหยียบย่ำ (ท่าเทียน)', desc: 'ขั้นที่สี่อันสูงสุด ก้าวข้าม 9 สะพานสวรรค์ สถิตเหนือกฎเกณฑ์ทั้งปวง!', icon: 'fa-crown' }
    ],

    getTotalChaptersRead() {
      let count = 0;
      if (state.history) {
        Object.keys(state.history).forEach(vol => {
          count += parseInt(state.history[vol] || 0, 10);
        });
      }
      return Math.min(2088, count);
    },

    getCurrentRankInfo(readCount) {
      for (let i = this.ranks.length - 1; i >= 0; i--) {
        if (readCount >= this.ranks[i].min) {
          const nextRank = this.ranks[i + 1] || null;
          return {
            current: this.ranks[i],
            next: nextRank,
            index: i
          };
        }
      }
      return { current: this.ranks[0], next: this.ranks[1], index: 0 };
    },

    update() {
      const readCount = this.getTotalChaptersRead();
      const rankInfo = this.getCurrentRankInfo(readCount);
      
      const headerRankEl = document.getElementById('headerCultivationRank');
      if (headerRankEl) {
        headerRankEl.textContent = rankInfo.current.name;
      }

      const modalRankTitle = document.getElementById('statsCurrentRealmName');
      const modalRankDesc = document.getElementById('statsCurrentRealmDesc');
      const heroIcon = document.getElementById('statsHeroIcon');
      if (modalRankTitle) modalRankTitle.textContent = rankInfo.current.name;
      if (modalRankDesc) modalRankDesc.textContent = rankInfo.current.desc;
      if (heroIcon) heroIcon.className = `fa-solid ${rankInfo.current.icon}`;

      const progressFill = document.getElementById('statsProgressBarFill');
      const progressPct = document.getElementById('statsProgressPct');
      const nextName = document.getElementById('statsNextRealmName');
      const targetChap = document.getElementById('statsNextTargetChapter');
      const readChapCount = document.getElementById('statsReadChaptersCount');

      if (readChapCount) readChapCount.textContent = readCount;

      if (rankInfo.next) {
        if (nextName) nextName.textContent = rankInfo.next.name;
        if (targetChap) targetChap.textContent = rankInfo.next.min;
        const range = rankInfo.next.min - rankInfo.current.min;
        const progressInLevel = readCount - rankInfo.current.min;
        const pct = Math.min(100, Math.max(0, Math.round((progressInLevel / (range || 1)) * 100)));
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${pct}%`;
      } else {
        if (nextName) nextName.textContent = 'บรรลุสู่จุดสูงสุดแล้ว';
        if (targetChap) targetChap.textContent = '2088';
        if (progressFill) progressFill.style.width = '100%';
        if (progressPct) progressPct.textContent = '100%';
      }

      const valRead = document.getElementById('statsTotalReadVal');
      const valPct = document.getElementById('statsPercentCompleteVal');
      const valBm = document.getElementById('statsBookmarkCountVal');
      if (valRead) valRead.textContent = readCount;
      if (valPct) valPct.textContent = `${((readCount / 2088) * 100).toFixed(1)}%`;
      if (valBm) valBm.textContent = (state.bookmarks || []).length;

      const roadmapList = document.getElementById('roadmapList');
      if (roadmapList) {
        roadmapList.innerHTML = '';
        this.ranks.forEach((r, idx) => {
          const item = document.createElement('div');
          item.className = 'roadmap-item';
          if (idx < rankInfo.index) {
            item.classList.add('achieved');
            item.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${r.name} (${r.min}-${r.max} ตอน)</span>`;
          } else if (idx === rankInfo.index) {
            item.classList.add('current');
            item.innerHTML = `<i class="fa-solid fa-bolt"></i> <span>${r.name} (ขั้นปัจจุบัน)</span>`;
          } else {
            item.innerHTML = `<i class="fa-regular fa-circle"></i> <span>${r.name} (ตอนที่ ${r.min})</span>`;
          }
          roadmapList.appendChild(item);
        });
      }
    },

    init() {
      this.update();
    }
  };

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    dom.btnToggleNav.addEventListener('click', openDrawer);
    dom.btnGoHome.addEventListener('click', showBookshelf);
    dom.btnBackToShelf.addEventListener('click', showBookshelf);
    
    dom.btnCloseToc.addEventListener('click', closeDrawer);
    dom.tocDrawerOverlay.addEventListener('click', closeDrawer);
    
    dom.btnHeroResume.addEventListener('click', () => {
      openChapter(state.currentVolumeNum || 1, state.currentChapterId || 1);
    });
    
    dom.btnHeroStart.addEventListener('click', () => {
      openChapter(1, 1);
    });
    
    dom.volumeFilterInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      const cards = dom.volumesGrid.querySelectorAll('.volume-card');
      cards.forEach(c => {
        const text = c.textContent.toLowerCase();
        c.style.display = text.includes(val) ? '' : 'none';
      });
    });
    
    dom.drawerTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dom.drawerTabs.forEach(t => t.classList.remove('active'));
        dom.tabPanes.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const targetPane = document.getElementById(`tab${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });
    
    dom.tocFilterInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      const volItems = dom.tocVolumeList.querySelectorAll('.toc-volume-item');
      volItems.forEach(v => {
        const text = v.textContent.toLowerCase();
        v.style.display = text.includes(val) ? '' : 'none';
      });
    });
    
    dom.volSelectDropdown.addEventListener('change', (e) => {
      const volNum = parseInt(e.target.value, 10);
      loadVolumeData(volNum).then(vData => {
        openChapter(volNum, vData.chapters[0].id);
      });
    });
    
    dom.chapSelectDropdown.addEventListener('change', (e) => {
      const chapId = parseInt(e.target.value, 10);
      openChapter(state.currentVolumeNum, chapId);
    });
    
    dom.btnPrevChapterBottom.addEventListener('click', goToPreviousChapter);
    dom.btnNextChapterBottom.addEventListener('click', goToNextChapter);
    dom.btnFloatingPrev.addEventListener('click', goToPreviousChapter);
    dom.btnFloatingNext.addEventListener('click', goToNextChapter);
    dom.btnFloatingToc.addEventListener('click', openDrawer);
    
    dom.btnFloatingTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    dom.btnNextVolume.addEventListener('click', () => {
      if (state.currentVolumeNum < 44) {
        const nextVol = state.currentVolumeNum + 1;
        loadVolumeData(nextVol).then(nData => {
          openChapter(nextVol, nData.chapters[0].id);
        });
      }
    });
    
    dom.chapterSlider.addEventListener('input', (e) => {
      if (!state.currentVolumeData) return;
      const idx = parseInt(e.target.value, 10);
      const targetChap = state.currentVolumeData.chapters[idx];
      if (targetChap) {
        dom.bottomChapStatus.textContent = `${targetChap.title} (${idx + 1}/${state.currentVolumeData.chapters.length})`;
      }
    });
    
    dom.chapterSlider.addEventListener('change', (e) => {
      if (!state.currentVolumeData) return;
      const idx = parseInt(e.target.value, 10);
      const targetChap = state.currentVolumeData.chapters[idx];
      if (targetChap) {
        openChapter(state.currentVolumeNum, targetChap.id);
      }
    });
    
    dom.btnBookmark.addEventListener('click', toggleCurrentBookmark);
    
    dom.btnSearch.addEventListener('click', openSearchModal);
    dom.btnCloseSearch.addEventListener('click', closeSearchModal);
    dom.searchModalOverlay.addEventListener('click', (e) => {
      if (e.target === dom.searchModalOverlay) closeSearchModal();
    });
    dom.btnClearSearch.addEventListener('click', () => {
      dom.globalSearchInput.value = '';
      performSearch('');
      dom.globalSearchInput.focus();
    });
    dom.globalSearchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
    
    dom.btnThemeToggle.addEventListener('click', () => {
      const themes = ['sepia', 'light', 'dark', 'forest'];
      const currentIdx = themes.indexOf(state.settings.theme);
      const nextTheme = themes[(currentIdx + 1) % themes.length];
      state.settings.theme = nextTheme;
      applySettings();
      saveSettings();
      showToast(`เปลี่ยนธีมเป็น: ${nextTheme.toUpperCase()}`);
    });
    
    dom.btnSettings.addEventListener('click', openSettingsModal);
    dom.btnCloseSettings.addEventListener('click', closeSettingsModal);
    dom.btnDoneSettings.addEventListener('click', closeSettingsModal);
    dom.settingsModalOverlay.addEventListener('click', (e) => {
      if (e.target === dom.settingsModalOverlay) closeSettingsModal();
    });
    
    dom.fontOptionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.settings.fontFamily = btn.dataset.font;
        applySettings();
        saveSettings();
      });
    });
    
    dom.themeCardBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.settings.theme = btn.dataset.theme;
        applySettings();
        saveSettings();
      });
    });
    
    dom.fontSizeSlider.addEventListener('input', (e) => {
      state.settings.fontSize = parseInt(e.target.value, 10);
      applySettings();
      saveSettings();
    });
    
    dom.btnFontDec.addEventListener('click', () => {
      if (state.settings.fontSize > 14) {
        state.settings.fontSize -= 1;
        applySettings();
        saveSettings();
      }
    });
    
    dom.btnFontInc.addEventListener('click', () => {
      if (state.settings.fontSize < 34) {
        state.settings.fontSize += 1;
        applySettings();
        saveSettings();
      }
    });
    
    dom.lineHeightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.settings.lineHeight = parseFloat(btn.dataset.lh);
        applySettings();
        saveSettings();
      });
    });
    
    dom.pageWidthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.settings.pageWidth = btn.dataset.width;
        applySettings();
        saveSettings();
      });
    });
    
    dom.textAlignBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.settings.textAlign = btn.dataset.align;
        applySettings();
        saveSettings();
      });
    });
    
    // AI Audio Companion Listeners
    if (dom.btnToggleAudio) dom.btnToggleAudio.addEventListener('click', () => speechReader.toggleAudioBar());
    if (dom.btnFloatingAudio) dom.btnFloatingAudio.addEventListener('click', () => speechReader.toggleAudioBar());
    if (dom.btnAudioPlayPause) dom.btnAudioPlayPause.addEventListener('click', () => speechReader.pauseResume());
    if (dom.btnAudioStop) dom.btnAudioStop.addEventListener('click', () => speechReader.stop());
    if (dom.btnAudioPrev) dom.btnAudioPrev.addEventListener('click', () => speechReader.prev());
    if (dom.btnAudioNext) dom.btnAudioNext.addEventListener('click', () => speechReader.next());
    if (dom.btnCloseAudioBar) dom.btnCloseAudioBar.addEventListener('click', () => {
      speechReader.stop();
      if (dom.aiAudioBar) dom.aiAudioBar.classList.add('hidden');
    });
    if (dom.audioVoiceSelect) {
      dom.audioVoiceSelect.addEventListener('change', (e) => {
        speechReader.selectedVoice = e.target.value;
        if (speechReader.isPlaying) {
          speechReader.speakCurrentParagraph();
        }
      });
    }
    if (dom.audioSpeedSelect) {
      dom.audioSpeedSelect.addEventListener('change', (e) => {
        speechReader.rate = parseFloat(e.target.value) || 1.0;
        if (speechReader.isPlaying) {
          speechReader.speakCurrentParagraph();
        }
      });
    }
    if (dom.btnAudioAutoScroll) {
      dom.btnAudioAutoScroll.addEventListener('click', () => {
        speechReader.autoScroll = !speechReader.autoScroll;
        dom.btnAudioAutoScroll.classList.toggle('active', speechReader.autoScroll);
      });
    }

    dom.btnResetSettings.addEventListener('click', () => {
      state.settings = {
        fontFamily: 'font-sarabun',
        theme: 'sepia',
        fontSize: 20,
        lineHeight: 1.85,
        pageWidth: 'width-standard',
        textAlign: 'align-left'
      };
      applySettings();
      saveSettings();
      showToast('รีเซ็ตการตั้งค่าเป็นค่าเริ่มต้นแล้ว');
    });
    
    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const scrollPct = Math.min(100, Math.max(0, (window.scrollY / scrollTotal) * 100));
        dom.progressBar.style.width = `${scrollPct}%`;
      }
    });
    
    // Cultivation Realms Modal Handlers
    const btnRealms = document.getElementById('btnRealms');
    const realmsModalOverlay = document.getElementById('realmsModalOverlay');
    const btnCloseRealms = document.getElementById('btnCloseRealms');
    const btnDoneRealms = document.getElementById('btnDoneRealms');

    if (btnRealms && realmsModalOverlay) {
      btnRealms.addEventListener('click', () => {
        realmsModalOverlay.classList.add('active');
        state.activeModal = 'realms';
      });
      const closeRealms = () => {
        realmsModalOverlay.classList.remove('active');
        state.activeModal = null;
      };
      if (btnCloseRealms) btnCloseRealms.addEventListener('click', closeRealms);
      if (btnDoneRealms) btnDoneRealms.addEventListener('click', closeRealms);
      realmsModalOverlay.addEventListener('click', (e) => {
        if (e.target === realmsModalOverlay) closeRealms();
      });
    }

    // Ambient Soundscape Modal Handlers
    const btnToggleAmbient = document.getElementById('btnToggleAmbient');
    const btnFloatingAmbient = document.getElementById('btnFloatingAmbient');
    const ambientModalOverlay = document.getElementById('ambientModalOverlay');
    const btnCloseAmbient = document.getElementById('btnCloseAmbient');
    const btnDoneAmbient = document.getElementById('btnDoneAmbient');
    const btnRingBellNow = document.getElementById('btnRingBellNow');

    const openAmbientModal = () => {
      ambientSoundEngine.ensureContext();
      if (ambientModalOverlay) {
        ambientModalOverlay.classList.add('active');
        state.activeModal = 'ambient';
      }
    };
    const closeAmbientModal = () => {
      if (ambientModalOverlay) {
        ambientModalOverlay.classList.remove('active');
        state.activeModal = null;
      }
    };

    const btnHeroAmbient = document.getElementById('btnHeroAmbient');
    if (btnHeroAmbient) btnHeroAmbient.addEventListener('click', openAmbientModal);
    if (btnToggleAmbient) btnToggleAmbient.addEventListener('click', openAmbientModal);
    if (btnFloatingAmbient) btnFloatingAmbient.addEventListener('click', openAmbientModal);
    if (btnCloseAmbient) btnCloseAmbient.addEventListener('click', closeAmbientModal);
    if (btnDoneAmbient) btnDoneAmbient.addEventListener('click', closeAmbientModal);
    if (ambientModalOverlay) {
      ambientModalOverlay.addEventListener('click', (e) => {
        if (e.target === ambientModalOverlay) closeAmbientModal();
      });
    }
    if (btnRingBellNow) {
      btnRingBellNow.addEventListener('click', () => {
        ambientSoundEngine.ringBell();
      });
    }

    // Presets
    document.querySelectorAll('.preset-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ambientSoundEngine.setPreset(btn.dataset.preset);
      });
    });

    // Mixer sliders
    const setupSlider = (id, prop) => {
      const slider = document.getElementById(id);
      if (slider) {
        slider.addEventListener('input', (e) => {
          ambientSoundEngine.ensureContext();
          ambientSoundEngine.volumes[prop] = parseInt(e.target.value, 10) / 100;
          if (prop === 'master') {
            ambientSoundEngine.isPlaying = ambientSoundEngine.volumes.master > 0;
            if (ambientSoundEngine.isPlaying) ambientSoundEngine.startBellTimer();
            else ambientSoundEngine.stopBellTimer();
          }
          ambientSoundEngine.applyVolumes();
          ambientSoundEngine.updateUI();
        });
      }
    };
    setupSlider('sliderMasterAmbient', 'master');
    setupSlider('sliderWindAmbient', 'wind');
    setupSlider('sliderBellAmbient', 'bell');
    setupSlider('sliderRainAmbient', 'rain');
    setupSlider('sliderStreamAmbient', 'stream');

    // Character Wiki Modal Handlers
    const btnWiki = document.getElementById('btnWiki');
    const wikiModalOverlay = document.getElementById('wikiModalOverlay');
    const btnCloseWiki = document.getElementById('btnCloseWiki');
    const btnDoneWiki = document.getElementById('btnDoneWiki');

    const openWikiModal = () => {
      if (wikiModalOverlay) {
        wikiModalOverlay.classList.add('active');
        state.activeModal = 'wiki';
      }
    };
    const closeWikiModal = () => {
      if (wikiModalOverlay) {
        wikiModalOverlay.classList.remove('active');
        state.activeModal = null;
      }
    };

    const btnHeroWiki = document.getElementById('btnHeroWiki');
    if (btnHeroWiki) btnHeroWiki.addEventListener('click', openWikiModal);
    if (btnWiki) btnWiki.addEventListener('click', openWikiModal);
    if (btnCloseWiki) btnCloseWiki.addEventListener('click', closeWikiModal);
    if (btnDoneWiki) btnDoneWiki.addEventListener('click', closeWikiModal);
    if (wikiModalOverlay) {
      wikiModalOverlay.addEventListener('click', (e) => {
        if (e.target === wikiModalOverlay) closeWikiModal();
      });
    }

    // Cultivation Stats Modal Handlers
    const btnCultivationStats = document.getElementById('btnCultivationStats');
    const cultivationStatsModalOverlay = document.getElementById('cultivationStatsModalOverlay');
    const btnCloseCultivationStats = document.getElementById('btnCloseCultivationStats');
    const btnDoneCultivationStats = document.getElementById('btnDoneCultivationStats');

    const openCultivationModal = () => {
      cultivationManager.update();
      if (cultivationStatsModalOverlay) {
        cultivationStatsModalOverlay.classList.add('active');
        state.activeModal = 'stats';
      }
    };
    const closeCultivationModal = () => {
      if (cultivationStatsModalOverlay) {
        cultivationStatsModalOverlay.classList.remove('active');
        state.activeModal = null;
      }
    };

    if (btnCultivationStats) btnCultivationStats.addEventListener('click', openCultivationModal);
    if (btnCloseCultivationStats) btnCloseCultivationStats.addEventListener('click', closeCultivationModal);
    if (btnDoneCultivationStats) btnDoneCultivationStats.addEventListener('click', closeCultivationModal);
    if (cultivationStatsModalOverlay) {
      cultivationStatsModalOverlay.addEventListener('click', (e) => {
        if (e.target === cultivationStatsModalOverlay) closeCultivationModal();
      });
    }

    // 1-Click Chapter MP3 Audio Download
    const btnDownloadAudio = document.getElementById('btnDownloadChapterAudio');
    if (btnDownloadAudio) {
      btnDownloadAudio.addEventListener('click', () => {
        const vol = state.currentVolumeNum || 1;
        const chap = state.currentChapterId || 1;
        const voice = (dom.audioVoiceSelect && dom.audioVoiceSelect.value !== 'webspeech') ? dom.audioVoiceSelect.value : 'th-TH-NiwatNeural';
        showToast('กำลังเตรียมไฟล์เสียง MP3 ของตอนนี้สักครู่...');
        btnDownloadAudio.disabled = true;
        btnDownloadAudio.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังสร้าง MP3...';
        
        const url = `/api/download_chapter?vol=${vol}&chap=${chap}&voice=${voice}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `Xian_Ni_ตอนที่_${chap}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          btnDownloadAudio.disabled = false;
          btnDownloadAudio.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> <span class="btn-text">โหลด MP3 ตอนนี้</span>';
          showToast('เริ่มดาวน์โหลดไฟล์เสียง MP3 เรียบร้อยแล้ว');
        }, 3000);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (state.activeModal) {
        if (e.key === 'Escape') {
          closeSearchModal();
          closeSettingsModal();
          if (realmsModalOverlay) realmsModalOverlay.classList.remove('active');
          if (ambientModalOverlay) ambientModalOverlay.classList.remove('active');
          if (wikiModalOverlay) wikiModalOverlay.classList.remove('active');
          if (cultivationStatsModalOverlay) cultivationStatsModalOverlay.classList.remove('active');
          state.activeModal = null;
        }
        return;
      }
      
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        goToPreviousChapter();
      } else if (e.key === 'ArrowRight') {
        goToNextChapter();
      } else if (e.key.toLowerCase() === 'p') {
        speechReader.pauseResume();
      } else if (e.key.toLowerCase() === 't') {
        if (state.isDrawerOpen) closeDrawer();
        else openDrawer();
      } else if (e.key.toLowerCase() === 'b') {
        toggleCurrentBookmark();
      } else if (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        openSearchModal();
      } else if (e.key === 'Escape') {
        if (state.isDrawerOpen) closeDrawer();
        if (realmsModalOverlay) realmsModalOverlay.classList.remove('active');
        if (ambientModalOverlay) ambientModalOverlay.classList.remove('active');
        if (wikiModalOverlay) wikiModalOverlay.classList.remove('active');
        if (cultivationStatsModalOverlay) cultivationStatsModalOverlay.classList.remove('active');
      }
    });
  }

  // --- Entry Point ---
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupEventListeners();
      initApp();
      registerServiceWorker();
    });
  } else {
    setupEventListeners();
    initApp();
    registerServiceWorker();
  }

})();



// ==================== NEW: WEEKLY SCHEDULE & BROADCAST DAY HELPERS ====================
const DAY_LABELS = {
  mon: { short: 'จันทร์', full: 'วันจันทร์', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  tue: { short: 'อังคาร', full: 'วันอังคาร', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  wed: { short: 'พุธ', full: 'วันพุธ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  thu: { short: 'พฤหัส', full: 'วันพฤหัสบดี', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  fri: { short: 'ศุกร์', full: 'วันศุกร์', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  sat: { short: 'เสาร์', full: 'วันเสาร์', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  sun: { short: 'อาทิตย์', full: 'วันอาทิตย์', color: 'bg-rose-50 text-rose-700 border-rose-200' }
};

function getDayBadge(day) {
  if (!day || !DAY_LABELS[day]) return '';
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayDay = dayNames[new Date().getDay()];
  const isToday = day === todayDay;
  const info = DAY_LABELS[day];

  if (isToday) {
    return `<span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500 text-white shadow-xs animate-pulse" title="ตอนใหม่ออกวันนี้!">🔥 ตอนใหม่ออกวันนี้ (${info.short})</span>`;
  }
  return `<span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${info.color} border" title="ออกทุก${info.full}">📅 ทุกวัน${info.short}</span>`;
}

/**
 * TrackToon & Donghua - ระบบติดตามความคืบหน้า อนิเมะ & มังงะ
 * พัฒนาสำหรับ Psai Web Projects
 */

const STORAGE_KEY = 'psai_tracktoon_items_v1';
const THEME_KEY = 'psai_tracktoon_theme';

// ข้อมูลเริ่มต้นทั้งหมด 25 เรื่องตามรายการที่ผู้ใช้ใช้งานประจำ
const DEFAULT_ITEMS = [
  // --- อนิเมะจีนน่าดู (6 เรื่อง) ---
  {
    id: "anime-1",
    broadcastDay: "sat",
    category: "anime",
    title: "ภูตถังซาน 2",
    alias: "หวี่เฮ่า",
    currentEp: 161,
    unit: "ep",
    isFavorite: false,
    status: "watching",
    note: "สำนักถังเลิศภพจบแดน (Soul Land 2)",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "anime-2",
    broadcastDay: "mon",
    category: "anime",
    title: "ฝืนลิขิตฟ้าข้าขอเป็นเซียน",
    alias: "หวังหลิน",
    currentEp: 152,
    unit: "ep",
    isFavorite: true, // ผู้ใช้ใส่เครื่องหมาย * ในข้อความต้นฉบับ
    status: "watching",
    note: "เซียนหนี่ (Xian Ni / Renegade Immortal) ⭐ เรื่องโปรด",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "anime-3",
    broadcastDay: "wed",
    category: "anime",
    title: "มหาศึกล้างพิภพ",
    alias: "หลัวเฟิง",
    currentEp: 211,
    unit: "ep",
    isFavorite: false,
    status: "watching",
    note: "Swallowed Star (แดนจักรวาล)",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "anime-4",
    broadcastDay: "sun",
    category: "anime",
    title: "สัประยุทธ์ทะลุฟ้า",
    alias: "เซียวเหยียน",
    currentEp: 186,
    unit: "ep",
    isFavorite: false,
    status: "watching",
    note: "Battle Through the Heavens (แดนจงโจว)",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "anime-5",
    broadcastDay: "sat",
    category: "anime",
    title: "คัมภีร์วิถีเซียน",
    alias: "หานลี่",
    currentEp: 176,
    unit: "ep",
    isFavorite: false,
    status: "watching",
    note: "A Mortal's Journey (หานเผา)",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: "anime-6",
    broadcastDay: "thu",
    category: "anime",
    title: "ตำนานเทพกู้จักรวาล",
    alias: "ฉินมู่",
    currentEp: 66,
    unit: "ep",
    isFavorite: false,
    status: "watching",
    note: "Tales of Herding Gods (Mu Shen Ji)",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },

  // --- อ่านตูน / มันฮวา / มังงะ (19 เรื่อง) ---
  {
    id: "toon-1",
    broadcastDay: "fri",
    category: "manga",
    title: "Solo Max-Level Newbie",
    alias: "ผู้เล่นหน้าใหม่เลเวลแมกซ์",
    currentEp: 271,
    unit: "ep",
    isFavorite: false,
    status: "watching",
    note: "คังจินฮยอก สายปั่นดันเจี้ยน",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "toon-2",
    broadcastDay: "wed",
    category: "manga",
    title: "Pick Me Up, Infinite Gacha",
    alias: "พิคมีอัป กาชาไร้ขีดจำกัด",
    currentEp: 214,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "ฮันอีสลัท ดันเจี้ยนระดับนรก",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: "toon-3",
    broadcastDay: "thu",
    category: "manga",
    title: "Nano Machine",
    alias: "นาโนมาชิน",
    currentEp: 321,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "ชอนยออุน เทพมารไร้พ่าย",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "toon-4",
    broadcastDay: "tue",
    category: "manga",
    title: "Revenge of the Iron-Blooded Sword Hound",
    alias: "หมาล่าเนื้อตระกูลดาบเหล็ก",
    currentEp: 179,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "วิกกีร์ วาน บาสเกอร์วิลล์",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: "toon-5",
    broadcastDay: "wed",
    category: "manga",
    title: "The Regressed Mercenary’s Machinations",
    alias: "ตำนานราชาแห่งทหารรับจ้าง",
    currentEp: 98,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: "toon-6",
    broadcastDay: "mon",
    category: "manga",
    title: "Regressing as the Reincarnated Bastard of the Sword Clan",
    alias: "ผู้หวนคืนสายเลือดรองแห่งตระกูลดาบ",
    currentEp: 94,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: "toon-7",
    broadcastDay: "wed",
    category: "manga",
    title: "Solo Leveling: Ragnarok",
    alias: "โซโล่เลเวลลิ่ง แร็คนาร็อก",
    currentEp: 68,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "ซองซูโฮ ทายาทจักรพรรดิเงา",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: "toon-8",
    broadcastDay: "wed",
    category: "manga",
    title: "The Regressed Son of a Duke is an Assassin",
    alias: "บุตรดยุกย้อนเวลาเป็นนักฆ่า",
    currentEp: 135,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "ซีออน แฮงค์",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 25).toISOString()
  },
  {
    id: "toon-9",
    broadcastDay: "mon",
    category: "manga",
    title: "Swordmaster’s Youngest Son",
    alias: "ลูกชายคนเล็กของปรมาจารย์ดาบ",
    currentEp: 201,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "จิน รอนคันเดล",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: "toon-10",
    broadcastDay: "sun",
    category: "manga",
    title: "Mercenary Enrollment",
    alias: "พี่ชายบอดี้การ์ด",
    currentEp: 278,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "ยูอีจิน เบอร์ 001",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "toon-11",
    broadcastDay: "fri",
    category: "manga",
    title: "Killer Peter",
    alias: "ปีเตอร์โคตรนักฆ่า",
    currentEp: 12,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "นักฆ่าวัยเก๋าในร่างหนุ่ม",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 50).toISOString()
  },
  {
    id: "toon-12",
    broadcastDay: "tue",
    category: "manga",
    title: "I Became The Rogue First Prince",
    alias: "เทพดาบอย่างข้าดันกลายเป็นองค์ชายสวะซะงั้น",
    currentEp: 48,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 40).toISOString()
  },
  {
    id: "toon-13",
    broadcastDay: "wed",
    category: "manga",
    title: "The Infinite Mage",
    alias: "จอมเวทไร้ขีดจำกัด",
    currentEp: 97,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "ชิโรเนะ สปีดเวทมนตร์",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 32).toISOString()
  },
  {
    id: "toon-14",
    broadcastDay: "thu",
    category: "manga",
    title: "Call of the Spear",
    alias: "call of spear",
    currentEp: 178,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 15).toISOString()
  },
  {
    id: "toon-15",
    broadcastDay: "sun",
    category: "manga",
    title: "The Beginning After the End",
    alias: "จุดเริ่มต้นหลังจุดจบ (TBATE)",
    currentEp: 1,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "อาร์เธอร์ เลย์วิน",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 80).toISOString()
  },
  {
    id: "toon-16",
    broadcastDay: "sat",
    category: "manga",
    title: "Top Tier Providence",
    alias: "แอบฝึกฝนพันปีจนไร้เทียมทาน",
    currentEp: 1,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "หานเจวี๋ย บ่มเพาะแบบเงียบสงบ",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 85).toISOString()
  },
  {
    id: "toon-17",
    broadcastDay: "mon",
    category: "manga",
    title: "The Novel’s Extra",
    alias: "ตัวประกอบนิยาย (The novel extra)",
    currentEp: 0,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "คิมฮาจิน",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 90).toISOString()
  },
  {
    id: "toon-18",
    broadcastDay: "wed",
    category: "manga",
    title: "Steel-Eating Player",
    alias: "ผู้เล่นเขมือบเหล็ก",
    currentEp: 54,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "ลีฮยอนซอก",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 60).toISOString()
  },
  {
    id: "toon-19",
    broadcastDay: "tue",
    category: "manga",
    title: "Regressing With the King’s Power",
    alias: "เกิดใหม่พร้อมพลังแห่งราชัน",
    currentEp: 97,
    unit: "ตอนที่",
    isFavorite: false,
    status: "watching",
    note: "พลัง 7 กษัตริย์ในตำนาน",
    customUrl: "",
    updatedAt: new Date(Date.now() - 3600000 * 22).toISOString()
  }
];

// App State
let appState = {
  items: [],
  categoryFilter: 'all', // 'all' | 'anime' | 'manga'
  statusFilter: 'all',   // 'all' | 'watching' | 'on_hold' | 'completed'
  favoriteOnly: false,
  searchQuery: '',
  sortBy: 'updated',     // 'updated' | 'ep_desc' | 'ep_asc' | 'title' | 'fav_first'
  viewMode: 'table',     // 'table' (ตารางแนวนอนแยกหมวด) | 'grid'
  dayFilter: 'all',    // 'all' | 'today' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  editingItemId: null
};

// Initialize App
function initApp() {
  loadData();
  setupEventListeners();
  applyTheme();
  renderApp();
}

// Load data from LocalStorage
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Populate broadcastDay for existing items if missing
        const defaultMap = {"anime-1":"sat","anime-2":"mon","anime-3":"wed","anime-4":"sun","anime-5":"sat","anime-6":"thu","toon-1":"fri","toon-2":"wed","toon-3":"thu","toon-4":"tue","toon-5":"wed","toon-6":"mon","toon-7":"wed","toon-8":"wed","toon-9":"mon","toon-10":"sun","toon-11":"fri","toon-12":"tue","toon-13":"wed","toon-14":"thu","toon-15":"sun","toon-16":"sat","toon-17":"mon","toon-18":"wed","toon-19":"tue"};
        parsed.forEach(it => {
          if (!it.broadcastDay && defaultMap[it.id]) {
            it.broadcastDay = defaultMap[it.id];
          }
        });
        appState.items = parsed;
        return;
      }
    }
  } catch (e) {
    console.warn('Cannot parse localStorage data, falling back to default:', e);
  }
  appState.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
  saveData();
}

// Save data to LocalStorage
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.items));
  } catch (e) {
    console.error('Save to localStorage failed:', e);
  }
}

// Toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClasses = type === 'success' 
    ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
    : type === 'info' 
      ? 'bg-blue-600 text-white shadow-blue-500/20'
      : 'bg-rose-600 text-white shadow-rose-500/20';

  toast.className = `toast px-4 py-2.5 rounded-xl shadow-lg border border-white/20 text-xs sm:text-sm font-medium flex items-center gap-2 ${bgClasses}`;
  
  const icon = type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠';
  toast.innerHTML = `<span class="font-bold text-sm">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

// Format relative time (ภาษาไทย)
function formatRelativeTime(dateString) {
  if (!dateString) return 'ไม่มีข้อมูล';
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'เมื่อสักครู่';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} นาทีที่แล้ว`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ชม. ที่แล้ว`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)} วันที่แล้ว`;

  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}

// Core Operations
function incrementEp(id, delta) {
  const item = appState.items.find(x => x.id === id);
  if (!item) return;

  const oldEp = item.currentEp || 0;
  const newEp = Math.max(0, oldEp + delta);
  item.currentEp = newEp;
  item.updatedAt = new Date().toISOString();

  saveData();
  renderApp();

  // Pulse animation on target badge
  setTimeout(() => {
    const el = document.getElementById(`ep-badge-${id}`);
    if (el) {
      el.classList.remove('bump-anim');
      void el.offsetWidth; // trigger reflow
      el.classList.add('bump-anim');
    }
  }, 10);

  const sign = delta > 0 ? `+${delta}` : delta;
  showToast(`อัปเดต ${item.title}: ${item.unit} ${newEp} (${sign})`);
}

function promptExactEp(id) {
  const item = appState.items.find(x => x.id === id);
  if (!item) return;

  const input = prompt(`ระบุเลขตอน/EP สำหรับ "${item.title}"`, item.currentEp || 0);
  if (input === null) return;

  const num = parseInt(input.trim(), 10);
  if (!isNaN(num) && num >= 0) {
    item.currentEp = num;
    item.updatedAt = new Date().toISOString();
    saveData();
    renderApp();
    showToast(`แก้ไข ${item.title} เป็น ${item.unit} ${num} เรียบร้อยแล้ว`);
  } else {
    showToast('กรุณาระบุตัวเลขที่ถูกต้อง', 'error');
  }
}

function toggleFavorite(id) {
  const item = appState.items.find(x => x.id === id);
  if (!item) return;
  item.isFavorite = !item.isFavorite;
  saveData();
  renderApp();
  showToast(item.isFavorite ? `เพิ่ม "${item.title}" ในรายการโปรด ⭐` : `นำออกจากรายการโปรด`);
}

function openSearchNext(id) {
  const item = appState.items.find(x => x.id === id);
  if (!item) return;

  const nextEp = (item.currentEp || 0) + 1;
  const query = `${item.title} ${item.unit} ${nextEp}`;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(url, '_blank');
}

function openDirectLink(id) {
  const item = appState.items.find(x => x.id === id);
  if (!item) return;

  if (item.customUrl && item.customUrl.trim().startsWith('http')) {
    window.open(item.customUrl.trim(), '_blank');
  } else {
    openSearchNext(id);
  }
}

// Filter and Sort Items
function getFilteredAndSortedItems() {
  let list = [...appState.items];

  // Category filter
  if (appState.categoryFilter !== 'all') {
    list = list.filter(item => item.category === appState.categoryFilter);
  }

  // Status filter
  if (appState.statusFilter !== 'all') {
    list = list.filter(item => item.status === appState.statusFilter);
  }

  // Favorite filter
  if (appState.favoriteOnly) {
    list = list.filter(item => item.isFavorite);
  }

  // Day filter
  if (appState.dayFilter && appState.dayFilter !== 'all') {
    if (appState.dayFilter === 'today') {
      const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const todayDay = dayNames[new Date().getDay()];
      list = list.filter(item => item.broadcastDay === todayDay);
    } else {
      list = list.filter(item => item.broadcastDay === appState.dayFilter);
    }
  }

  // Search filter
  const query = appState.searchQuery.trim().toLowerCase();
  if (query) {
    list = list.filter(item => {
      const matchTitle = (item.title || '').toLowerCase().includes(query);
      const matchAlias = (item.alias || '').toLowerCase().includes(query);
      const matchNote = (item.note || '').toLowerCase().includes(query);
      const matchEp = String(item.currentEp).includes(query);
      return matchTitle || matchAlias || matchNote || matchEp;
    });
  }

  // Sort
  list.sort((a, b) => {
    // If fav_first
    if (appState.sortBy === 'fav_first') {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    }
    if (appState.sortBy === 'updated') {
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    }
    if (appState.sortBy === 'ep_desc') {
      return (b.currentEp || 0) - (a.currentEp || 0);
    }
    if (appState.sortBy === 'ep_asc') {
      return (a.currentEp || 0) - (b.currentEp || 0);
    }
    if (appState.sortBy === 'title') {
      return a.title.localeCompare(b.title, 'th');
    }
    return 0;
  });

  return list;
}

// Compute Statistics
function updateStats() {
  const total = appState.items.length;
  const animeItems = appState.items.filter(x => x.category === 'anime');
  const mangaItems = appState.items.filter(x => x.category === 'manga');
  const favorites = appState.items.filter(x => x.isFavorite).length;

  const totalAnimeEps = animeItems.reduce((acc, cur) => acc + (cur.currentEp || 0), 0);
  const totalMangaEps = mangaItems.reduce((acc, cur) => acc + (cur.currentEp || 0), 0);

  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayDay = dayNames[new Date().getDay()];
  const todayCount = appState.items.filter(x => x.broadcastDay === todayDay).length;
  const todayBadgeEl = document.getElementById('todayCountBadge');
  if (todayBadgeEl) todayBadgeEl.textContent = todayCount;

  document.getElementById('statTotalCount').innerText = `${total} เรื่อง`;
  document.getElementById('statAnimeCount').innerText = `${animeItems.length} เรื่อง (${totalAnimeEps} ตอน)`;
  document.getElementById('statMangaCount').innerText = `${mangaItems.length} เรื่อง (${totalMangaEps} ตอน)`;
  document.getElementById('statFavCount').innerText = `${favorites} เรื่อง`;

  // Update tabs counters
  document.getElementById('countTabAll').innerText = total;
  document.getElementById('countTabAnime').innerText = animeItems.length;
  document.getElementById('countTabManga').innerText = mangaItems.length;
  document.getElementById('countTabFav').innerText = favorites;
}

// Render Main App
function renderApp() {
  updateStats();
  const list = getFilteredAndSortedItems();
  const container = document.getElementById('itemListContainer');
  const emptyState = document.getElementById('emptyState');

  if (list.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  if (appState.viewMode === 'grid') {
    renderGridView(container, list);
  } else {
    renderCategoryTableView(container, list);
  }
}

// Render Card Grid View
function renderGridView(container, list) {
  container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

  container.innerHTML = list.map(item => {
    const isAnime = item.category === 'anime';
    const catBadge = isAnime
      ? '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">🎬 อนิเมะจีน</span>'
      : '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">📖 มันฮวา / มังงะ</span>';

    const starClass = item.isFavorite
      ? 'text-amber-400 fill-amber-400 scale-110'
      : 'text-slate-300 hover:text-amber-400';

    const statusBadge = item.status === 'on_hold'
      ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">📦 ดองไว้</span>'
      : item.status === 'completed'
        ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">✓ จบแล้ว</span>'
        : '';

    return `
      <div class="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative group ${item.isFavorite ? 'ring-2 ring-amber-300/80 bg-amber-50/20' : ''}">
        
        <!-- Header Info -->
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              ${catBadge}
              ${statusBadge}
              ${getDayBadge(item.broadcastDay)}
            </div>
            
            <div class="flex items-center gap-1">
              <!-- Favorite Button -->
              <button 
                onclick="toggleFavorite('${item.id}')" 
                class="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="${item.isFavorite ? 'นำออกจากรายการโปรด' : 'ปักหมุดเป็นเรื่องโปรด'}"
              >
                <svg class="w-5 h-5 ${starClass} transition-transform" viewBox="0 0 24 24" fill="${item.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>

              <!-- Edit / Menu Button -->
              <button 
                onclick="openEditModal('${item.id}')" 
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                title="แก้ไขข้อมูล"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Title & Alias -->
          <div class="mb-3">
            <h3 class="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-1" title="${item.title}">
              ${item.title}
            </h3>
            ${item.alias ? `
              <p class="text-xs text-blue-600 font-semibold mt-1 line-clamp-1" title="${item.alias}">
                👤 ${item.alias}
              </p>
            ` : ''}
            ${item.note ? `
              <p class="text-xs text-slate-500 mt-1 line-clamp-1 flex items-center gap-1" title="${item.note}">
                <span>💬</span>
                <span>${item.note}</span>
              </p>
            ` : ''}
          </div>
        </div>

        <!-- Episode Counter & Main Actions -->
        <div class="pt-3 border-t border-slate-100">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-slate-500 font-medium">
              ความคืบหน้า:
            </div>
            
            <!-- Clickable Episode Badge -->
            <button 
              id="ep-badge-${item.id}"
              onclick="promptExactEp('${item.id}')"
              class="ep-interactive-badge cursor-pointer"
              title="คลิกเพื่อแก้ไขเลขตอนโดยตรง"
            >
              <span class="text-xs font-normal text-slate-500">${item.unit || 'ep'}</span>
              <span class="text-blue-600 font-extrabold text-base">${item.currentEp || 0}</span>
              <svg class="w-3 h-3 text-slate-400 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          </div>

          <!-- Quick Increment Buttons -->
          <div class="grid grid-cols-4 gap-1.5">
            <button 
              onclick="incrementEp('${item.id}', -1)"
              class="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95"
              title="ลด 1 ตอน"
            >
              -1
            </button>
            
            <button 
              onclick="incrementEp('${item.id}', 1)"
              class="col-span-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition shadow-xs shadow-blue-500/25 flex items-center justify-center gap-1 cursor-pointer active:scale-95"
              title="เพิ่ม 1 ตอน"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+1 ${item.unit || 'ตอน'}</span>
            </button>

            <button 
              onclick="incrementEp('${item.id}', 5)"
              class="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-600 hover:text-blue-700 text-xs font-bold transition border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95"
              title="เพิ่มทีละ 5 ตอน (อ่านรวดเดียว)"
            >
              +5
            </button>
          </div>

          <!-- Footer Links: Next Search & Timestamp -->
          <div class="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            <span class="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <svg class="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${formatRelativeTime(item.updatedAt)}
            </span>

            <button 
              onclick="openSearchNext('${item.id}')"
              class="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold transition cursor-pointer hover:underline"
              title="ค้นหาตอนต่อไปใน Google ทันที"
            >
              <span>หาตอน ${(item.currentEp || 0) + 1}</span>
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');
}

// Render Horizontal Table View Separated by Category
function renderCategoryTableView(container, list) {
  container.className = 'w-full space-y-8';

  let sectionsHtml = '';

  // If favoriteOnly is active, show only 1 table for favorites
  if (appState.favoriteOnly) {
    sectionsHtml += renderSingleCategoryTable({
      title: 'รายการโปรด ⭐ (Favorites)',
      icon: '⭐',
      categoryKey: 'favorite',
      badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200',
      items: list
    });
    container.innerHTML = sectionsHtml;
    return;
  }

  // Filter items by category from the already sorted/filtered list
  const animeItems = list.filter(x => x.category === 'anime');
  const mangaItems = list.filter(x => x.category === 'manga');

  // If filter is 'all' or 'anime', and there are anime items
  if ((appState.categoryFilter === 'all' || appState.categoryFilter === 'anime') && animeItems.length > 0) {
    sectionsHtml += renderSingleCategoryTable({
      title: 'หมวดที่ 1: 🎬 อนิเมะจีนน่าดู (Donghua)',
      icon: '🎬',
      categoryKey: 'anime',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      items: animeItems
    });
  }

  // If filter is 'all' or 'manga', and there are manga items
  if ((appState.categoryFilter === 'all' || appState.categoryFilter === 'manga') && mangaItems.length > 0) {
    sectionsHtml += renderSingleCategoryTable({
      title: 'หมวดที่ 2: 📖 อ่านตูน (มันฮวา / มังงะ / Webtoon)',
      icon: '📖',
      categoryKey: 'manga',
      badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      items: mangaItems
    });
  }

  container.innerHTML = sectionsHtml || `
    <div class="text-center py-12 text-slate-500 text-sm glass-card rounded-2xl border border-slate-200">
      ไม่พบรายการในหมวดหมู่นี้
    </div>
  `;
}

// Render a single category's horizontal table
function renderSingleCategoryTable(config) {
  const { title, icon, categoryKey, badgeClass, items } = config;
  const totalEps = items.reduce((acc, cur) => acc + (cur.currentEp || 0), 0);

  const rowsHtml = items.map((item, index) => {
    const starClass = item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-400';
    return `
      <tr class="${item.isFavorite ? 'is-fav' : ''} border-b border-slate-100 hover:bg-blue-50/50 transition">
        <!-- ลำดับ & ดาว -->
        <td class="text-center py-3 px-3">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="toggleFavorite('${item.id}')" class="p-1 rounded hover:bg-slate-100 transition cursor-pointer" title="${item.isFavorite ? 'นำออกจากรายการโปรด' : 'ปักหมุดเป็นเรื่องโปรด'}">
              <svg class="w-4 h-4 ${starClass} transition-transform" viewBox="0 0 24 24" fill="${item.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
            <span class="font-mono text-xs text-slate-400 font-bold">#${index + 1}</span>
          </div>
        </td>

        <!-- ตัวละคร / ชื่อย่อ -->
        <td class="py-3 px-3.5 whitespace-nowrap">
          ${item.alias ? `
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200/60 max-w-[150px] truncate" title="${item.alias}">
              👤 ${item.alias}
            </span>
          ` : '<span class="text-slate-400 text-xs">-</span>'}
        </td>

        <!-- ชื่อเรื่อง & โน้ต -->
        <td class="py-3 px-3.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors line-clamp-1" title="${item.title}">
              ${item.title}
            </span>
            ${getDayBadge(item.broadcastDay)}
          </div>
          ${item.note ? `
            <div class="text-xs text-slate-500 mt-0.5 line-clamp-1 flex items-center gap-1" title="${item.note}">
              <span class="text-slate-400">💬</span>
              <span>${item.note}</span>
            </div>
          ` : ''}
        </td>

        <!-- ตอนล่าสุด (Interactive Clickable Badge) -->
        <td class="py-3 px-3.5 whitespace-nowrap">
          <button 
            id="ep-badge-${item.id}"
            onclick="promptExactEp('${item.id}')"
            class="ep-interactive-badge cursor-pointer"
            title="คลิกเพื่อพิมพ์แก้ไขเลขตอนโดยตรง"
          >
            <span class="text-slate-500 font-normal text-xs">${item.unit || 'ep'}</span>
            <span class="text-blue-600 font-extrabold text-base">${item.currentEp || 0}</span>
            <span class="text-[11px] text-slate-400">✏️</span>
          </button>
        </td>

        <!-- กดอัปเดตตอน (+1 / +5 / -1) -->
        <td class="py-3 px-3.5 whitespace-nowrap text-center">
          <div class="inline-flex items-center gap-1.5">
            <button 
              onclick="incrementEp('${item.id}', -1)"
              class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition"
              title="ลด 1 ตอน"
            >-1</button>

            <button 
              onclick="incrementEp('${item.id}', 1)"
              class="px-3.5 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
              title="เพิ่ม 1 ตอน"
            >
              <span>+1 ${item.unit || 'ตอน'}</span>
            </button>

            <button 
              onclick="incrementEp('${item.id}', 5)"
              class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-600 font-bold text-xs border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition"
              title="เพิ่ม 5 ตอน"
            >+5</button>
          </div>
        </td>

        <!-- ค้นหาตอนต่อไป -->
        <td class="py-3 px-3.5 whitespace-nowrap text-center">
          <button 
            onclick="openSearchNext('${item.id}')"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-xs font-semibold border border-blue-200 cursor-pointer transition active:scale-95"
            title="เปิด Google ค้นหาตอนถัดไป"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>หาตอน ${(item.currentEp || 0) + 1}</span>
          </button>
        </td>

        <!-- อัปเดตเมื่อ -->
        <td class="py-3 px-3.5 whitespace-nowrap text-center text-xs text-slate-500 font-mono">
          ${formatRelativeTime(item.updatedAt)}
        </td>

        <!-- จัดการ -->
        <td class="py-3 px-3.5 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="openEditModal('${item.id}')" class="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer" title="แก้ไขข้อมูล">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <section class="flex flex-col gap-3">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-base shadow-xs">
            ${icon}
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>${title}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full ${badgeClass} font-mono font-bold">
                ${items.length} เรื่อง • รวม ${totalEps} ตอน
              </span>
            </h2>
          </div>
        </div>

        <!-- Section Action Buttons -->
        <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button 
            onclick="openAddModalWithCategory('${categoryKey}')"
            class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer font-bold active:scale-95 shadow-xs"
            title="เพิ่มเรื่องใหม่ในหมวดนี้"
          >
            <span>➕ เพิ่ม${categoryKey === 'anime' ? 'อนิเมะ' : 'การ์ตูน/มังงะ'}</span>
          </button>

          <button 
            onclick="copySectionText('${categoryKey}')" 
            class="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition cursor-pointer active:scale-95 shadow-2xs"
            title="คัดลอกเฉพาะข้อความในหมวดนี้"
          >
            <svg class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>คัดลอกหมวดนี้</span>
          </button>
        </div>
      </div>

      <!-- Horizontal Table Container -->
      <div class="tracker-table-container shadow-xs">
        <table class="tracker-table">
          <thead>
            <tr>
              <th class="w-16 text-center">ลำดับ/โปรด</th>
              <th class="w-36">ตัวละคร / ชื่อย่อ</th>
              <th>ชื่อเรื่อง</th>
              <th class="w-32">ตอนล่าสุด</th>
              <th class="w-44 text-center">กดอัปเดตตอน</th>
              <th class="w-36 text-center">ค้นหาตอนถัดไป</th>
              <th class="w-28 text-center">อัปเดตเมื่อ</th>
              <th class="w-16 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr class="border-t border-slate-100 bg-slate-50/50">
              <td colspan="8" class="py-2.5 px-4 text-center">
                <button 
                  onclick="openAddModalWithCategory('${categoryKey}')"
                  class="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  <span class="font-bold text-sm">➕</span>
                  <span>คลิกเพื่อเพิ่มเรื่องใหม่ใน ${title}</span>
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  `;
}

// Copy section text
function copySectionText(categoryKey) {
  let list = appState.items;
  if (categoryKey === 'favorite') {
    list = list.filter(x => x.isFavorite);
  } else if (categoryKey !== 'all') {
    list = list.filter(x => x.category === categoryKey);
  }

  let text = '';
  if (categoryKey === 'anime') {
    text = 'อนิเมะจีนน่าดู--\n';
    list.forEach(item => {
      const star = item.isFavorite ? '*' : '';
      const namePart = item.alias ? `${item.alias}/${item.title}` : item.title;
      text += `${star}${namePart} ${item.unit || 'ep'} ${item.currentEp || 0}\n`;
    });
  } else if (categoryKey === 'manga') {
    text = 'อ่านตูน\n';
    list.forEach(item => {
      const star = item.isFavorite ? '*' : '';
      const namePart = item.alias ? `${item.title} ${item.alias}` : item.title;
      text += `${star}${namePart} ${item.unit || 'ตอนที่'} ${item.currentEp || 0}\n`;
    });
  } else {
    text = generateFormattedText();
  }

  navigator.clipboard.writeText(text.trim()).then(() => {
    showToast('คัดลอกข้อความในหมวดนี้ลงคลิปบอร์ดแล้ว! 📋');
  });
}

// Generate Raw Text Format matching user's exact convention
function generateFormattedText() {
  const animeList = appState.items.filter(x => x.category === 'anime');
  const mangaList = appState.items.filter(x => x.category === 'manga');

  let text = 'อนิเมะจีนน่าดู--\n';
  animeList.forEach(item => {
    const star = item.isFavorite ? '*' : '';
    const namePart = item.alias ? `${item.alias}/${item.title}` : item.title;
    const unitPart = item.unit || 'ep';
    text += `${star}${namePart} ${unitPart} ${item.currentEp || 0}\n`;
  });

  text += '\nอ่านตูน\n';
  mangaList.forEach(item => {
    const star = item.isFavorite ? '*' : '';
    const namePart = item.alias ? `${item.title} ${item.alias}` : item.title;
    const unitPart = item.unit || 'ตอนที่';
    text += `${star}${namePart} ${unitPart} ${item.currentEp || 0}\n`;
  });

  return text.trim();
}

// Copy Text to Clipboard
function copyTextSummary() {
  const text = generateFormattedText();
  navigator.clipboard.writeText(text).then(() => {
    showToast('คัดลอกข้อความสรุปทั้งหมดลงคลิปบอร์ดแล้ว! 📋');
  }).catch(err => {
    console.error('Copy failed:', err);
    // Fallback: open modal
    openExportModal();
  });
}

// Open Export / Backup Modal
function openExportModal() {
  const modal = document.getElementById('exportModal');
  const textarea = document.getElementById('exportTextarea');
  textarea.value = generateFormattedText();
  modal.classList.remove('hidden');
}

function closeExportModal() {
  document.getElementById('exportModal').classList.add('hidden');
}

// Copy from Modal
function copyFromExportModal() {
  const textarea = document.getElementById('exportTextarea');
  textarea.select();
  document.execCommand('copy');
  showToast('คัดลอกข้อความแล้ว! 📋');
}

// Download JSON Backup
function downloadJsonBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.items, null, 2));
  const dlAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `tracktoon_backup_${dateStr}.json`);
  dlAnchor.click();
  showToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON เรียบร้อย 💾');
}

// Import JSON Backup
function triggerJsonUpload() {
  document.getElementById('jsonFileInput').click();
}

function handleJsonFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (confirm(`พบข้อมูล ${parsed.length} เรื่อง ต้องการเขียนทับข้อมูลปัจจุบันหรือไม่?`)) {
          appState.items = parsed;
          saveData();
          renderApp();
          showToast(`กู้คืนข้อมูล ${parsed.length} เรื่องเรียบร้อยแล้ว`);
        }
      } else {
        showToast('ไฟล์ JSON ไม่ถูกต้อง', 'error');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// Raw Text Importer
function openImportModal() {
  document.getElementById('importModal').classList.remove('hidden');
  document.getElementById('importTextarea').value = '';
}

function closeImportModal() {
  document.getElementById('importModal').classList.add('hidden');
}

function processRawTextImport() {
  const text = document.getElementById('importTextarea').value.trim();
  if (!text) {
    showToast('กรุณาวางข้อความก่อนกดยืนยัน', 'error');
    return;
  }

  const lines = text.split('\n');
  let currentCategory = 'anime'; // default
  let importedCount = 0;

  lines.forEach(rawLine => {
    const line = rawLine.trim();
    if (!line) return;

    // Detect section headers
    if (line.includes('อนิเมะ')) {
      currentCategory = 'anime';
      return;
    }
    if (line.includes('อ่านตูน') || line.includes('มังงะ') || line.includes('การ์ตูน')) {
      currentCategory = 'manga';
      return;
    }

    // Parse line
    let isFav = line.startsWith('*');
    let cleanLine = isFav ? line.substring(1).trim() : line;

    // Match episode patterns: ep 123, ตอนที่ 123, ตอน 123, หรือตัวเลขท้ายบรรทัด
    let ep = 0;
    let unit = currentCategory === 'anime' ? 'ep' : 'ตอนที่';

    const epMatch = cleanLine.match(/(?:ep\.?|ตอนที่|ตอน)\s*(\d+)/i);
    if (epMatch) {
      ep = parseInt(epMatch[1], 10);
      unit = epMatch[0].toLowerCase().includes('ep') ? 'ep' : 'ตอนที่';
      cleanLine = cleanLine.replace(epMatch[0], '').trim();
    } else {
      // Check trailing number (e.g. Solo leveling regnarok. 68)
      const trailMatch = cleanLine.match(/\s+(\d+)$/);
      if (trailMatch) {
        ep = parseInt(trailMatch[1], 10);
        cleanLine = cleanLine.replace(trailMatch[0], '').trim();
      }
    }

    // Clean remaining trailing dots, commas
    cleanLine = cleanLine.replace(/[.,\s]+$/, '');

    // Parse alias / title if slash exists (e.g. หวี่เฮ่า/ภูตถังซาน2)
    let alias = '';
    let title = cleanLine;
    if (cleanLine.includes('/')) {
      const parts = cleanLine.split('/');
      alias = parts[0].trim();
      title = parts.slice(1).join('/').trim();
    }

    if (!title) return;

    // Check if title already exists in items
    const existing = appState.items.find(x => 
      x.title.toLowerCase() === title.toLowerCase() || 
      (alias && x.alias && x.alias.toLowerCase() === alias.toLowerCase())
    );

    if (existing) {
      existing.currentEp = ep;
      if (isFav) existing.isFavorite = true;
      existing.updatedAt = new Date().toISOString();
    } else {
      appState.items.push({
        id: `${currentCategory}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        category: currentCategory,
        title: title,
        alias: alias,
        currentEp: ep,
        unit: unit,
        isFavorite: isFav,
        status: 'watching',
        note: '',
        customUrl: '',
        updatedAt: new Date().toISOString()
      });
    }
    importedCount++;
  });

  saveData();
  renderApp();
  closeImportModal();
  showToast(`นำเข้า/อัปเดตข้อมูลสำเร็จ ${importedCount} รายการ! 🎉`);
}

// Add / Edit Modal Logic
function openAddModal() {
  appState.editingItemId = null;
  document.getElementById('modalTitle').innerText = '➕ เพิ่มเรื่องใหม่';
  document.getElementById('editForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('editCategory').value = appState.categoryFilter !== 'all' ? appState.categoryFilter : 'anime';
  document.getElementById('editEp').value = '1';
  document.getElementById('editUnit').value = document.getElementById('editCategory').value === 'anime' ? 'ep' : 'ตอนที่';
  document.getElementById('editStatus').value = 'watching';
  document.getElementById('editFavorite').checked = false;
  const broadcastDayEl = document.getElementById('editBroadcastDay');
  if (broadcastDayEl) broadcastDayEl.value = '';
  document.getElementById('deleteBtn').classList.add('hidden');
  document.getElementById('itemModal').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('editTitle').focus();
  }, 100);
}

function openAddModalWithCategory(cat) {
  openAddModal();
  if (cat === 'anime' || cat === 'manga') {
    document.getElementById('editCategory').value = cat;
    document.getElementById('editUnit').value = cat === 'anime' ? 'ep' : 'ตอนที่';
  }
}

// Quick Add Bar Form Submission
function handleQuickAdd(e) {
  e.preventDefault();
  const category = document.getElementById('quickCategory').value;
  const title = document.getElementById('quickTitle').value.trim();
  const alias = document.getElementById('quickAlias').value.trim();
  const ep = parseInt(document.getElementById('quickEp').value, 10) || 0;
  const unit = category === 'anime' ? 'ep' : 'ตอนที่';

  if (!title) {
    showToast('กรุณาระบุชื่อเรื่อง', 'error');
    return;
  }

  const newItem = {
    id: `${category}-${Date.now()}`,
    category,
    title,
    alias,
    currentEp: ep,
    unit,
    status: 'watching',
    isFavorite: false,
    note: '',
    customUrl: '',
    updatedAt: new Date().toISOString()
  };

  appState.items.unshift(newItem);
  saveData();
  renderApp();

  // Reset form inputs except category
  document.getElementById('quickTitle').value = '';
  document.getElementById('quickAlias').value = '';
  document.getElementById('quickEp').value = '1';
  document.getElementById('quickTitle').focus();

  showToast(`เพิ่มเรื่อง "${title}" เรียบร้อยแล้ว! 🎉`);
}

function openEditModal(id) {
  const item = appState.items.find(x => x.id === id);
  if (!item) return;

  appState.editingItemId = id;
  document.getElementById('modalTitle').innerText = '✏️ แก้ไขข้อมูล';
  document.getElementById('editId').value = item.id;
  document.getElementById('editCategory').value = item.category || 'anime';
  document.getElementById('editTitle').value = item.title || '';
  document.getElementById('editAlias').value = item.alias || '';
  document.getElementById('editEp').value = item.currentEp || 0;
  document.getElementById('editUnit').value = item.unit || 'ep';
  document.getElementById('editStatus').value = item.status || 'watching';
  document.getElementById('editFavorite').checked = !!item.isFavorite;
  const broadcastDayEl = document.getElementById('editBroadcastDay');
  if (broadcastDayEl) broadcastDayEl.value = item.broadcastDay || '';
  document.getElementById('editNote').value = item.note || '';
  document.getElementById('editUrl').value = item.customUrl || '';
  document.getElementById('deleteBtn').classList.remove('hidden');
  document.getElementById('itemModal').classList.remove('hidden');
}

function closeItemModal() {
  document.getElementById('itemModal').classList.add('hidden');
}

function handleSaveItem(e) {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const category = document.getElementById('editCategory').value;
  const title = document.getElementById('editTitle').value.trim();
  const alias = document.getElementById('editAlias').value.trim();
  const ep = parseInt(document.getElementById('editEp').value, 10) || 0;
  const unit = document.getElementById('editUnit').value;
  const status = document.getElementById('editStatus').value;
  const isFavorite = document.getElementById('editFavorite').checked;
  const broadcastDay = document.getElementById('editBroadcastDay') ? document.getElementById('editBroadcastDay').value : '';
  const note = document.getElementById('editNote').value.trim();
  const customUrl = document.getElementById('editUrl').value.trim();

  if (!title) {
    showToast('กรุณาระบุชื่อเรื่อง', 'error');
    return;
  }

  if (id) {
    // Edit existing
    const item = appState.items.find(x => x.id === id);
    if (item) {
      item.category = category;
      item.title = title;
      item.alias = alias;
      item.currentEp = ep;
      item.unit = unit;
      item.status = status;
      item.isFavorite = isFavorite;
      item.broadcastDay = broadcastDay;
      item.note = note;
      item.customUrl = customUrl;
      item.updatedAt = new Date().toISOString();
      showToast(`บันทึกการแก้ไข "${title}" เรียบร้อยแล้ว`);
    }
  } else {
    // Add new
    const newItem = {
      id: `${category}-${Date.now()}`,
      category,
      title,
      alias,
      currentEp: ep,
      unit,
      status,
      isFavorite,
      broadcastDay,
      note,
      customUrl,
      updatedAt: new Date().toISOString()
    };
    appState.items.unshift(newItem);
    showToast(`เพิ่มเรื่องใหม่ "${title}" เรียบร้อยแล้ว 🎉`);
  }

  saveData();
  renderApp();
  closeItemModal();
}

function handleDeleteItem() {
  const id = document.getElementById('editId').value;
  if (!id) return;

  const item = appState.items.find(x => x.id === id);
  if (!item) return;

  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${item.title}" ออกจากระบบ?`)) {
    appState.items = appState.items.filter(x => x.id !== id);
    saveData();
    renderApp();
    closeItemModal();
    showToast(`ลบ "${item.title}" เรียบร้อยแล้ว`);
  }
}

function resetToDefaults() {
  if (confirm('คุณต้องการรีเซ็ตข้อมูลกลับเป็น 25 เรื่องตั้งต้นดั้งเดิมใช่หรือไม่? ข้อมูลที่แก้ไขเพิ่มเติมจะถูกแทนที่')) {
    appState.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
    saveData();
    renderApp();
    showToast('รีเซ็ตข้อมูลเป็นชุดเริ่มต้นเรียบร้อยแล้ว');
  }
}

// Theme Manager (✨ Clear Light / 🌙 OLED Deep Slate Dark Mode)
function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'clear';
  const isDark = saved === 'dark';
  document.body.classList.remove('theme-sepia', 'theme-sage', 'theme-mocha');
  if (isDark) {
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-clear');
    document.documentElement.classList.add('dark');
  } else {
    document.body.classList.add('theme-clear');
    document.body.classList.remove('theme-dark');
    document.documentElement.classList.remove('dark');
  }
  updateThemeButton(isDark);
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'clear';
  const newTheme = current === 'dark' ? 'clear' : 'dark';
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme();
  showToast(newTheme === 'dark' ? 'เปลี่ยนเป็น 🌙 โหมดมืด (Dark Mode)' : 'เปลี่ยนเป็น ☀️ โหมดสว่าง (Clear Mode)', 'info');
}

function updateThemeButton(isDark) {
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  if (icon && text) {
    icon.textContent = isDark ? '☀️' : '🌙';
    text.textContent = isDark ? 'โหมดสว่าง' : 'โหมดมืด';
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Day filter listeners
  document.querySelectorAll('.day-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day-filter-btn').forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        b.classList.add('text-slate-600', 'hover:bg-slate-100');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
      btn.classList.remove('text-slate-600', 'hover:bg-slate-100');

      appState.dayFilter = btn.dataset.day;
      renderApp();
    });
  });

  // Category tabs
  document.querySelectorAll('.cat-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-tab-btn').forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        b.classList.add('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
      btn.classList.remove('text-slate-600', 'hover:text-slate-900', 'hover:bg-slate-100');

      const cat = btn.dataset.category;
      if (cat === 'favorite') {
        appState.favoriteOnly = true;
        appState.categoryFilter = 'all';
      } else {
        appState.favoriteOnly = false;
        appState.categoryFilter = cat;
      }
      renderApp();
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) {
        clearBtn.classList.toggle('hidden', !e.target.value);
      }
      renderApp();
    });
  }

  // Clear search
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      appState.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderApp();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      appState.sortBy = e.target.value;
      renderApp();
    });
  }

  // Status filter dropdown
  const statusSelect = document.getElementById('statusFilterSelect');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      appState.statusFilter = e.target.value;
      renderApp();
    });
  }

  // View mode toggle
  const viewTableBtn = document.getElementById('viewTableBtn');
  const viewGridBtn = document.getElementById('viewGridBtn');
  if (viewTableBtn && viewGridBtn) {
    viewTableBtn.addEventListener('click', () => {
      appState.viewMode = 'table';
      viewTableBtn.classList.add('bg-white', 'text-blue-600', 'shadow-xs');
      viewTableBtn.classList.remove('text-slate-500');
      viewGridBtn.classList.remove('bg-white', 'text-blue-600', 'shadow-xs');
      viewGridBtn.classList.add('text-slate-500');
      renderApp();
    });
    viewGridBtn.addEventListener('click', () => {
      appState.viewMode = 'grid';
      viewGridBtn.classList.add('bg-white', 'text-blue-600', 'shadow-xs');
      viewGridBtn.classList.remove('text-slate-500');
      viewTableBtn.classList.remove('bg-white', 'text-blue-600', 'shadow-xs');
      viewTableBtn.classList.add('text-slate-500');
      renderApp();
    });
  }

  // Quick Add Form Submit
  const quickForm = document.getElementById('quickAddForm');
  if (quickForm) {
    quickForm.addEventListener('submit', handleQuickAdd);
  }

  // Quick Category Change updates unit label
  const quickCategory = document.getElementById('quickCategory');
  if (quickCategory) {
    quickCategory.addEventListener('change', (e) => {
      const label = document.getElementById('quickUnitLabel');
      if (label) {
        label.innerText = e.target.value === 'anime' ? 'ep' : 'ตอนที่';
      }
    });
  }

  // Form submit
  const form = document.getElementById('editForm');
  if (form) {
    form.addEventListener('submit', handleSaveItem);
  }

  // Category select inside modal changes unit placeholder
  const editCat = document.getElementById('editCategory');
  if (editCat) {
    editCat.addEventListener('change', (e) => {
      const unit = document.getElementById('editUnit');
      if (e.target.value === 'anime') {
        unit.value = 'ep';
      } else {
        unit.value = 'ตอนที่';
      }
    });
  }

  // Keyboard escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeItemModal();
      closeExportModal();
      closeImportModal();
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', initApp);

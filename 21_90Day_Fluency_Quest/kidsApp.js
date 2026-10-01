/**
 * 90-Day Fluency Quest - Kids Wonderland & Music Studio Logic
 * Handles interactive chord guitar synthesis, song sing-along, 4-skills curriculum & story reader.
 * Clean, soft educational light theme.
 */

class KidsFluencyStudio {
  constructor() {
    this.audioCtx = null;
    this.activeStory = null;
    this.storyPageIndex = 0;
    this.isRecordingSong = false;
    this.songMediaRecorder = null;
    this.songAudioChunks = [];
    this.songAudioUrl = null;

    // Frequencies for guitar chords
    this.chordFrequencies = {
      Am: [110.00, 164.81, 220.00, 261.63, 329.63],      // A2, E3, A3, C4, E4
      C:  [130.81, 164.81, 196.00, 261.63, 329.63],      // C3, E3, G3, C4, E4
      G:  [98.00, 123.47, 146.83, 196.00, 293.66, 392.00], // G2, B2, D3, G3, D4, G4
      F:  [87.31, 130.81, 174.61, 220.00, 261.63, 349.23], // F2, C3, F3, A3, C4, F4
      Em: [82.41, 123.47, 164.81, 196.00, 246.94, 329.63]  // E2, B2, E3, G3, B3, E4
    };

    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio not supported in Kids Studio", e);
    }
  }

  // Realistic Acoustic Guitar Strum Synthesizer
  playChord(chordName) {
    if (!this.audioCtx) this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const cleanChord = chordName.replace(/[^A-Za-z0-9]/g, '');
    const freqs = this.chordFrequencies[cleanChord] || this.chordFrequencies.C;
    const now = this.audioCtx.currentTime;

    // Strum delay between strings (~28ms)
    freqs.forEach((freq, idx) => {
      const stringTime = now + (idx * 0.028);

      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq, stringTime);
      osc2.frequency.setValueAtTime(freq * 2, stringTime); // Octave overtone

      // Pluck attack and natural acoustic exponential decay
      gainNode.gain.setValueAtTime(0.001, stringTime);
      gainNode.gain.exponentialRampToValueAtTime(0.18, stringTime + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.001, stringTime + 1.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(stringTime);
      osc2.start(stringTime);
      osc1.stop(stringTime + 1.5);
      osc2.stop(stringTime + 1.5);
    });

    // Visual feedback on chord button
    const badge = document.getElementById(`chord-btn-${cleanChord}`);
    if (badge) {
      badge.classList.add("scale-105", "ring-2", "ring-blue-400");
      setTimeout(() => {
        badge.classList.remove("scale-105", "ring-2", "ring-blue-400");
      }, 300);
    }
  }

  // Cheerful Kids Text-To-Speech (higher pitch, lively rate)
  speakKids(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88; // Clear comprehension speed
    utterance.pitch = 1.25; // Friendly kids tutor pitch

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Zira") || v.name.includes("Samantha") || v.name.includes("Google US")));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Initialize Kids Studio UI
  initUI() {
    this.renderMonstersSong();
    this.renderCurriculumMonths();
    this.renderStoriesCatalog();
  }

  renderMonstersSong() {
    const song = KIDS_SONG_DATA;
    if (!song) return;
    
    // 1. Render Chord Buttons (Clean & Gentle)
    const chordsBar = document.getElementById("kids-chords-bar");
    if (chordsBar) {
      chordsBar.innerHTML = "";
      song.chords.forEach(c => {
        const btn = document.createElement("button");
        btn.id = `chord-btn-${c.name}`;
        btn.className = `flex flex-col items-center justify-center px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 text-slate-800 font-extrabold shadow-xs hover:shadow-sm transition active:scale-95`;
        btn.innerHTML = `
          <span class="text-lg leading-tight font-bold text-slate-900">${c.name}</span>
          <span class="text-[10px] text-slate-500 font-mono tracking-wider">กดเพื่อดีด 🎸</span>
        `;
        btn.onclick = () => this.playChord(c.name);
        chordsBar.appendChild(btn);
      });
    }

    // 2. Render Lyrics with Interactive Clickable Chords
    const lyricsContainer = document.getElementById("kids-lyrics-container");
    if (lyricsContainer) {
      lyricsContainer.innerHTML = "";

      song.lyricsWithChords.forEach(sec => {
        const secDiv = document.createElement("div");
        secDiv.className = "rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs";
        secDiv.innerHTML = `
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h5 class="text-xs font-bold uppercase tracking-wider text-blue-700">${sec.section}</h5>
            <span class="text-[11px] text-slate-500">แตะที่คอร์ดหรือปุ่มฟังเสียง</span>
          </div>
        `;

        sec.lines.forEach(line => {
          const lineEl = document.createElement("div");
          lineEl.className = "p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition space-y-1.5";
          
          // Make chords clickable inside chordLine
          const formattedChordLine = line.chordLine.replace(/\[([A-Za-z0-9#]+)\]/g, (match, chord) => {
            return `<button class="inline-chord-tag font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition text-xs cursor-pointer active:scale-95" data-chord="${chord}">[${chord}]</button>`;
          });

          lineEl.innerHTML = `
            <div class="font-mono text-xs tracking-wider flex items-center gap-2 flex-wrap">${formattedChordLine}</div>
            <div class="flex items-center justify-between gap-3">
              <p class="text-base sm:text-lg font-bold text-slate-900 tracking-wide leading-snug">${line.lyrics}</p>
              <button class="btn-sing-line shrink-0 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-semibold transition flex items-center gap-1" title="ฟังเสียงร้อง">
                <span>🔊</span> ร้องท่อนนี้
              </button>
            </div>
            <p class="text-xs text-slate-600 italic">${line.translation}</p>
          `;

          // Event listeners for inline chords
          lineEl.querySelectorAll(".inline-chord-tag").forEach(tag => {
            tag.onclick = (e) => {
              e.stopPropagation();
              const chordName = tag.dataset.chord;
              this.playChord(chordName);
            };
          });

          lineEl.querySelector(".btn-sing-line").onclick = () => {
            this.speakKids(line.lyrics);
          };

          secDiv.appendChild(lineEl);
        });

        lyricsContainer.appendChild(secDiv);
      });
    }

    // 3. Render Song Vocab Cards
    const vocabContainer = document.getElementById("kids-song-vocab-list");
    if (vocabContainer) {
      vocabContainer.innerHTML = "";
      song.vocabularyLesson.forEach(item => {
        const card = document.createElement("div");
        card.className = "rounded-xl border border-slate-200 bg-white p-3 space-y-1 text-xs shadow-xs";
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <strong class="text-sm font-bold text-slate-900">${item.word}</strong>
            <button class="btn-speak-vocab text-blue-600 hover:text-blue-800 font-bold p-1">🔊</button>
          </div>
          <p class="text-slate-700">${item.meaning}</p>
          <p class="text-[11px] text-slate-500 italic">"${item.sample}"</p>
        `;
        card.querySelector(".btn-speak-vocab").onclick = () => this.speakKids(item.word);
        vocabContainer.appendChild(card);
      });
    }
  }

  // 4-Skills Curriculum Roadmap (3 Months)
  renderCurriculumMonths() {
    const container = document.getElementById("kids-curriculum-container");
    if (!container) return;
    container.innerHTML = "";

    KIDS_CURRICULUM_MONTHS.forEach(m => {
      const card = document.createElement("div");
      card.className = "rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-4 shadow-xs";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            เดือนที่ ${m.month}
          </span>
          <span class="text-xs text-slate-500">มาตรฐาน US Common Core</span>
        </div>
        <h4 class="text-base sm:text-lg font-bold text-slate-900">${m.theme}</h4>
        
        <!-- 4 Skills Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span class="font-bold text-amber-800 flex items-center gap-1.5">👂 ฟัง (Listening)</span>
            <p class="text-slate-600 text-[11px] leading-relaxed">${m.skillsFocus.listening}</p>
          </div>
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span class="font-bold text-emerald-800 flex items-center gap-1.5">🗣️ พูด (Speaking)</span>
            <p class="text-slate-600 text-[11px] leading-relaxed">${m.skillsFocus.speaking}</p>
          </div>
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span class="font-bold text-blue-800 flex items-center gap-1.5">📖 อ่าน (Reading)</span>
            <p class="text-slate-600 text-[11px] leading-relaxed">${m.skillsFocus.reading}</p>
          </div>
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span class="font-bold text-indigo-800 flex items-center gap-1.5">✍️ เขียน (Writing)</span>
            <p class="text-slate-600 text-[11px] leading-relaxed">${m.skillsFocus.writing}</p>
          </div>
        </div>

        <!-- Weekly Quests Badges -->
        <div class="border-t border-slate-100 pt-3">
          <span class="text-[11px] text-slate-500 font-semibold block mb-2">เควสต์ประจำ 4 สัปดาห์:</span>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            ${m.weeklyQuests.map(w => `
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center text-xs">
                <span class="text-lg block">${w.icon}</span>
                <span class="text-[10px] font-bold text-slate-700 block line-clamp-1 mt-0.5">${w.title}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 1,400+ Stories Catalog Explorer
  renderStoriesCatalog() {
    const grid = document.getElementById("kids-stories-grid");
    if (!grid) return;
    grid.innerHTML = "";

    KIDS_STORIES_CATALOG.forEach(story => {
      const card = document.createElement("div");
      card.className = "rounded-3xl border border-slate-200 bg-white p-5 space-y-3 hover:border-blue-400 hover:shadow-md transition cursor-pointer group shadow-xs";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-3xl">${story.emoji}</span>
          <span class="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            ${story.badge}
          </span>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">${story.title}</h4>
          <p class="text-xs text-slate-500">${story.titleTh}</p>
        </div>
        <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>⏱️ เวลาอ่าน ${story.readTime}</span>
          <span class="text-blue-600 font-bold group-hover:translate-x-1 transition">เปิดอ่าน ➔</span>
        </div>
      `;
      card.onclick = () => this.openStoryReader(story);
      grid.appendChild(card);
    });
  }

  // Story Reader Modal
  openStoryReader(story) {
    this.activeStory = story;
    this.storyPageIndex = 0;
    this.renderStoryPage();
    document.getElementById("kids-story-reader-modal").classList.remove("hidden");
  }

  renderStoryPage() {
    if (!this.activeStory) return;
    const page = this.activeStory.pages[this.storyPageIndex];
    const totalPages = this.activeStory.pages.length;

    document.getElementById("story-modal-title").innerText = this.activeStory.title;
    document.getElementById("story-modal-subtitle").innerText = this.activeStory.titleTh;
    document.getElementById("story-page-counter").innerText = `หน้า ${this.storyPageIndex + 1} จาก ${totalPages}`;
    document.getElementById("story-illustration-emoji").innerText = page.imageEmoji || "📚";
    document.getElementById("story-text-en").innerText = page.text;
    document.getElementById("story-text-th").innerText = page.textTh;

    // Highlight Words Buttons
    const wordsContainer = document.getElementById("story-highlight-words");
    wordsContainer.innerHTML = "";
    if (page.highlightWords) {
      page.highlightWords.forEach(w => {
        const btn = document.createElement("button");
        btn.className = "px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-bold transition flex items-center gap-1 shadow-xs";
        btn.innerHTML = `<span>🔊</span> ${w}`;
        btn.onclick = () => this.speakKids(w);
        wordsContainer.appendChild(btn);
      });
    }

    // Previous / Next buttons
    document.getElementById("btn-story-prev").disabled = this.storyPageIndex === 0;
    const nextBtn = document.getElementById("btn-story-next");
    if (this.storyPageIndex === totalPages - 1) {
      nextBtn.innerText = "จบเรื่องแล้ว! รับรางวัล 🏆";
      nextBtn.className = "px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition";
    } else {
      nextBtn.innerText = "หน้าถัดไป ▶";
      nextBtn.className = "px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition";
    }
  }

  setupKidsEventListeners() {
    // Mode Switcher Buttons (Adult vs Kids)
    const btnAdult = document.getElementById("btn-switch-adult-mode");
    const btnKids = document.getElementById("btn-switch-kids-mode");
    const adultContainer = document.getElementById("adult-mode-container");
    const kidsContainer = document.getElementById("kids-mode-container");

    btnAdult?.addEventListener("click", () => {
      btnAdult.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-blue-700 shadow-xs border border-slate-200/80 transition";
      btnKids.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition";

      adultContainer.classList.remove("hidden");
      kidsContainer.classList.add("hidden");
    });

    btnKids?.addEventListener("click", () => {
      btnKids.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-blue-700 shadow-xs border border-slate-200/80 transition";
      btnAdult.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition";

      adultContainer.classList.add("hidden");
      kidsContainer.classList.remove("hidden");
      this.initUI();
    });

    // Story Reader Controls
    document.getElementById("btn-story-speak-full")?.addEventListener("click", () => {
      if (this.activeStory) {
        const page = this.activeStory.pages[this.storyPageIndex];
        this.speakKids(page.text);
      }
    });

    document.getElementById("btn-story-prev")?.addEventListener("click", () => {
      if (this.storyPageIndex > 0) {
        this.storyPageIndex--;
        this.renderStoryPage();
      }
    });

    document.getElementById("btn-story-next")?.addEventListener("click", () => {
      if (this.storyPageIndex < this.activeStory.pages.length - 1) {
        this.storyPageIndex++;
        this.renderStoryPage();
      } else {
        // Finished story!
        document.getElementById("kids-story-reader-modal").classList.add("hidden");
        if (window.app) {
          window.app.playSfx('fanfare');
          window.app.triggerConfetti();
        }
        alert("🎉 เก่งมากจ้า! อ่านนิทานจบเรื่องแล้ว รับคะแนนความพยายามไปเลย!");
      }
    });

    document.getElementById("btn-close-story-reader")?.addEventListener("click", () => {
      document.getElementById("kids-story-reader-modal").classList.add("hidden");
    });

    // Karaoke Sing-Along Voice Recording
    const karaokeRecBtn = document.getElementById("btn-karaoke-record");
    karaokeRecBtn?.addEventListener("click", async () => {
      if (!this.isRecordingSong) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.songAudioChunks = [];
          this.songMediaRecorder = new MediaRecorder(stream);
          this.songMediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.songAudioChunks.push(e.data);
          };
          this.songMediaRecorder.onstop = () => {
            const blob = new Blob(this.songAudioChunks, { type: 'audio/webm' });
            if (this.songAudioUrl) URL.revokeObjectURL(this.songAudioUrl);
            this.songAudioUrl = URL.createObjectURL(blob);
            const player = document.getElementById("karaoke-user-audio");
            if (player) {
              player.src = this.songAudioUrl;
              player.classList.remove("hidden");
            }
          };
          this.songMediaRecorder.start();
          this.isRecordingSong = true;
          karaokeRecBtn.innerText = "⏹️ กำลังอัดเสียงร้อง (กดเพื่อหยุด)";
          karaokeRecBtn.className = "px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs animate-pulse transition";
        } catch (e) {
          alert("กรุณาอนุญาตการเข้าถึงไมโครโฟนเพื่อบันทึกเสียงร้องเพลง");
        }
      } else {
        if (this.songMediaRecorder) {
          this.songMediaRecorder.stop();
          this.songMediaRecorder.stream.getTracks().forEach(t => t.stop());
        }
        this.isRecordingSong = false;
        karaokeRecBtn.innerText = "🎙️ อัดเสียงร้องคาราโอเกะ";
        karaokeRecBtn.className = "px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition";
      }
    });
  }
}

// Global instance for Kids Studio
let kidsStudio;
window.addEventListener("DOMContentLoaded", () => {
  kidsStudio = new KidsFluencyStudio();
  kidsStudio.setupKidsEventListeners();
  kidsStudio.initUI(); // Pre-render UI so everything is loaded immediately
});

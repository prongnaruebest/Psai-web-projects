/**
 * 90-Day Fluency Quest - Core Application Logic
 * Full client-side interactive game engine with Web Audio, Web Speech, SRS, and Gamification.
 */

// Global Application State
const DEFAULT_STATE = {
  profile: {
    name: "Fluency Seeker",
    targetLanguage: "en-US",
    nativeLanguage: "th-TH",
    avatar: "🚀"
  },
  currentDay: 1,
  activeSelectedDay: 1,
  stats: {
    totalXp: 0,
    streak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    freezeCount: 2,
    completedQuests: {}, // { 'm-1-1': { completedAt: '...', score: 95 } }
    completedDays: [],   // [1, 2, ...]
    unlockedDays: [1]    // วันที่ปลดล็อกแล้ว
  },
  mistakeBank: [
    {
      id: "mistake-seed-1",
      category: "grammar",
      original: "I am agree with you.",
      correction: "I agree with you.",
      explanation: "'Agree' เป็นคำกริยาอยู่แล้ว ไม่ต้องใช้กริยา 'am' ซ้อน",
      mastery: 2,
      lastReviewed: new Date().toISOString()
    },
    {
      id: "mistake-seed-2",
      category: "vocabulary",
      original: "Can I have a hot coffee to go?",
      correction: "Could I please get a hot coffee to go?",
      explanation: "ใช้ 'Could I please get...' จะดูสุภาพและเป็นธรรมชาติกว่าสำหรับวัฒนธรรมสากล",
      mastery: 1,
      lastReviewed: new Date().toISOString()
    }
  ],
  apiSettings: {
    provider: "local", // "local" | "gemini" | "openai"
    apiKey: "",
    modelName: "gemini-1.5-flash"
  }
};

class FluencyQuestApp {
  constructor() {
    this.state = this.loadState();
    this.audioCtx = null;
    this.speechSynthesis = window.speechSynthesis || null;
    this.recognition = null;
    this.isRecognizing = false;
    this.mediaRecorder = null;
    this.recordedAudioChunks = [];
    this.recordedAudioUrl = null;

    // Mission Player Temporary State
    this.activeMission = null;
    this.flashcardIndex = 0;
    this.isCardFlipped = false;
    this.roleplayChatHistory = [];
    this.focusTimerInterval = null;
    this.focusTimerSeconds = 0;

    this.initAudioContext();
    this.initSpeechRecognition();
    this.checkDailyStreak();
  }

  // Local Storage Management
  loadState() {
    try {
      const saved = localStorage.getItem("90_day_fluency_quest_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          stats: { ...DEFAULT_STATE.stats, ...parsed.stats }
        };
      }
    } catch (e) {
      console.warn("Could not load state, using default:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem("90_day_fluency_quest_state", JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }

  // Web Audio Synthesizer (No external sound files required)
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  playSfx(type) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    switch (type) {
      case 'click':
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'correct':
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'flip':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'xp':
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
        break;

      case 'fanfare':
        // Major chord sequence
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const o = this.audioCtx.createOscillator();
          const g = this.audioCtx.createGain();
          o.connect(g);
          g.connect(this.audioCtx.destination);
          o.frequency.setValueAtTime(freq, now + (i * 0.09));
          g.gain.setValueAtTime(0.18, now + (i * 0.09));
          g.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.09) + 0.4);
          o.start(now + (i * 0.09));
          o.stop(now + (i * 0.09) + 0.45);
        });
        break;

      case 'beep':
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
    }
  }

  // Web Speech API: Text-to-Speech
  speakText(text, rate = 1.0) {
    if (!this.speechSynthesis) {
      alert("เบราว์เซอร์ของคุณยังไม่รองรับระบบเสียงสังเคราะห์ Text-to-Speech");
      return;
    }
    this.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = this.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel")));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    this.speechSynthesis.speak(utterance);
  }

  // Web Speech API: Speech-to-Text
  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.lang = "en-US";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  startVoiceRecognition(onResultCallback, onEndCallback) {
    if (!this.recognition) {
      alert("เบราว์เซอร์ของคุณยังไม่รองรับ Speech Recognition (แนะนำให้ใช้ Google Chrome หรือ Microsoft Edge)");
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.recognition.start();
      this.isRecognizing = true;
      this.playSfx('beep');

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResultCallback) onResultCallback(transcript);
      };

      this.recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        if (onEndCallback) onEndCallback();
        this.isRecognizing = false;
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
        if (onEndCallback) onEndCallback();
      };
    } catch (e) {
      console.warn("Error starting speech recognition:", e);
      this.isRecognizing = false;
      if (onEndCallback) onEndCallback();
    }
  }

  stopVoiceRecognition() {
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }

  // Audio Recording (User Shadowing voice recorder)
  async startMicrophoneRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordedAudioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedAudioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedAudioChunks, { type: 'audio/webm' });
        if (this.recordedAudioUrl) {
          URL.revokeObjectURL(this.recordedAudioUrl);
        }
        this.recordedAudioUrl = URL.createObjectURL(audioBlob);
        this.onRecordingReady(this.recordedAudioUrl);
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("กรุณาอนุญาตการเข้าถึงไมโครโฟนเพื่อฝึกบันทึกเสียง Shadowing");
      return false;
    }
  }

  stopMicrophoneRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  onRecordingReady(url) {
    const playerEl = document.getElementById("shadowing-user-audio");
    if (playerEl) {
      playerEl.src = url;
      playerEl.classList.remove("hidden");
    }
    const playbackBtn = document.getElementById("btn-play-user-recording");
    if (playbackBtn) {
      playbackBtn.disabled = false;
      playbackBtn.classList.remove("opacity-50");
    }
  }

  // Streak & Activity Calculations
  checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = this.state.stats.lastActiveDate;

    if (lastActive === today) {
      return; // Already checked today
    }

    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day - streak continues!
    } else if (diffDays === 2) {
      // Missed 1 day! Check if user has streak freeze
      if (this.state.stats.freezeCount > 0) {
        this.state.stats.freezeCount -= 1;
        alert("❄️ คุณขาดฝึกไปเมื่อวาน แต่ระบบใช้ Streak Freeze ปกป้องสถิติต่อเนื่องของคุณให้แล้ว!");
      } else {
        this.state.stats.streak = 1;
      }
    } else {
      // Missed more than 1 day
      this.state.stats.streak = 1;
    }

    this.state.stats.lastActiveDate = today;
    this.saveState();
  }

  calculateLevel(xp) {
    if (xp < 500) return { level: 1, title: "Lvl 1: Novice Pioneer", nextXp: 500, minXp: 0 };
    if (xp < 1500) return { level: 2, title: "Lvl 2: Word Collector", nextXp: 1500, minXp: 500 };
    if (xp < 3000) return { level: 3, title: "Lvl 3: Sentence Builder", nextXp: 3000, minXp: 1500 };
    if (xp < 5000) return { level: 4, title: "Lvl 4: Habit Master", nextXp: 5000, minXp: 3000 };
    if (xp < 7500) return { level: 5, title: "Lvl 5: Conversationalist", nextXp: 7500, minXp: 5000 };
    if (xp < 11000) return { level: 6, title: "Lvl 6: Fluent Explorer", nextXp: 11000, minXp: 7500 };
    return { level: 7, title: "Lvl 7: Fluency Legend", nextXp: 15000, minXp: 11000 };
  }

  // Complete a Mission
  completeMission(missionId, score = 100, earnedXp = 50) {
    this.playSfx('correct');
    
    // Save completion
    this.state.stats.completedQuests[missionId] = {
      completedAt: new Date().toISOString(),
      score: score
    };

    // Add XP
    this.state.stats.totalXp += earnedXp;
    this.playSfx('xp');

    // Check if all 3 missions of current day are completed
    const currentDayData = FULL_CURRICULUM.find(d => d.day === this.state.activeSelectedDay);
    if (currentDayData) {
      const allDone = currentDayData.quests.every(q => !!this.state.stats.completedQuests[q.id]);
      if (allDone && !this.state.stats.completedDays.includes(currentDayData.day)) {
        this.state.stats.completedDays.push(currentDayData.day);
        
        // Advance current unlocked day if this was the frontier
        const nextDay = currentDayData.day + 1;
        if (nextDay <= 90 && !this.state.stats.unlockedDays.includes(nextDay)) {
          this.state.stats.unlockedDays.push(nextDay);
          this.state.currentDay = nextDay;
        }

        // Increase Streak
        this.state.stats.streak += 1;
        if (this.state.stats.streak > this.state.stats.longestStreak) {
          this.state.stats.longestStreak = this.state.stats.streak;
        }

        // Trigger Confetti Celebration!
        this.triggerConfetti();
        this.playSfx('fanfare');
        setTimeout(() => {
          this.showDayCelebrationModal(currentDayData.day);
        }, 600);
      }
    }

    this.saveState();
    this.renderHeader();
    this.renderRoadmap();
    this.renderDailyQuests();
  }

  // Confetti Engine (Canvas based, lightweight & reliable)
  triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove("hidden");

    const ctx = canvas.getContext("2d");
    const pieces = [];
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.3,
        r: Math.random() * 6 + 4,
        d: Math.random() * 120,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: Math.random() * 0.08 + 0.05,
        tiltAngle: 0
      });
    }

    let animationFrame;
    let frames = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frames++;

      pieces.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncrement;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      if (frames < 180) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
      }
    }

    render();
  }

  // Modal: Day Celebration
  showDayCelebrationModal(day) {
    const modal = document.getElementById("day-celebration-modal");
    if (!modal) return;
    document.getElementById("celebration-day-num").innerText = day;
    document.getElementById("celebration-streak-count").innerText = this.state.stats.streak;
    modal.classList.remove("hidden");
  }

  // Focus Timer for Missions
  startFocusTimer(durationMinutes) {
    this.stopFocusTimer();
    this.focusTimerSeconds = durationMinutes * 60;
    this.updateTimerDisplay();

    this.focusTimerInterval = setInterval(() => {
      this.focusTimerSeconds--;
      if (this.focusTimerSeconds <= 0) {
        this.stopFocusTimer();
        this.playSfx('fanfare');
        alert("⏰ เวลาโฟกัสสำหรับภารกิจนี้ครบถ้วนแล้ว! ยอดเยี่ยมมากครับ");
      }
      this.updateTimerDisplay();
    }, 1000);
  }

  stopFocusTimer() {
    if (this.focusTimerInterval) {
      clearInterval(this.focusTimerInterval);
      this.focusTimerInterval = null;
    }
  }

  updateTimerDisplay() {
    const el = document.getElementById("mission-focus-timer");
    if (!el) return;
    const mins = Math.floor(this.focusTimerSeconds / 60);
    const secs = this.focusTimerSeconds % 60;
    el.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Intelligent Local AI Evaluator (Fallback when no API Key is given)
  evaluateRoleplayTurn(userMessage, scenarioChecklist) {
    const text = userMessage.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    let score = 75;
    let praise = "ตอบโต้ได้ดีมากและสื่อความหมายได้ชัดเจนครับ!";
    const corrections = [];

    // Simple common grammar heuristic detection
    if (/i am agree/i.test(text)) {
      corrections.push({
        original: "I am agree",
        better: "I agree",
        reason: "'Agree' เป็นคำกริยาอยู่แล้ว ไม่ต้องใส่ verb to be ซ้อนข้างหน้า"
      });
      score -= 10;
    }

    if (/i have \d+ years/i.test(text)) {
      corrections.push({
        original: "I have ... years",
        better: "I am ... years old",
        reason: "การบอกอายุในภาษาอังกฤษใช้ 'I am ... years old'"
      });
      score -= 10;
    }

    if (/costed/i.test(text)) {
      corrections.push({
        original: "costed",
        better: "cost",
        reason: "กริยารูปอดีตของ 'cost' ยังคงรูปเดิมคือ 'cost'"
      });
      score -= 10;
    }

    if (wordCount < 4) {
      praise = "ลองตอบเป็นประโยคยาวขึ้นอีกนิด เพื่อฝึกความมั่นใจและความเป็นธรรมชาตินะครับ!";
      score = Math.max(score - 15, 60);
    } else if (wordCount >= 10) {
      praise = "ประโยคมีความยาวและรายละเอียดที่ยอดเยี่ยมมาก! การเรียบเรียงเป็นธรรมชาติ";
      score = Math.min(score + 15, 98);
    }

    // Add mistake to Mistake Bank if any detected
    corrections.forEach(corr => {
      this.addMistakeToBank("grammar", corr.original, corr.better, corr.reason);
    });

    return {
      score: Math.max(60, score),
      praise: praise,
      corrections: corrections
    };
  }

  addMistakeToBank(category, original, correction, explanation) {
    // Avoid duplicate
    const exists = this.state.mistakeBank.find(m => m.original.toLowerCase() === original.toLowerCase());
    if (exists) return;

    this.state.mistakeBank.unshift({
      id: "mistake-" + Date.now(),
      category: category,
      original: original,
      correction: correction,
      explanation: explanation,
      mastery: 0,
      lastReviewed: new Date().toISOString()
    });
    this.saveState();
    this.renderMistakeBankWidget();
  }

  // Render Functions
  renderHeader() {
    const stats = this.state.stats;
    const lvl = this.calculateLevel(stats.totalXp);

    document.getElementById("header-day-badge").innerText = `Day ${this.state.currentDay} of 90`;
    document.getElementById("header-level-title").innerText = lvl.title;
    document.getElementById("header-streak-badge").innerText = `${stats.streak} วัน`;
    document.getElementById("header-xp-badge").innerText = `${stats.totalXp} XP`;
    document.getElementById("header-freeze-badge").innerText = `${stats.freezeCount} Freeze`;

    // Progress to next level
    const progressPercent = Math.min(100, Math.round(((stats.totalXp - lvl.minXp) / (lvl.nextXp - lvl.minXp)) * 100));
    const lvlProgressBar = document.getElementById("header-level-progress");
    if (lvlProgressBar) {
      lvlProgressBar.style.width = `${progressPercent}%`;
    }
  }

  renderRoadmap() {
    const container = document.getElementById("roadmap-nodes-container");
    if (!container) return;
    container.innerHTML = "";

    const activeFilter = document.querySelector(".roadmap-filter-btn.active")?.dataset?.phase || "all";

    FULL_CURRICULUM.forEach((dayData) => {
      if (activeFilter !== "all" && dayData.phase.toString() !== activeFilter) {
        return;
      }

      const isCompleted = this.state.stats.completedDays.includes(dayData.day);
      const isUnlocked = this.state.stats.unlockedDays.includes(dayData.day);
      const isCurrentSelected = dayData.day === this.state.activeSelectedDay;
      const isBoss = dayData.day % 7 === 0 || dayData.day === 30 || dayData.day === 60 || dayData.day === 90;

      const node = document.createElement("button");
      node.className = `flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-left relative overflow-hidden group ${
        isCurrentSelected
          ? "border-blue-500 bg-blue-50/80 ring-2 ring-blue-400 shadow-xs"
          : isCompleted
          ? "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300"
          : isUnlocked
          ? "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs"
          : "border-slate-200/50 bg-slate-100/50 opacity-40 cursor-not-allowed"
      }`;

      node.onclick = () => {
        if (!isUnlocked) {
          this.playSfx('beep');
          alert(`วันที่ ${dayData.day} ยังถูกล็อกอยู่ กรุณาเคลียร์ภารกิจวันก่อนหน้าก่อนนะครับ!`);
          return;
        }
        this.playSfx('click');
        this.state.activeSelectedDay = dayData.day;
        this.renderRoadmap();
        this.renderDailyQuests();
      };

      node.innerHTML = `
        <div class="flex items-center justify-between w-full mb-1.5">
          <span class="text-[11px] font-bold ${isCurrentSelected ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-600'}">
            Day ${dayData.day}
          </span>
          ${isCompleted ? '<span class="text-emerald-600 text-xs">✓</span>' : !isUnlocked ? '<span class="text-slate-400 text-xs">🔒</span>' : isBoss ? '<span class="text-amber-600 text-xs">⚔️</span>' : ''}
        </div>
        <p class="text-xs font-semibold text-slate-800 line-clamp-1 w-full">${dayData.theme}</p>
        <span class="text-[10px] text-slate-500 mt-1">Phase ${dayData.phase}</span>
      `;

      container.appendChild(node);
    });
  }

  renderDailyQuests() {
    const dayData = FULL_CURRICULUM.find(d => d.day === this.state.activeSelectedDay) || FULL_CURRICULUM[0];
    const container = document.getElementById("daily-quests-list");
    if (!container) return;

    // Update header info for selected day
    document.getElementById("selected-day-title").innerText = `Day ${dayData.day}: ${dayData.theme}`;
    document.getElementById("selected-day-subtitle").innerText = dayData.themeTh;
    document.getElementById("selected-day-phase").innerText = `Phase ${dayData.phase}`;

    const completedInDay = dayData.quests.filter(q => !!this.state.stats.completedQuests[q.id]).length;
    const dayProgress = Math.round((completedInDay / dayData.quests.length) * 100);
    document.getElementById("selected-day-progress-bar").style.width = `${dayProgress}%`;
    document.getElementById("selected-day-progress-text").innerText = `${completedInDay}/3 สำเร็จ (${dayProgress}%)`;

    container.innerHTML = "";

    const typeIcons = {
      vocab_sprint: "📖",
      shadowing_lab: "🎧",
      ai_roleplay: "🤖"
    };

    const typeThemes = {
      vocab_sprint: { label: "Vocab Sprint", color: "amber", border: "border-amber-200", bg: "bg-amber-50 text-amber-800" },
      shadowing_lab: { label: "Shadowing Lab", color: "indigo", border: "border-indigo-200", bg: "bg-indigo-50 text-indigo-800" },
      ai_roleplay: { label: "AI Roleplay", color: "emerald", border: "border-emerald-200", bg: "bg-emerald-50 text-emerald-800" }
    };

    dayData.quests.forEach((quest, index) => {
      const isDone = !!this.state.stats.completedQuests[quest.id];
      // Locked if previous quest is not done
      const isLocked = index > 0 && !this.state.stats.completedQuests[dayData.quests[index - 1].id];
      const cfg = typeThemes[quest.type] || typeThemes.vocab_sprint;

      const card = document.createElement("div");
      card.className = `rounded-2xl border p-5 transition-all relative overflow-hidden ${
        isDone
          ? "border-emerald-200 bg-emerald-50/40 shadow-xs"
          : isLocked
          ? "border-slate-200 bg-slate-50/60 opacity-60 cursor-not-allowed"
          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs shadow-xs"
      }`;

      card.innerHTML = `
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-xl text-slate-700 shadow-xs">
              ${typeIcons[quest.type]}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700 bg-slate-50">
                  Quest ${quest.orderIndex} • ${cfg.label}
                </span>
                <span class="text-xs text-slate-500 flex items-center gap-1">
                  ⏱️ ${quest.durationMinutes} นาที
                </span>
              </div>
              <h3 class="font-bold text-slate-900 text-base md:text-lg leading-snug">
                ${quest.title}
              </h3>
              <p class="text-xs text-slate-600 mt-1">${quest.titleTh}</p>
            </div>
          </div>
          <div class="shrink-0 flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 border border-blue-200">
            ⚡ +${quest.xpReward} XP
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
          <div class="text-xs font-medium">
            ${isDone ? '<span class="text-emerald-700 flex items-center gap-1.5">✓ ภารกิจสำเร็จแล้ว</span>' : isLocked ? '<span class="text-slate-400">🔒 ปลดล็อกเมื่อทำภารกิจก่อนหน้า</span>' : '<span class="text-blue-700">พร้อมเริ่มฝึกฝน</span>'}
          </div>
          <button class="quest-action-btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            isDone
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : isLocked
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95"
          }">
            ${isDone ? "ทบทวนอีกครั้ง" : isLocked ? "ล็อกอยู่" : "เริ่มภารกิจ ▶"}
          </button>
        </div>
      `;

      const btn = card.querySelector(".quest-action-btn");
      btn.onclick = () => {
        if (!isLocked) {
          this.openMissionPlayer(quest);
        }
      };

      container.appendChild(card);
    });
  }

  renderMistakeBankWidget() {
    const listEl = document.getElementById("mistake-bank-preview-list");
    const countEl = document.getElementById("mistake-bank-badge-count");
    if (!listEl) return;

    countEl.innerText = `${this.state.mistakeBank.length} รายการ`;
    listEl.innerHTML = "";

    if (this.state.mistakeBank.length === 0) {
      listEl.innerHTML = `<p class="text-xs text-slate-500 italic">ยอดเยี่ยมมาก! ยังไม่มีรายการผิดพลาดที่ค้างอยู่</p>`;
      return;
    }

    // Show top 3 recent mistakes
    this.state.mistakeBank.slice(0, 3).forEach((item) => {
      const el = document.createElement("div");
      el.className = "rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs space-y-1";
      el.innerHTML = `
        <div class="flex items-center justify-between text-[11px] text-slate-500">
          <span class="capitalize text-amber-800 font-semibold">${item.category}</span>
          <span>ความชำนาญ: ${"⭐".repeat(Math.max(1, item.mastery))}</span>
        </div>
        <p class="text-rose-600 line-through">"${item.original}"</p>
        <p class="text-emerald-700 font-medium">➔ "${item.correction}"</p>
      `;
      listEl.appendChild(el);
    });
  }

  // Open Mission Player Focus Modal
  openMissionPlayer(quest) {
    this.playSfx('click');
    this.activeMission = quest;
    this.startFocusTimer(quest.durationMinutes);

    const modal = document.getElementById("mission-player-modal");
    document.getElementById("player-modal-title").innerText = quest.title;
    document.getElementById("player-modal-subtitle").innerText = quest.titleTh;
    document.getElementById("player-modal-xp").innerText = `+${quest.xpReward} XP`;

    // Hide all quest views
    document.getElementById("view-vocab-sprint").classList.add("hidden");
    document.getElementById("view-shadowing-lab").classList.add("hidden");
    document.getElementById("view-ai-roleplay").classList.add("hidden");

    if (quest.type === "vocab_sprint") {
      this.initVocabSprintView(quest.content.items);
    } else if (quest.type === "shadowing_lab") {
      this.initShadowingLabView(quest.content);
    } else if (quest.type === "ai_roleplay") {
      this.initAIRoleplayView(quest.content);
    }

    modal.classList.remove("hidden");
  }

  closeMissionPlayer() {
    this.stopFocusTimer();
    this.stopMicrophoneRecording();
    this.stopVoiceRecognition();
    if (this.speechSynthesis) this.speechSynthesis.cancel();
    document.getElementById("mission-player-modal").classList.add("hidden");
  }

  // View 1: Vocab Sprint
  initVocabSprintView(items) {
    const view = document.getElementById("view-vocab-sprint");
    view.classList.remove("hidden");
    this.flashcardIndex = 0;
    this.isCardFlipped = false;
    this.renderFlashcard(items);
  }

  renderFlashcard(items) {
    const item = items[this.flashcardIndex];
    document.getElementById("flashcard-counter").innerText = `คำที่ ${this.flashcardIndex + 1} จาก ${items.length}`;
    document.getElementById("card-term").innerText = item.term;
    document.getElementById("card-ipa").innerText = item.ipa || "";
    document.getElementById("card-meaning").innerText = item.meaning;
    document.getElementById("card-example").innerText = `"${item.example}"`;

    const cardInner = document.getElementById("flashcard-inner");
    if (this.isCardFlipped) {
      cardInner.classList.add("flipped");
    } else {
      cardInner.classList.remove("flipped");
    }

    // Previous & Next button states
    document.getElementById("btn-prev-card").disabled = this.flashcardIndex === 0;
    const nextBtn = document.getElementById("btn-next-card");
    if (this.flashcardIndex === items.length - 1) {
      nextBtn.innerText = "สำเร็จภารกิจท่องศัพท์ ✓";
      nextBtn.className = "px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition";
    } else {
      nextBtn.innerText = "คำถัดไป ▶";
      nextBtn.className = "px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition";
    }
  }

  // View 2: Shadowing Lab
  initShadowingLabView(content) {
    const view = document.getElementById("view-shadowing-lab");
    view.classList.remove("hidden");

    document.getElementById("shadowing-script-en").innerText = content.script;
    document.getElementById("shadowing-script-th").innerText = content.translation;
    document.getElementById("shadowing-key-focus").innerText = `💡 เทคนิคออกเสียง: ${content.keyFocus}`;

    // Reset recording UI
    const audioEl = document.getElementById("shadowing-user-audio");
    audioEl.src = "";
    audioEl.classList.add("hidden");
    document.getElementById("btn-record-voice").innerText = "🎙️ บันทึกเสียงพูดตาม";
    document.getElementById("btn-record-voice").className = "px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition";
    document.getElementById("btn-play-user-recording").disabled = true;
    document.getElementById("btn-play-user-recording").classList.add("opacity-50");
  }

  // View 3: AI Roleplay Sandbox
  initAIRoleplayView(content) {
    const view = document.getElementById("view-ai-roleplay");
    view.classList.remove("hidden");

    document.getElementById("roleplay-scenario-text").innerText = content.scenario;
    document.getElementById("roleplay-persona-badge").innerText = content.aiPersona;

    const checklistContainer = document.getElementById("roleplay-checklist");
    checklistContainer.innerHTML = "";
    content.checklist.forEach((item) => {
      const li = document.createElement("li");
      li.className = "text-xs text-slate-300 flex items-center gap-2";
      li.innerHTML = `<span class="text-blue-400">🔘</span> ${item}`;
      checklistContainer.appendChild(li);
    });

    // Start fresh chat
    this.roleplayChatHistory = [
      {
        role: "assistant",
        text: content.starterMessage,
        translation: content.starterTranslation
      }
    ];

    this.renderRoleplayChat();
    // Auto speak first greeting
    setTimeout(() => {
      this.speakText(content.starterMessage, 1.0);
    }, 500);
  }

  renderRoleplayChat() {
    const container = document.getElementById("roleplay-messages-container");
    if (!container) return;
    container.innerHTML = "";

    this.roleplayChatHistory.forEach((msg) => {
      const isAI = msg.role === "assistant";
      const bubble = document.createElement("div");
      bubble.className = `flex ${isAI ? 'justify-start' : 'justify-end'} mb-3`;

      bubble.innerHTML = `
        <div class="max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
          isAI 
            ? 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-sm' 
            : 'bg-blue-600 text-white rounded-tr-sm shadow-xs'
        }">
          <div class="flex items-center justify-between gap-3 mb-1">
            <span class="text-[11px] font-bold ${isAI ? 'text-blue-700' : 'text-blue-100'}">
              ${isAI ? 'AI Partner' : 'You (Learner)'}
            </span>
            ${isAI ? `<button class="btn-listen-msg text-xs text-slate-400 hover:text-slate-700" title="ฟังเสียง">🔊</button>` : ''}
          </div>
          <p class="font-normal leading-relaxed">${msg.text}</p>
          ${msg.translation ? `<p class="text-[11px] text-slate-500 mt-1 border-t border-slate-100 pt-1">${msg.translation}</p>` : ''}
          ${msg.feedback ? `
            <div class="mt-2.5 rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
              <span class="font-bold text-emerald-700">คะแนนความคล่อง: ${msg.feedback.score}%</span>
              <p class="text-slate-600 mt-1">${msg.feedback.praise}</p>
              ${msg.feedback.corrections.map(c => `
                <div class="mt-1.5 text-[11px]">
                  <span class="line-through text-rose-600">"${c.original}"</span> ➔ <strong class="text-emerald-700">"${c.better}"</strong>
                  <p class="text-slate-500 text-[10px]">${c.reason}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;

      if (isAI) {
        bubble.querySelector(".btn-listen-msg").onclick = () => {
          this.speakText(msg.text, 1.0);
        };
      }

      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }

  // Handle User Sending a Message in Roleplay
  async sendUserRoleplayMessage() {
    const inputEl = document.getElementById("roleplay-text-input");
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = "";
    this.playSfx('click');

    // 1. Add user message
    this.roleplayChatHistory.push({
      role: "user",
      text: text
    });
    this.renderRoleplayChat();

    // 2. Evaluate User Input
    const evaluation = this.evaluateRoleplayTurn(text, this.activeMission.content.checklist);

    // 3. Generate AI response (Check if custom API key is present or use smart simulated response)
    const isCloudAPI = this.state.apiSettings.provider !== "local" && this.state.apiSettings.apiKey;

    let aiReplyText = "";
    if (isCloudAPI) {
      aiReplyText = await this.callCloudAIRoleplay(text);
    } else {
      aiReplyText = this.generateSimulatedAIReply(text, this.activeMission.content);
    }

    // 4. Add AI response with feedback
    this.roleplayChatHistory.push({
      role: "assistant",
      text: aiReplyText,
      feedback: evaluation
    });

    this.renderRoleplayChat();
    this.speakText(aiReplyText, 1.0);

    // If chat length is enough, allow completing mission
    if (this.roleplayChatHistory.length >= 5) {
      document.getElementById("btn-complete-roleplay").classList.remove("hidden");
    }
  }

  generateSimulatedAIReply(userText, content) {
    const replies = [
      "That is wonderful! Could you tell me a little bit more about why you feel that way?",
      "I see exactly what you mean. In that case, how would you handle it if the situation changed suddenly?",
      "That sounds like a very solid plan! I appreciate how clearly you explained your point.",
      "Got it! That makes complete sense. Thank you for sharing your thoughts with me.",
      "Fascinating perspective! It really shows how much your speaking confidence is improving."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  async callCloudAIRoleplay(userMessage) {
    try {
      if (this.state.apiSettings.provider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.state.apiSettings.modelName}:generateContent?key=${this.state.apiSettings.apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are roleplaying in an English learning app. Persona: ${this.activeMission.content.aiPersona}. Scenario: ${this.activeMission.content.scenario}. The user just said: "${userMessage}". Reply in 1-2 natural, engaging English sentences to keep the conversation going.`
                  }
                ]
              }
            ]
          })
        });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.warn("Cloud AI call failed, falling back to simulated reply:", e);
    }
    return this.generateSimulatedAIReply(userMessage, this.activeMission.content);
  }
}

// Global instance
let app;
window.addEventListener("DOMContentLoaded", () => {
  app = new FluencyQuestApp();
  window.app = app;
  app.renderHeader();
  app.renderRoadmap();
  app.renderDailyQuests();
  app.renderMistakeBankWidget();
  setupEventListeners();
});

// UI Event Handlers
function setupEventListeners() {
  setupTopNavBar();

  // Roadmap Phase Filter Buttons
  document.querySelectorAll(".roadmap-filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".roadmap-filter-btn").forEach(b => b.classList.remove("active", "bg-blue-600", "text-white"));
      btn.classList.add("active", "bg-blue-600", "text-white");
      app.playSfx('click');
      app.renderRoadmap();
    });
  });

  // Modal Close Buttons
  document.getElementById("btn-close-player")?.addEventListener("click", () => {
    app.closeMissionPlayer();
  });

  document.getElementById("btn-close-celebration")?.addEventListener("click", () => {
    document.getElementById("day-celebration-modal").classList.add("hidden");
  });

  // Flashcard Controls
  const flashcardEl = document.getElementById("flashcard-3d");
  flashcardEl?.addEventListener("click", () => {
    app.isCardFlipped = !app.isCardFlipped;
    app.playSfx('flip');
    const inner = document.getElementById("flashcard-inner");
    if (app.isCardFlipped) {
      inner.classList.add("flipped");
    } else {
      inner.classList.remove("flipped");
    }
  });

  document.getElementById("btn-speak-term")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const term = document.getElementById("card-term").innerText;
    app.speakText(term, 0.9);
  });

  document.getElementById("btn-prev-card")?.addEventListener("click", () => {
    if (app.flashcardIndex > 0) {
      app.flashcardIndex--;
      app.isCardFlipped = false;
      app.playSfx('click');
      app.renderFlashcard(app.activeMission.content.items);
    }
  });

  document.getElementById("btn-next-card")?.addEventListener("click", () => {
    const items = app.activeMission.content.items;
    if (app.flashcardIndex < items.length - 1) {
      app.flashcardIndex++;
      app.isCardFlipped = false;
      app.playSfx('click');
      app.renderFlashcard(items);
    } else {
      // Completed Vocab Sprint!
      app.completeMission(app.activeMission.id, 100, app.activeMission.xpReward);
      app.closeMissionPlayer();
      alert("🎉 ยินดีด้วยครับ! คุณพิชิตภารกิจ Vocab Sprint เรียบร้อยแล้ว รับ +" + app.activeMission.xpReward + " XP");
    }
  });

  // Shadowing Controls
  document.getElementById("btn-play-native-slow")?.addEventListener("click", () => {
    const text = document.getElementById("shadowing-script-en").innerText;
    app.speakText(text, 0.75);
  });

  document.getElementById("btn-play-native-normal")?.addEventListener("click", () => {
    const text = document.getElementById("shadowing-script-en").innerText;
    app.speakText(text, 1.0);
  });

  const recordBtn = document.getElementById("btn-record-voice");
  let isRecording = false;
  recordBtn?.addEventListener("click", async () => {
    if (!isRecording) {
      const ok = await app.startMicrophoneRecording();
      if (ok) {
        isRecording = true;
        recordBtn.innerText = "⏹️ กำลังอัดเสียง (กดเพื่อหยุด)";
        recordBtn.className = "px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs animate-pulse transition";
      }
    } else {
      app.stopMicrophoneRecording();
      isRecording = false;
      recordBtn.innerText = "🎙️ บันทึกเสียงพูดตามอีกรอบ";
      recordBtn.className = "px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition";
    }
  });

  document.getElementById("btn-play-user-recording")?.addEventListener("click", () => {
    const audioEl = document.getElementById("shadowing-user-audio");
    if (audioEl && audioEl.src) {
      audioEl.play();
    }
  });

  document.getElementById("btn-complete-shadowing")?.addEventListener("click", () => {
    app.completeMission(app.activeMission.id, 95, app.activeMission.xpReward);
    app.closeMissionPlayer();
    alert("🎉 ยินดีด้วยครับ! คุณพิชิตภารกิจ Shadowing Lab เรียบร้อยแล้ว รับ +" + app.activeMission.xpReward + " XP");
  });

  // Roleplay Controls
  document.getElementById("btn-send-roleplay")?.addEventListener("click", () => {
    app.sendUserRoleplayMessage();
  });

  document.getElementById("roleplay-text-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      app.sendUserRoleplayMessage();
    }
  });

  const micBtn = document.getElementById("btn-mic-roleplay");
  micBtn?.addEventListener("click", () => {
    if (!app.isRecognizing) {
      micBtn.innerText = "🔴 กำลังฟัง...";
      micBtn.classList.add("bg-rose-600", "animate-pulse");
      app.startVoiceRecognition(
        (transcript) => {
          document.getElementById("roleplay-text-input").value = transcript;
          app.sendUserRoleplayMessage();
        },
        () => {
          micBtn.innerText = "🎙️ พูด";
          micBtn.classList.remove("bg-rose-600", "animate-pulse");
        }
      );
    } else {
      app.stopVoiceRecognition();
      micBtn.innerText = "🎙️ พูด";
      micBtn.classList.remove("bg-rose-600", "animate-pulse");
    }
  });

  document.getElementById("btn-complete-roleplay")?.addEventListener("click", () => {
    app.completeMission(app.activeMission.id, 92, app.activeMission.xpReward);
    app.closeMissionPlayer();
    alert("🎉 ยอดเยี่ยมมาก! คุณพิชิตการสนทนากับ AI สำเร็จ รับ +" + app.activeMission.xpReward + " XP");
  });

  // Settings & Mistake Bank Modals
  document.getElementById("btn-open-settings")?.addEventListener("click", () => {
    document.getElementById("api-key-input").value = app.state.apiSettings.apiKey || "";
    document.getElementById("api-provider-select").value = app.state.apiSettings.provider || "local";
    document.getElementById("settings-modal").classList.remove("hidden");
  });

  document.getElementById("btn-save-settings")?.addEventListener("click", () => {
    app.state.apiSettings.apiKey = document.getElementById("api-key-input").value.trim();
    app.state.apiSettings.provider = document.getElementById("api-provider-select").value;
    app.saveState();
    document.getElementById("settings-modal").classList.add("hidden");
    alert("บันทึกการตั้งค่า AI เรียบร้อยแล้ว!");
  });

  document.getElementById("btn-close-settings")?.addEventListener("click", () => {
    document.getElementById("settings-modal").classList.add("hidden");
  });

  document.getElementById("btn-open-mistake-bank")?.addEventListener("click", () => {
    renderMistakeBankModalFull();
    document.getElementById("mistake-bank-modal").classList.remove("hidden");
  });

  document.getElementById("btn-close-mistake-modal")?.addEventListener("click", () => {
    document.getElementById("mistake-bank-modal").classList.add("hidden");
  });
}

function renderMistakeBankModalFull() {
  const container = document.getElementById("full-mistake-list");
  if (!container) return;
  container.innerHTML = "";

  if (app.state.mistakeBank.length === 0) {
    container.innerHTML = `<p class="text-sm text-slate-400 py-8 text-center">ไม่มีข้อผิดพลาดที่ค้างอยู่ คุณทำได้ยอดเยี่ยมมาก!</p>`;
    return;
  }

  app.state.mistakeBank.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs";
    el.innerHTML = `
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-amber-800 uppercase tracking-wider">${item.category}</span>
        <div class="flex items-center gap-1 text-slate-500">
          <span>ระดับความจำ:</span>
          <span class="text-amber-500">${"★".repeat(Math.max(1, item.mastery))}</span>
        </div>
      </div>
      <div class="space-y-1 text-sm">
        <p class="text-rose-600 line-through">❌ "${item.original}"</p>
        <p class="text-emerald-700 font-semibold">✅ "${item.correction}"</p>
        <p class="text-xs text-slate-600 mt-1">${item.explanation}</p>
      </div>
      <div class="pt-2 flex justify-end">
        <button class="btn-master-mistake text-xs text-blue-700 hover:text-blue-800 font-medium px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100">
          จำได้แม่นแล้ว (+1 ดาว)
        </button>
      </div>
    `;

    el.querySelector(".btn-master-mistake").onclick = () => {
      item.mastery = Math.min(5, (item.mastery || 0) + 1);
      app.saveState();
      app.playSfx('correct');
      renderMistakeBankModalFull();
      app.renderMistakeBankWidget();
    };

    container.appendChild(el);
  });
}

// Top Quick Mode Navigation Bar Logic
function setupTopNavBar() {
  const topNavButtons = document.querySelectorAll(".top-nav-btn");
  if (!topNavButtons.length) return;

  function setActiveTopNav(target) {
    topNavButtons.forEach(btn => {
      const nav = btn.getAttribute("data-nav");
      if (nav === target) {
        btn.className = "top-nav-btn active flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap bg-blue-600 text-white shadow-xs";
      } else {
        if (nav === "stories") {
          btn.className = "top-nav-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition whitespace-nowrap border border-blue-200/60 bg-blue-50/60";
        } else {
          btn.className = "top-nav-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition whitespace-nowrap border border-transparent";
        }
      }
    });
  }

  topNavButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      if (window.app) window.app.playSfx('click');

      if (target === "roadmap") {
        if (window.switchToAdultMode) window.switchToAdultMode();
        setActiveTopNav("roadmap");
        const el = document.getElementById("roadmap-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target === "daily") {
        if (window.switchToAdultMode) window.switchToAdultMode();
        setActiveTopNav("daily");
        const el = document.getElementById("daily-quests-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target === "stories") {
        if (window.switchToKidsMode) window.switchToKidsMode();
        setActiveTopNav("stories");
        const el = document.getElementById("kids-stories-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target === "music") {
        if (window.switchToKidsMode) window.switchToKidsMode();
        setActiveTopNav("music");
        const el = document.getElementById("kids-music-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target === "kids-curriculum") {
        if (window.switchToKidsMode) window.switchToKidsMode();
        setActiveTopNav("kids-curriculum");
        const el = document.getElementById("kids-curriculum-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target === "ai-chat") {
        if (window.switchToAdultMode) window.switchToAdultMode();
        setActiveTopNav("ai-chat");
        if (window.app) {
          const currentDayData = FULL_CURRICULUM.find(d => d.day === window.app.state.activeSelectedDay);
          const speakingQuest = currentDayData ? currentDayData.quests.find(q => q.type === "speaking") : null;
          if (speakingQuest) {
            window.app.openMissionModal(speakingQuest.id);
          } else {
            const el = document.getElementById("daily-quests-section");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } else if (target === "mistake-bank") {
        setActiveTopNav("mistake-bank");
        renderMistakeBankModalFull();
        document.getElementById("mistake-bank-modal")?.classList.remove("hidden");
      }
    });
  });

  document.getElementById("btn-switch-adult-mode")?.addEventListener("click", () => {
    setActiveTopNav("roadmap");
  });
  document.getElementById("btn-switch-kids-mode")?.addEventListener("click", () => {
    setActiveTopNav("stories");
  });
}


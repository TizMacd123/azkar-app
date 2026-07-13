/**
 * app.js
 * -----------------------------------------------------------------------
 * Point d'entrée de l'application. Orchestre :
 *  - le rendu des cartes d'adhkar (matin / soir / favoris)
 *  - le compteur circulaire animé par carte
 *  - la recherche instantanée
 *  - le mode sombre / clair
 *  - la navigation par onglets
 *  - les favoris
 *  - les statistiques (aujourd'hui, série, semaine)
 *  - le panneau de réglages (notifications, volume, répétition auto)
 *  - l'enregistrement du Service Worker (PWA)
 * -----------------------------------------------------------------------
 */

(() => {
  "use strict";

  /* ------------------------------------------------------------------
     ÉTAT GLOBAL
     ------------------------------------------------------------------ */
  const state = {
    counters: Storage.get(STORAGE_KEYS.COUNTERS, {}),
    favorites: Storage.get(STORAGE_KEYS.FAVORITES, []),
    theme: Storage.get(STORAGE_KEYS.THEME, matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    activeTab: Storage.get(STORAGE_KEYS.LAST_TAB, "morning"),
    settings: Storage.get(STORAGE_KEYS.SETTINGS, {
      notifMorning: false, notifMorningTime: "06:00",
      notifEvening: false, notifEveningTime: "18:00",
      autoRepeat: false, volume: 1
    }),
    stats: Storage.get(STORAGE_KEYS.STATS, { history: {}, streak: 0, lastActiveDate: null, totalTimeSeconds: 0 }),
    searchQuery: "",
    activeAudioId: null,
    sessionStart: Date.now()
  };

  const CIRCLE_RADIUS = 26; // rayon du cercle SVG du compteur
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  /* ------------------------------------------------------------------
     UTILITAIRES
     ------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $all = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function getCount(id) {
    return state.counters[id] || 0;
  }

  function setCount(id, value) {
    state.counters[id] = value;
    Storage.set(STORAGE_KEYS.COUNTERS, state.counters);
  }

  function isFavorite(id) {
    return state.favorites.includes(id);
  }

  function toggleFavorite(id) {
    if (isFavorite(id)) {
      state.favorites = state.favorites.filter(f => f !== id);
    } else {
      state.favorites.push(id);
    }
    Storage.set(STORAGE_KEYS.FAVORITES, state.favorites);
  }

  function showToast(message, iconSvg = "") {
    const toast = $("#toast");
    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  const ICON_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;

  /* ------------------------------------------------------------------
     RENDU D'UNE CARTE DE DHIKR
     ------------------------------------------------------------------ */
  function buildCard(dhikr) {
    const count = getCount(dhikr.id);
    const target = dhikr.repeat;
    const isDone = count >= target;
    const progress = Math.min(count / target, 1);
    const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    const fav = isFavorite(dhikr.id);

    const card = document.createElement("article");
    card.className = "azkar-card" + (isDone ? " completed" : "");
    card.dataset.id = dhikr.id;

    card.innerHTML = `
      <div class="completed-badge">${ICON_CHECK}</div>
      <div class="card-top">
        <span class="card-source">${dhikr.source || ""}</span>
        <button class="card-fav-btn${fav ? " active" : ""}" aria-label="إضافة إلى المفضلة" data-action="favorite">
          <svg viewBox="0 0 24 24" fill="${fav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.3 5 5.8 5c2 0 3.4 1 4.2 2.4C10.8 6 12.2 5 14.2 5c3.5 0 5.2 3.4 3.8 6.7C19.5 16.4 12 21 12 21z"/></svg>
        </button>
      </div>

      <p class="card-arabic">${dhikr.text}</p>
      ${dhikr.translation ? `<p class="card-translation">${dhikr.translation}</p>` : ""}

      <div class="card-bottom">
        <div class="counter-ring-wrap">
          <svg viewBox="0 0 64 64">
            <circle class="counter-ring-bg" cx="32" cy="32" r="${CIRCLE_RADIUS}"></circle>
            <circle class="counter-ring-fg" cx="32" cy="32" r="${CIRCLE_RADIUS}"
              stroke-dasharray="${CIRCLE_CIRCUMFERENCE}" stroke-dashoffset="${dashOffset}"></circle>
          </svg>
          <div class="counter-ring-label" data-role="counter-label">${count}/${target}</div>
        </div>

        <div class="card-actions">
          <button class="icon-mini-btn" data-action="play" aria-label="تشغيل الصوت" title="استماع">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-14 9V3z"/></svg>
          </button>
          <button class="icon-mini-btn" data-action="copy" aria-label="نسخ" title="نسخ">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
          </button>
          <button class="icon-mini-btn" data-action="share" aria-label="مشاركة" title="مشاركة">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.2M8.2 13.2l7.6 4.2"/></svg>
          </button>
          <button class="btn-tasbih" data-action="tasbih" ${isDone ? "disabled" : ""}>سبح</button>
        </div>
      </div>
    `;

    return card;
  }

  function emptyStateEl(message) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l2.6 5.6 6.2.6-4.6 4.2 1.3 6.1L12 16.7l-5.5 2.8 1.3-6.1L3.2 9.2l6.2-.6z"/></svg>
      <p>${message}</p>
    `;
    return div;
  }

  /* ------------------------------------------------------------------
     RENDU D'UNE LISTE (matin / soir / favoris) AVEC FILTRE RECHERCHE
     ------------------------------------------------------------------ */
  function filterList(list) {
    const q = state.searchQuery.trim();
    if (!q) return list;
    return list.filter(d =>
      d.text.includes(q) ||
      (d.translation && d.translation.toLowerCase().includes(q.toLowerCase()))
    );
  }

  function renderGrid(gridEl, list) {
    gridEl.innerHTML = "";
    const filtered = filterList(list);
    if (filtered.length === 0) {
      gridEl.appendChild(emptyStateEl(
        state.searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد أذكار في هذا القسم بعد"
      ));
      return;
    }
    const frag = document.createDocumentFragment();
    filtered.forEach(d => frag.appendChild(buildCard(d)));
    gridEl.appendChild(frag);
  }

  function renderMorning() {
    const list = AZKAR_DATA.filter(d => d.category === "morning");
    renderGrid($("#morningGrid"), list);
    updateProgressSummary("morning", list);
  }

  function renderEvening() {
    const list = AZKAR_DATA.filter(d => d.category === "evening");
    renderGrid($("#eveningGrid"), list);
    updateProgressSummary("evening", list);
  }

  function renderFavorites() {
    const list = AZKAR_DATA.filter(d => isFavorite(d.id));
    renderGrid($("#favoritesGrid"), list);
  }

  function updateProgressSummary(category, list) {
    const done = list.filter(d => getCount(d.id) >= d.repeat).length;
    const total = list.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    $(`#${category}ProgressLabel`).textContent = `${done}/${total}`;
    $(`#${category}ProgressFill`).style.width = `${pct}%`;
  }

  function renderAll() {
    renderMorning();
    renderEvening();
    renderFavorites();
    renderStats();
  }

  /* ------------------------------------------------------------------
     ACTIONS SUR UNE CARTE (délégation d'événements)
     ------------------------------------------------------------------ */
  function handleGridClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const card = e.target.closest(".azkar-card");
    if (!card) return;
    const id = Number(card.dataset.id);
    const dhikr = AZKAR_DATA.find(d => d.id === id);
    if (!dhikr) return;

    const action = btn.dataset.action;
    if (action === "tasbih") handleTasbih(dhikr, card);
    else if (action === "favorite") handleFavoriteToggle(dhikr, btn);
    else if (action === "copy") handleCopy(dhikr);
    else if (action === "share") handleShare(dhikr);
    else if (action === "play") handlePlay(dhikr, btn);
  }

  function handleTasbih(dhikr, card) {
    let count = getCount(dhikr.id);
    if (count >= dhikr.repeat) return;
    count += 1;
    setCount(dhikr.id, count);

    AudioManager.vibrate(15);
    AudioManager.playClickSound();

    // Mise à jour visuelle immédiate du compteur (sans re-render complet)
    const label = card.querySelector('[data-role="counter-label"]');
    const ring = card.querySelector(".counter-ring-fg");
    const progress = Math.min(count / dhikr.repeat, 1);
    label.textContent = `${count}/${dhikr.repeat}`;
    ring.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

    if (count >= dhikr.repeat) {
      card.classList.add("completed");
      card.querySelector(".btn-tasbih").disabled = true;
      AudioManager.vibrate([20, 40, 20]);
      AudioManager.playCompleteSound();
      recordCompletion(dhikr.id);
    }

    updateProgressSummary(dhikr.category, AZKAR_DATA.filter(d => d.category === dhikr.category));
    renderStats();
  }

  function handleFavoriteToggle(dhikr, btn) {
    toggleFavorite(dhikr.id);
    const fav = isFavorite(dhikr.id);
    btn.classList.toggle("active", fav);
    btn.querySelector("svg").setAttribute("fill", fav ? "currentColor" : "none");
    showToast(fav ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة", ICON_CHECK);
    if (state.activeTab === "favorites") renderFavorites();
  }

  function handleCopy(dhikr) {
    const text = dhikr.translation ? `${dhikr.text}\n\n${dhikr.translation}` : dhikr.text;
    navigator.clipboard?.writeText(text).then(() => {
      showToast("تم نسخ الذكر", ICON_CHECK);
    }).catch(() => {
      showToast("تعذر النسخ");
    });
  }

  function handleShare(dhikr) {
    const text = dhikr.translation ? `${dhikr.text}\n\n${dhikr.translation}` : dhikr.text;
    if (navigator.share) {
      navigator.share({ title: "أذكار", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast("تم نسخ الذكر للمشاركة", ICON_CHECK);
    }
  }

  function handlePlay(dhikr, btn) {
    const alreadyPlaying = state.activeAudioId === dhikr.id && AudioManager.getIsSpeaking();
    // Réinitialiser tous les boutons play
    $all(".icon-mini-btn.playing").forEach(b => {
      b.classList.remove("playing");
      b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-14 9V3z"/></svg>`;
    });

    if (alreadyPlaying) {
      AudioManager.stopSpeaking();
      state.activeAudioId = null;
      return;
    }

    state.activeAudioId = dhikr.id;
    btn.classList.add("playing");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

    AudioManager.setVolume(state.settings.volume);
    AudioManager.speak(dhikr.text, {
      onEnd: () => {
        btn.classList.remove("playing");
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-14 9V3z"/></svg>`;
        if (state.settings.autoRepeat && state.activeAudioId === dhikr.id) {
          handlePlay(dhikr, btn);
        } else {
          state.activeAudioId = null;
        }
      }
    });
  }

  /* ------------------------------------------------------------------
     STATISTIQUES
     ------------------------------------------------------------------ */
  function recordCompletion(id) {
    const today = Storage.todayKey();
    const completedToday = Storage.get(STORAGE_KEYS.COMPLETED_TODAY, { date: today, ids: [] });

    if (completedToday.date !== today) {
      completedToday.date = today;
      completedToday.ids = [];
    }
    if (!completedToday.ids.includes(id)) {
      completedToday.ids.push(id);
      Storage.set(STORAGE_KEYS.COMPLETED_TODAY, completedToday);

      state.stats.history[today] = (state.stats.history[today] || 0) + 1;
      state.stats.totalTimeSeconds += 20; // estimation ~20s par dhikr complété

      updateStreak(today);
      Storage.set(STORAGE_KEYS.STATS, state.stats);
    }
  }

  function updateStreak(today) {
    const last = state.stats.lastActiveDate;
    if (last === today) return; // déjà comptabilisé aujourd'hui

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
    const dd = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayKey = `${yyyy}-${mm}-${dd}`;

    if (last === yesterdayKey) {
      state.stats.streak += 1;
    } else {
      state.stats.streak = 1;
    }
    state.stats.lastActiveDate = today;
  }

  function renderStats() {
    const today = Storage.todayKey();
    const completedToday = Storage.get(STORAGE_KEYS.COMPLETED_TODAY, { date: today, ids: [] });
    const todayCount = completedToday.date === today ? completedToday.ids.length : 0;

    $("#statCompletedToday").textContent = todayCount;
    $("#statStreak").textContent = state.stats.streak || 0;

    const minutes = Math.round((state.stats.totalTimeSeconds || 0) / 60);
    $("#statTime").textContent = `${minutes}د`;

    const totalAzkar = AZKAR_DATA.length;
    const totalDoneEver = Object.values(state.counters).filter((_, idx) => {
      const d = AZKAR_DATA[idx];
      return d && state.counters[d.id] >= d.repeat;
    }).length;
    const doneNow = AZKAR_DATA.filter(d => getCount(d.id) >= d.repeat).length;
    const pct = totalAzkar ? Math.round((doneNow / totalAzkar) * 100) : 0;
    $("#statTotalPercent").textContent = `${pct}%`;

    renderWeekBars();
  }

  function renderWeekBars() {
    const container = $("#weekBars");
    container.innerHTML = "";
    const dayNames = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const key = `${yyyy}-${mm}-${dd}`;
      days.push({ key, label: dayNames[d.getDay()], count: state.stats.history[key] || 0 });
    }
    const max = Math.max(1, ...days.map(d => d.count));

    days.forEach(d => {
      const col = document.createElement("div");
      col.className = "week-bar-col";
      const heightPct = Math.round((d.count / max) * 100);
      col.innerHTML = `
        <div class="week-bar" style="height:${Math.max(heightPct, d.count > 0 ? 8 : 2)}%" title="${d.count} ذكر"></div>
        <span class="week-bar-day">${d.label}</span>
      `;
      container.appendChild(col);
    });
  }

  /* ------------------------------------------------------------------
     ONGLETS
     ------------------------------------------------------------------ */
  function switchTab(tab) {
    state.activeTab = tab;
    Storage.set(STORAGE_KEYS.LAST_TAB, tab);

    $all(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    $all(".section-view").forEach(v => v.classList.toggle("active", v.id === `view-${tab}`));

    if (tab === "favorites") renderFavorites();
    if (tab === "stats") renderStats();
  }

  /* ------------------------------------------------------------------
     THÈME
     ------------------------------------------------------------------ */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    const icon = $("#themeIcon");
    icon.innerHTML = state.theme === "dark"
      ? `<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>`
      : `<path d="M12 3v1M12 20v1M4.2 4.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7"/><circle cx="12" cy="12" r="4.5"/>`;
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    Storage.set(STORAGE_KEYS.THEME, state.theme);
    applyTheme();
  }

  /* ------------------------------------------------------------------
     RECHERCHE
     ------------------------------------------------------------------ */
  function handleSearchInput(e) {
    state.searchQuery = e.target.value;
    renderMorning();
    renderEvening();
    if (state.activeTab === "favorites") renderFavorites();
  }

  /* ------------------------------------------------------------------
     PARAMÈTRES / NOTIFICATIONS
     ------------------------------------------------------------------ */
  function openSettings() {
    $("#settingsOverlay").classList.add("show");
  }
  function closeSettings() {
    $("#settingsOverlay").classList.remove("show");
  }

  function loadSettingsIntoUI() {
    $("#notifMorningToggle").checked = state.settings.notifMorning;
    $("#notifMorningTime").value = state.settings.notifMorningTime;
    $("#notifEveningToggle").checked = state.settings.notifEvening;
    $("#notifEveningTime").value = state.settings.notifEveningTime;
    $("#autoRepeatToggle").checked = state.settings.autoRepeat;
    $("#volumeRange").value = state.settings.volume;
  }

  function saveSettings() {
    Storage.set(STORAGE_KEYS.SETTINGS, state.settings);
  }

  async function requestNotificationPermission() {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const perm = await Notification.requestPermission();
    return perm === "granted";
  }

  function scheduleReminderChecks() {
    // Vérifie chaque minute si l'heure programmée correspond à l'heure actuelle
    setInterval(() => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      if (state.settings.notifMorning && state.settings.notifMorningTime === hhmm) {
        fireNotification("حان وقت أذكار الصباح 🌅", "لا تنسَ قراءة أذكارك اليومية");
      }
      if (state.settings.notifEvening && state.settings.notifEveningTime === hhmm) {
        fireNotification("حان وقت أذكار المساء 🌙", "لا تنسَ قراءة أذكارك اليومية");
      }
    }, 60 * 1000);
  }

  function fireNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "assets/images/icon-192.png" });
    }
  }

  function bindSettingsEvents() {
    $("#settingsBtn").addEventListener("click", openSettings);
    $("#settingsClose").addEventListener("click", closeSettings);
    $("#settingsOverlay").addEventListener("click", (e) => {
      if (e.target.id === "settingsOverlay") closeSettings();
    });

    $("#notifMorningToggle").addEventListener("change", async (e) => {
      if (e.target.checked) {
        const ok = await requestNotificationPermission();
        if (!ok) { e.target.checked = false; showToast("الإشعارات غير مسموحة في المتصفح"); return; }
      }
      state.settings.notifMorning = e.target.checked;
      saveSettings();
    });
    $("#notifMorningTime").addEventListener("change", (e) => {
      state.settings.notifMorningTime = e.target.value;
      saveSettings();
    });
    $("#notifEveningToggle").addEventListener("change", async (e) => {
      if (e.target.checked) {
        const ok = await requestNotificationPermission();
        if (!ok) { e.target.checked = false; showToast("الإشعارات غير مسموحة في المتصفح"); return; }
      }
      state.settings.notifEvening = e.target.checked;
      saveSettings();
    });
    $("#notifEveningTime").addEventListener("change", (e) => {
      state.settings.notifEveningTime = e.target.value;
      saveSettings();
    });
    $("#autoRepeatToggle").addEventListener("change", (e) => {
      state.settings.autoRepeat = e.target.checked;
      saveSettings();
    });
    $("#volumeRange").addEventListener("input", (e) => {
      state.settings.volume = Number(e.target.value);
      AudioManager.setVolume(state.settings.volume);
      saveSettings();
    });
  }

  /* ------------------------------------------------------------------
     INITIALISATION
     ------------------------------------------------------------------ */
  function bindGlobalEvents() {
    $all(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
    $("#themeToggle").addEventListener("click", toggleTheme);
    $("#searchInput").addEventListener("input", handleSearchInput);

    ["#morningGrid", "#eveningGrid", "#favoritesGrid"].forEach(sel => {
      $(sel).addEventListener("click", handleGridClick);
    });

    bindSettingsEvents();

    // Suivi du temps passé dans l'app pour les statistiques
    window.addEventListener("beforeunload", () => {
      const elapsed = Math.round((Date.now() - state.sessionStart) / 1000);
      state.stats.totalTimeSeconds += elapsed;
      Storage.set(STORAGE_KEYS.STATS, state.stats);
    });
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {
          // Échec silencieux : l'app reste fonctionnable en ligne
        });
      });
    }
  }

  function init() {
    applyTheme();
    loadSettingsIntoUI();
    switchTab(state.activeTab);
    renderAll();
    bindGlobalEvents();
    scheduleReminderChecks();
    registerServiceWorker();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

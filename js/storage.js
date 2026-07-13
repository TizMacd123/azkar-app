/**
 * storage.js
 * -----------------------------------------------------------------------
 * Couche d'abstraction autour de localStorage.
 * Centralise toutes les clés utilisées par l'application afin d'éviter
 * les fautes de frappe et de faciliter la maintenance.
 * -----------------------------------------------------------------------
 */

const STORAGE_KEYS = {
  COUNTERS: "azkar_counters",       // { [id]: currentCount }
  THEME: "azkar_theme",             // "light" | "dark"
  LAST_TAB: "azkar_last_tab",       // "morning" | "evening" | "favorites" | "stats"
  FAVORITES: "azkar_favorites",     // [id, id, ...]
  STATS: "azkar_stats",             // { history: { "YYYY-MM-DD": completedCount }, streak, totalTimeSeconds }
  SETTINGS: "azkar_settings",       // { notifMorning, notifEvening, volume, autoRepeat }
  COMPLETED_TODAY: "azkar_completed_today" // { date: "YYYY-MM-DD", ids: [id, id] }
};

const Storage = {
  /** Lit une valeur JSON depuis localStorage, avec valeur par défaut. */
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`Storage: lecture impossible pour "${key}"`, err);
      return fallback;
    }
  },

  /** Écrit une valeur JSON dans localStorage. */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`Storage: écriture impossible pour "${key}"`, err);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  /** Retourne la date du jour au format YYYY-MM-DD (fuseau local). */
  todayKey() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
};

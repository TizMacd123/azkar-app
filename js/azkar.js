/**
 * azkar.js
 * -----------------------------------------------------------------------
 * Base de données des أذكار الصباح والمساء (Adhkar du matin et du soir).
 * Textes tirés des sources authentiques traditionnelles (Coran & Sunna),
 * organisation identique à celle utilisée dans "حصن المسلم" (Hisn al-Muslim).
 *
 * Chaque entrée respecte le schéma suivant :
 * {
 *   id:          identifiant unique (Number)
 *   category:    "morning" | "evening"
 *   text:        texte arabe complet
 *   translation: traduction française (résumé du sens général)
 *   repeat:      nombre de répétitions recommandé
 *   source:      référence de la source
 * }
 * -----------------------------------------------------------------------
 */

const AZKAR_DATA = [
  // ============================= MATIN =============================
  {
    id: 1,
    category: "morning",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translation: "Nous voici au matin, et la royauté appartient à Allah ainsi que la louange. Il n'y a de divinité digne d'adoration qu'Allah, Seul, sans associé.",
    repeat: 1,
    source: "رواه مسلم"
  },
  {
    id: 2,
    category: "morning",
    text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    translation: "Ô Allah, c'est par Toi que nous entrons dans le matin, par Toi que nous entrons dans le soir, par Toi que nous vivons et mourons, et vers Toi est la résurrection.",
    repeat: 1,
    source: "رواه الترمذي"
  },
  {
    id: 3,
    category: "morning",
    text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    translation: "Sayyid al-Istighfar : Ô Allah, Tu es mon Seigneur, il n'y a de divinité que Toi. Tu m'as créé et je suis Ton serviteur...",
    repeat: 1,
    source: "رواه البخاري - سيد الاستغفار"
  },
  {
    id: 4,
    category: "morning",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    translation: "Sourate Al-Ikhlas (112) : Dis : Il est Allah, Unique.",
    repeat: 3,
    source: "سورة الإخلاص"
  },
  {
    id: 5,
    category: "morning",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِنْ شَرِّ مَا خَلَقَ * وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "Sourate Al-Falaq (113) : Dis : Je cherche protection auprès du Seigneur de l'aube naissante.",
    repeat: 3,
    source: "سورة الفلق"
  },
  {
    id: 6,
    category: "morning",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَهِ النَّاسِ * مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "Sourate An-Nas (114) : Dis : Je cherche protection auprès du Seigneur des hommes.",
    repeat: 3,
    source: "سورة الناس"
  },
  {
    id: 7,
    category: "morning",
    text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ... وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation: "Ayat al-Kursi (2:255) : Allah, il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même.",
    repeat: 1,
    source: "آية الكرسي - سورة البقرة"
  },
  {
    id: 8,
    category: "morning",
    text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
    translation: "Nous voici au matin sur la nature innée de l'Islam, sur la parole de la sincérité...",
    repeat: 1,
    source: "رواه أحمد"
  },
  {
    id: 9,
    category: "morning",
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    translation: "Ô Allah, je Te demande le pardon et la préservation ici-bas et dans l'au-delà.",
    repeat: 1,
    source: "رواه أبو داود"
  },
  {
    id: 10,
    category: "morning",
    text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
    translation: "Ô Allah, préserve mon corps, préserve mon ouïe, préserve ma vue, il n'y a de divinité que Toi.",
    repeat: 3,
    source: "رواه أبو داود"
  },
  {
    id: 11,
    category: "morning",
    text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    translation: "Allah me suffit, il n'y a de divinité que Lui, en Lui je place ma confiance et Il est le Seigneur du Trône immense.",
    repeat: 7,
    source: "رواه أبو داود"
  },
  {
    id: 12,
    category: "morning",
    text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    translation: "Gloire et louange à Allah, autant que Sa création, autant qu'il Lui plaît, autant que le poids de Son Trône.",
    repeat: 3,
    source: "رواه مسلم"
  },
  {
    id: 13,
    category: "morning",
    text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translation: "Il n'y a de divinité qu'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange.",
    repeat: 10,
    source: "رواه أبو داود والترمذي"
  },
  {
    id: 14,
    category: "morning",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ",
    translation: "Ô Allah, je Te demande le bien de ce jour, son ouverture, sa victoire, sa lumière et sa bénédiction.",
    repeat: 1,
    source: "رواه أبو داود"
  },
  {
    id: 15,
    category: "morning",
    text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: "Je cherche protection dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    repeat: 3,
    source: "رواه مسلم"
  },
  {
    id: 16,
    category: "morning",
    text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    translation: "Gloire et pureté à Allah, et à Lui la louange.",
    repeat: 100,
    source: "رواه مسلم"
  },

  // ============================= SOIR =============================
  {
    id: 101,
    category: "evening",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translation: "Nous voici au soir, et la royauté appartient à Allah ainsi que la louange.",
    repeat: 1,
    source: "رواه مسلم"
  },
  {
    id: 102,
    category: "evening",
    text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    translation: "Ô Allah, c'est par Toi que nous entrons dans le soir, par Toi que nous entrons dans le matin.",
    repeat: 1,
    source: "رواه الترمذي"
  },
  {
    id: 103,
    category: "evening",
    text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    translation: "Sayyid al-Istighfar (version du soir).",
    repeat: 1,
    source: "رواه البخاري - سيد الاستغفار"
  },
  {
    id: 104,
    category: "evening",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    translation: "Sourate Al-Ikhlas (112).",
    repeat: 3,
    source: "سورة الإخلاص"
  },
  {
    id: 105,
    category: "evening",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِنْ شَرِّ مَا خَلَقَ * وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "Sourate Al-Falaq (113).",
    repeat: 3,
    source: "سورة الفلق"
  },
  {
    id: 106,
    category: "evening",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَهِ النَّاسِ * مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "Sourate An-Nas (114).",
    repeat: 3,
    source: "سورة الناس"
  },
  {
    id: 107,
    category: "evening",
    text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ... وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation: "Ayat al-Kursi (2:255).",
    repeat: 1,
    source: "آية الكرسي - سورة البقرة"
  },
  {
    id: 108,
    category: "evening",
    text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
    translation: "Nous voici au soir sur la nature innée de l'Islam.",
    repeat: 1,
    source: "رواه أحمد"
  },
  {
    id: 109,
    category: "evening",
    text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    translation: "Ô Allah, je Te demande le pardon et la préservation ici-bas et dans l'au-delà.",
    repeat: 1,
    source: "رواه أبو داود"
  },
  {
    id: 110,
    category: "evening",
    text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
    translation: "Ô Allah, préserve mon corps, mon ouïe et ma vue.",
    repeat: 3,
    source: "رواه أبو داود"
  },
  {
    id: 111,
    category: "evening",
    text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    translation: "Allah me suffit, il n'y a de divinité que Lui.",
    repeat: 7,
    source: "رواه أبو داود"
  },
  {
    id: 112,
    category: "evening",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ فَتْحَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا",
    translation: "Ô Allah, je Te demande le bien de cette nuit.",
    repeat: 1,
    source: "رواه أبو داود"
  },
  {
    id: 113,
    category: "evening",
    text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: "Je cherche protection dans les paroles parfaites d'Allah.",
    repeat: 3,
    source: "رواه مسلم"
  },
  {
    id: 114,
    category: "evening",
    text: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    translation: "Ô Allah, Tu es Celui qui pardonne et Tu aimes le pardon, pardonne-moi donc.",
    repeat: 1,
    source: "رواه الترمذي"
  },
  {
    id: 115,
    category: "evening",
    text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    translation: "Gloire et pureté à Allah, et à Lui la louange.",
    repeat: 100,
    source: "رواه مسلم"
  },
  {
    id: 116,
    category: "evening",
    text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translation: "Il n'y a de divinité qu'Allah, Seul, sans associé.",
    repeat: 10,
    source: "رواه أبو داود والترمذي"
  }
];

// Export pour usage dans les autres modules (app.js)
if (typeof module !== "undefined" && module.exports) {
  module.exports = AZKAR_DATA;
}

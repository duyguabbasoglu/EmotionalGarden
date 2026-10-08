import { scatterPlots, mostSecludedCell, inReadingOrder } from '../utils/gardenLayout';

/*
 * The thirteen flowers of Duygu's garden: the twelve months, and the bonus.
 *
 * `id` is the month number. Plots are no longer written down here — see
 * gardenLayout.js. The twelve used to sit on every other plot, which read as a
 * checkerboard rather than as a garden; now a seeded search picks a scatter
 * that looks unplanned but stays balanced, and it picks the same one every
 * time, so the garden never rearranges itself between refreshes.
 *
 * The months take those plots in reading order, so January is still top left
 * and the calendar still runs left to right, top to bottom. The thirteenth
 * takes the plot standing furthest off on its own.
 *
 * `colors` drives the garden preview label and the modal's close button, so
 * each flower's accent comes from its own art rather than a hardcoded list.
 */
export const flowers = [
  {
    id: 1,
    name: "Kardelen",
    month: "Ocak",
    description: "Karların arasından başını uzatan, kışın en saf umudu.",
    colors: { primary: "#eef5f0", secondary: "#4e7d59" }
  },
  {
    id: 2,
    name: "Menekşe",
    month: "Şubat",
    description: "Mütevazı ama kadife dokusuyla iç ısıtan minik bir detay.",
    colors: { primary: "#6a3d9a", secondary: "#3f6b35" }
  },
  {
    id: 3,
    name: "Yasemin",
    month: "Mart",
    description: "Bahar akşamlarının o mis kokulu, zarif müjdecisi.",
    colors: { primary: "#fdfbf4", secondary: "#2f6b45" }
  },
  {
    id: 4,
    name: "Lale",
    month: "Nisan",
    description: "Topraktan yükselen rengârenk ve asil bir bahar klasiği.",
    colors: { primary: "#cf2f4a", secondary: "#3f7d4a" }
  },
  {
    id: 5,
    name: "Şakayık",
    month: "Mayıs",
    description: "Kat kat açılan, doğanın en yumuşak ve romantik hali.",
    colors: { primary: "#e98aa6", secondary: "#7a3b52" }
  },
  {
    id: 6,
    name: "Gül",
    month: "Haziran",
    description: "Yazın en klasik, en zarif ve zamansız rengi.",
    colors: { primary: "#8b0020", secondary: "#2e7d32" }
  },
  {
    id: 7,
    name: "Zambak",
    month: "Temmuz",
    description: "Boylu boslu ve gösterişli yapısıyla yaz ortası asaleti.",
    colors: { primary: "#f7eee6", secondary: "#b8743c" }
  },
  {
    id: 8,
    name: "Ayçiçeği",
    month: "Ağustos",
    description: "Güneşe bakan, yazın en neşeli ve en cömert yüzü.",
    colors: { primary: "#f5b301", secondary: "#3e2a10" }
  },
  {
    id: 9,
    name: "Leylak",
    month: "Eylül",
    description: "Nostaljik kokusuyla yazdan sonbahara yumuşak bir geçiş.",
    colors: { primary: "#b084cc", secondary: "#6b3fa0" }
  },
  {
    id: 10,
    name: "Karanfil",
    month: "Ekim",
    description: "Sonbahar rüzgârlarına meydan okuyan sıcak renkler.",
    colors: { primary: "#d6455e", secondary: "#9c3a1e" }
  },
  {
    id: 11,
    name: "Kasımpatı",
    month: "Kasım",
    description: "Soğuk günleri renklendiren vefalı bir sonbahar çiçeği.",
    colors: { primary: "#e08a2e", secondary: "#9c3f6b" }
  },
  {
    id: 12,
    name: "Kokina",
    month: "Aralık",
    description: "Yeni yılın şansı, kırmızı-yeşil neşesi.",
    colors: { primary: "#d90429", secondary: "#1d4a2a" }
  },
  {
    id: 13,
    name: "Yıldız Çiçeği",
    month: "Bonus 13. Ay",
    description: "Dyliax'ın doğuşu... duygunun zarif hikayesi. ✨",
    colors: { primary: "#b5417e", secondary: "#f0b4c8" },
    bonus: true
  }
];

/*
 * Thirteen plots on the 4x6 board, scattered once at module load. The bonus
 * takes the most secluded of them; the twelve months take the rest in reading
 * order, which is why no month needs to know its own coordinates.
 */
const { cells } = scatterPlots(flowers.length);
const bonusCell = mostSecludedCell(cells);
const monthCells = inReadingOrder(cells.filter((c) => c !== bonusCell));

flowers.forEach((flower) => {
  flower.position = flower.bonus ? bonusCell : monthCells.shift();
});

/** Everything planted in the garden beds — the twelve months and the bonus. */
export const gardenFlowers = flowers;

/**
 * The thirteenth, which is also reachable from the sparkle on the title. It
 * has a bed of its own now, so the sparkle is a second way in rather than the
 * only one.
 */
export const bonusFlower = flowers.find((f) => f.bonus);

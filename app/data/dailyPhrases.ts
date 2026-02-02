import { getDateKey } from "../utils/date";

const PHRASES = [
  "Prends ce moment pour toi.",
  "Tout ce qui vient est ok.",
  "Une respiration suffit parfois.",
  "Ici, rien n’est pressé.",
  "Un petit pas, c’est déjà beaucoup.",
  "Ce moment est à toi.",
  "Doucement, à ton rythme.",
];

const hash = (value: string) =>
  value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);

export const getDailyPhrase = (date: Date = new Date()) => {
  const key = getDateKey(date);
  const index = hash(key) % PHRASES.length;
  return PHRASES[index];
};

const pad = (value: number) => value.toString().padStart(2, "0");

export const getDateKey = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

export const daysSince = (iso?: string) => {
  if (!iso) {
    return 999;
  }
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
};

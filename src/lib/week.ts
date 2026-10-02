export const WEEKDAY_COUNT = 5;

export const WEEKDAYS = [
  { day: 0, short: "B.e", full: "Bazar ertəsi" },
  { day: 1, short: "Ç.a", full: "Çərşənbə axşamı" },
  { day: 2, short: "Çər", full: "Çərşənbə" },
  { day: 3, short: "C.a", full: "Cümə axşamı" },
  { day: 4, short: "Cümə", full: "Cümə" },
] as const;

const MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avqust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
] as const;

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfISOWeek(date: Date): Date {
  const d = startOfLocalDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isoWeekId(date: Date): string {
  const monday = startOfISOWeek(date);
  const thursday = addDays(monday, 3);
  const year = thursday.getFullYear();
  const week1 = startOfISOWeek(new Date(year, 0, 4));
  const week = 1 + Math.round((monday.getTime() - week1.getTime()) / 604800000);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function mondayFromWeekId(weekId: string): Date {
  const match = /^(\d{4})-W(\d{2})$/.exec(weekId);
  if (!match) return startOfISOWeek(new Date());
  const year = Number(match[1]);
  const week = Number(match[2]);
  const week1 = startOfISOWeek(new Date(year, 0, 4));
  return addDays(week1, (week - 1) * 7);
}

export function shiftWeekId(weekId: string, delta: number): string {
  return isoWeekId(addDays(mondayFromWeekId(weekId), delta * 7));
}

export function isFriday(date: Date): boolean {
  return date.getDay() === 5;
}

export function weekdayIndex(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function fridayFromWeekId(weekId: string): Date {
  return addDays(mondayFromWeekId(weekId), 4);
}

export function formatFridayDate(weekId: string): string {
  return `Cümə, ${formatDayMonth(fridayFromWeekId(weekId))}`;
}

export function canEditDay(today: Date, weekId: string, day: number): boolean {
  if (day < 0 || day >= WEEKDAY_COUNT) return false;
  const dayDate = startOfLocalDay(addDays(mondayFromWeekId(weekId), day));
  if (dayDate.getTime() > startOfLocalDay(today).getTime()) return false;

  const current = isoWeekId(today);
  if (weekId < current) return true;
  if (weekId === current) return isFriday(today);
  return false;
}

export function editBlockReason(
  today: Date,
  weekId: string,
  day: number,
): string | null {
  if (canEditDay(today, weekId, day)) return null;
  const current = isoWeekId(today);
  if (weekId > current || !isPastOrToday(today, weekId, day)) {
    return "Gələcək gün üçün qayıb qoyula bilməz.";
  }
  if (weekId === current && !isFriday(today)) {
    return "Cari həftəyə qayıb yalnız cümə günü qoyula bilər. Keçmiş həftələrə keçmək olar.";
  }
  return "Bu gün üçün qayıb qoyula bilməz.";
}

export function isPastOrToday(today: Date, weekId: string, day: number): boolean {
  const dayDate = startOfLocalDay(addDays(mondayFromWeekId(weekId), day));
  return dayDate.getTime() <= startOfLocalDay(today).getTime();
}

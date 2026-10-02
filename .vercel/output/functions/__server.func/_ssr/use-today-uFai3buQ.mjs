import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-today-uFai3buQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var WEEKDAYS = [
	{
		day: 0,
		short: "B.e",
		full: "Bazar ertəsi"
	},
	{
		day: 1,
		short: "Ç.a",
		full: "Çərşənbə axşamı"
	},
	{
		day: 2,
		short: "Çər",
		full: "Çərşənbə"
	},
	{
		day: 3,
		short: "C.a",
		full: "Cümə axşamı"
	},
	{
		day: 4,
		short: "Cümə",
		full: "Cümə"
	}
];
var MONTHS = [
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
	"dekabr"
];
function startOfLocalDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function startOfISOWeek(date) {
	const d = startOfLocalDay(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
}
function addDays(date, days) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}
function isoWeekId(date) {
	const monday = startOfISOWeek(date);
	const year = addDays(monday, 3).getFullYear();
	const week1 = startOfISOWeek(new Date(year, 0, 4));
	const week = 1 + Math.round((monday.getTime() - week1.getTime()) / 6048e5);
	return `${year}-W${String(week).padStart(2, "0")}`;
}
function mondayFromWeekId(weekId) {
	const match = /^(\d{4})-W(\d{2})$/.exec(weekId);
	if (!match) return startOfISOWeek(/* @__PURE__ */ new Date());
	const year = Number(match[1]);
	const week = Number(match[2]);
	return addDays(startOfISOWeek(new Date(year, 0, 4)), (week - 1) * 7);
}
function shiftWeekId(weekId, delta) {
	return isoWeekId(addDays(mondayFromWeekId(weekId), delta * 7));
}
function isFriday(date) {
	return date.getDay() === 5;
}
function formatDayMonth(date) {
	return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}
function fridayFromWeekId(weekId) {
	return addDays(mondayFromWeekId(weekId), 4);
}
function formatFridayDate(weekId) {
	return `Cümə, ${formatDayMonth(fridayFromWeekId(weekId))}`;
}
function canEditDay(today, weekId, day) {
	if (day < 0 || day >= 5) return false;
	if (startOfLocalDay(addDays(mondayFromWeekId(weekId), day)).getTime() > startOfLocalDay(today).getTime()) return false;
	const current = isoWeekId(today);
	if (weekId < current) return true;
	if (weekId === current) return isFriday(today);
	return false;
}
function editBlockReason(today, weekId, day) {
	if (canEditDay(today, weekId, day)) return null;
	const current = isoWeekId(today);
	if (weekId > current || !isPastOrToday(today, weekId, day)) return "Gələcək gün üçün qayıb qoyula bilməz.";
	if (weekId === current && !isFriday(today)) return "Cari həftəyə qayıb yalnız cümə günü qoyula bilər. Keçmiş həftələrə keçmək olar.";
	return "Bu gün üçün qayıb qoyula bilməz.";
}
function isPastOrToday(today, weekId, day) {
	return startOfLocalDay(addDays(mondayFromWeekId(weekId), day)).getTime() <= startOfLocalDay(today).getTime();
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function useToday() {
	const [today, setToday] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setToday(/* @__PURE__ */ new Date());
	}, []);
	return today;
}
//#endregion
export { editBlockReason as a, isFriday as c, mondayFromWeekId as d, shiftWeekId as f, cn as i, isPastOrToday as l, useToday as m, addDays as n, formatDayMonth as o, startOfISOWeek as p, canEditDay as r, formatFridayDate as s, WEEKDAYS as t, isoWeekId as u };

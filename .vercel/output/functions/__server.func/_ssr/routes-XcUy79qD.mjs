import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as startOfISOWeek, i as cn, l as isoWeekId, n as addDays, o as formatWeekRange, p as useToday, t as WEEKDAYS } from "./use-today-C5HwaIif.mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as rankAbsentees, i as findRecord, o as useAppStore } from "./router-_83txrQH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-XcUy79qD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AbsenteeBoard() {
	const people = useAppStore((s) => s.people);
	const records = useAppStore((s) => s.records);
	if (!useAppStore((s) => s.hasHydrated)) return null;
	const ranked = rankAbsentees(people, records).slice(0, 8);
	if (ranked.length === 0) return null;
	const max = Math.max(...ranked.map((r) => r.absences), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface/80 p-5 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-kicker text-accent uppercase",
				children: "Sıralama"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-2xl text-fg",
				children: "Ən çox qayıb edənlər"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "Üzürsüz üstün tutulur"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-3",
			children: ranked.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid grid-cols-[1.5rem_1fr_auto] items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg text-muted tabular-nums",
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium text-fg",
								children: row.person.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "shrink-0 text-xs text-muted tabular-nums",
								children: [
									row.unexcused,
									" üzürsüz · ",
									row.excused,
									" üzürlü"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 h-1 overflow-hidden rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-absent/80",
								style: { width: `${Math.max(8, row.absences / max * 100)}%` }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl text-fg tabular-nums",
						children: row.absences
					})
				]
			}, row.person.id))
		})]
	});
}
function HadithCard() {
	const hadiths = useAppStore((s) => s.hadiths);
	const hydrated = useAppStore((s) => s.hasHydrated);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("in");
	const [reduceMotion, setReduceMotion] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduceMotion(media.matches);
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, []);
	(0, import_react.useEffect)(() => {
		if (index >= hadiths.length) setIndex(0);
	}, [hadiths.length, index]);
	(0, import_react.useEffect)(() => {
		if (hadiths.length < 2) return;
		const swap = () => {
			if (reduceMotion) {
				setIndex((i) => (i + 1) % hadiths.length);
				return;
			}
			setPhase("out");
			window.setTimeout(() => {
				setIndex((i) => (i + 1) % hadiths.length);
				setPhase("in");
			}, 250);
		};
		const id = window.setInterval(swap, 14e3);
		return () => window.clearInterval(id);
	}, [hadiths.length, reduceMotion]);
	const current = hadiths[index];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Hədis",
		className: "hadith-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hadith-light",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hadith-light-trail",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hadith-shell-inner px-6 py-8 sm:px-10 sm:py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-6 text-xs font-medium tracking-kicker text-accent uppercase",
						children: "Hədis"
					}),
					!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						dir: "rtl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-5/6 rounded-sm bg-elevated" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-3/4 rounded-sm bg-elevated" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-1/3 rounded-sm bg-elevated" })
						]
					}) : current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hadith-copy min-h-40",
						"data-state": phase,
						dir: "rtl",
						lang: "ar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
							className: "font-arabic text-xl leading-[1.9] text-fg sm:text-2xl",
							children: current.text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 font-arabic text-sm tracking-wide text-muted",
							children: current.source
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-h-40 font-display text-2xl leading-snug text-muted italic",
						children: "Hələ hədis əlavə edilməyib."
					}),
					hadiths.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex items-center gap-2",
						role: "tablist",
						"aria-label": "Hədislər",
						children: hadiths.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": i === index,
							"aria-label": `Hədis ${i + 1}`,
							onClick: () => {
								setPhase("in");
								setIndex(i);
							},
							className: cn("h-2 rounded-full transition-[width,background-color] duration-200", i === index ? "w-6 bg-accent" : "w-2 bg-border hover:bg-muted")
						}, h.id))
					}) : null
				]
			})
		]
	});
}
function SiteHeader() {
	const today = useToday();
	const weekLabel = today ? formatWeekRange(isoWeekId(today)) : " ";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "star-mark",
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-kicker text-accent uppercase",
				children: "Həftəlik qayıb dəftəri"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl leading-tight tracking-tight text-fg sm:text-5xl",
				children: "Məclis"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: weekLabel
		})]
	});
}
var statusLabel = {
	present: "İştirak etdi",
	excused: "Üzürlü",
	unexcused: "Üzürsüz"
};
var statusDot = {
	present: "bg-present",
	excused: "bg-excused",
	unexcused: "bg-absent"
};
function WeekOverview() {
	const people = useAppStore((s) => s.people);
	const records = useAppStore((s) => s.records);
	const hydrated = useAppStore((s) => s.hasHydrated);
	const today = useToday();
	if (!hydrated || !today || people.length === 0) return null;
	const weekId = isoWeekId(today);
	const monday = startOfISOWeek(today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface/80 p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-kicker text-accent uppercase",
					children: "Bu həftə"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl text-fg",
					children: "Davamiyyət"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: formatWeekRange(weekId)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 hidden grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))] gap-2 text-xs tracking-wide text-subtle uppercase sm:grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ad" }), WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-center",
					children: d.short
				}, d.day))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-3 first:pt-0 last:pb-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-center gap-2 sm:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium text-fg",
							children: person.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 sm:contents",
							children: WEEKDAYS.map((d) => {
								const rec = findRecord(records, person.id, weekId, d.day);
								const cellDate = addDays(monday, d.day);
								const isToday = cellDate.getFullYear() === today.getFullYear() && cellDate.getMonth() === today.getMonth() && cellDate.getDate() === today.getDate();
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 items-center justify-center gap-1.5",
									title: rec ? `${d.full}: ${statusLabel[rec.status]}` : `${d.full}: qeyd yoxdur`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-full", rec ? statusDot[rec.status] : "bg-border", isToday && "ring-2 ring-accent/50 ring-offset-2 ring-offset-surface") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-subtle sm:hidden",
										children: d.short
									})]
								}, d.day);
							})
						})]
					})
				}, person.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-4 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
						className: "bg-present",
						label: "İştirak"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
						className: "bg-excused",
						label: "Üzürlü"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
						className: "bg-absent",
						label: "Üzürsüz"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
						className: "bg-border",
						label: "Qeyd yoxdur"
					})
				]
			})
		]
	});
}
function LegendDot({ className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", className) }), label]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:gap-10 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AbsenteeBoard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HadithCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekOverview, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "pb-8 pt-4 text-center text-xs tracking-kicker text-subtle uppercase",
				children: "Məclis"
			})
		]
	});
}
//#endregion
export { Home as component };

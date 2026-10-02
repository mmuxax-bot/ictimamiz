import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as editBlockReason, c as isFriday, d as mondayFromWeekId, f as shiftWeekId, i as cn, l as isPastOrToday, m as useToday, n as addDays, o as formatDayMonth, r as canEditDay, s as formatFridayDate, t as WEEKDAYS, u as isoWeekId } from "./use-today-uFai3buQ.mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ChevronRight, i as LogOut, n as Trash2, o as ChevronLeft, r as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as findRecord, o as useAppStore, r as ADMIN_SESSION_KEY } from "./router-CAOOh__b.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CyG-8MSR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,border-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:opacity-90",
			secondary: "bg-elevated text-fg border border-border hover:border-accent/40",
			ghost: "bg-transparent text-muted hover:text-fg hover:bg-elevated",
			present: "bg-present/15 text-present border border-present/30 data-[active=true]:bg-present data-[active=true]:text-bg",
			excused: "bg-excused/15 text-excused border border-excused/30 data-[active=true]:bg-excused data-[active=true]:text-bg",
			unexcused: "bg-absent/15 text-absent border border-absent/30 data-[active=true]:bg-absent data-[active=true]:text-bg",
			danger: "bg-absent/15 text-absent border border-absent/30 hover:bg-absent/25"
		},
		size: {
			sm: "h-9 rounded-sm px-3 text-sm",
			md: "h-11 rounded-md px-4 text-sm",
			lg: "h-12 rounded-md px-5 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, type = "text", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("h-11 w-full rounded-md border border-border bg-elevated px-3 text-base text-fg placeholder:text-subtle", "transition-[border-color,box-shadow] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent/40", "disabled:opacity-40", className),
		...props
	});
}
function AdminGate({ onUnlock }) {
	const [code, setCode] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(false);
	function onSubmit(e) {
		e.preventDefault();
		if (code.trim() === "admin 26") {
			sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
			onUnlock();
			return;
		}
		setError(true);
		setShake(true);
		window.setTimeout(() => setShake(false), 400);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: cn("w-full max-w-sm rounded-xl border border-border bg-surface p-6 sm:p-8", shake && "shake"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-kicker text-accent uppercase",
					children: "İctima"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl text-fg",
					children: "Giriş"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Admin kodunu daxil edin."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-6 block text-sm font-medium text-fg",
					htmlFor: "admin-code",
					children: "Kod"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "admin-code",
					type: "password",
					autoComplete: "current-password",
					value: code,
					onChange: (e) => {
						setCode(e.target.value);
						setError(false);
					},
					className: "mt-2",
					"aria-invalid": error
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-absent",
					children: "Kod səhvdir."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-2 h-5 text-sm" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-4 w-full",
					children: "Daxil ol"
				})
			]
		})
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-md border border-border bg-elevated px-3 py-3 text-base text-fg placeholder:text-subtle", "transition-[border-color,box-shadow] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent/40", "disabled:opacity-40", className),
		...props
	});
}
var OPTIONS = [
	{
		id: "present",
		label: "İştirak etdi",
		variant: "present"
	},
	{
		id: "excused",
		label: "Üzürlü",
		variant: "excused"
	},
	{
		id: "unexcused",
		label: "Üzürsüz",
		variant: "unexcused"
	}
];
function StatusPicker({ value, disabled, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2 sm:flex-row",
		children: OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: opt.variant,
			size: "md",
			disabled,
			"data-active": value === opt.id,
			"aria-pressed": value === opt.id,
			className: "flex-1",
			onClick: () => onChange(value === opt.id ? null : opt.id),
			children: opt.label
		}, opt.id))
	});
}
function AdminPanel({ onLock }) {
	const [tab, setTab] = (0, import_react.useState)("defter");
	function lock() {
		sessionStorage.removeItem(ADMIN_SESSION_KEY);
		onLock();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-kicker text-accent uppercase",
					children: "Gizli panel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl text-fg",
					children: "Admin"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: lock,
					"aria-label": "Çıxış",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1 rounded-lg bg-surface p-1 border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					active: tab === "defter",
					onClick: () => setTab("defter"),
					children: "Dəftər"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					active: tab === "hadis",
					onClick: () => setTab("hadis"),
					children: "Hədislər"
				})]
			}),
			tab === "defter" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerTab, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HadithTab, {})
		]
	});
}
function TabButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 flex-1 rounded-md text-sm font-medium transition-colors duration-150", active ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
		children
	});
}
function LedgerTab() {
	const people = useAppStore((s) => s.people);
	const records = useAppStore((s) => s.records);
	const addPerson = useAppStore((s) => s.addPerson);
	const removePerson = useAppStore((s) => s.removePerson);
	const setAttendance = useAppStore((s) => s.setAttendance);
	const today = useToday();
	const [name, setName] = (0, import_react.useState)("");
	const [weekId, setWeekId] = (0, import_react.useState)(() => isoWeekId(/* @__PURE__ */ new Date()));
	const [day, setDay] = (0, import_react.useState)(() => {
		const d = (/* @__PURE__ */ new Date()).getDay();
		if (d >= 1 && d <= 5) return d - 1;
		return 4;
	});
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const currentWeek = today ? isoWeekId(today) : weekId;
	const friday = today ? isFriday(today) : false;
	const editable = today ? canEditDay(today, weekId, day) : false;
	const dayMeta = WEEKDAYS[day] ?? WEEKDAYS[4];
	const dayDate = (0, import_react.useMemo)(() => addDays(mondayFromWeekId(weekId), day), [weekId, day]);
	function onAdd(e) {
		e.preventDefault();
		const result = addPerson(name);
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		setName("");
		toast.success("Ad əlavə olundu.");
	}
	function onStatus(personId, status) {
		if (!today) return;
		const blocked = editBlockReason(today, weekId, day);
		if (blocked) {
			toast.error(blocked);
			return;
		}
		setAttendance(personId, weekId, day, status);
	}
	function onDeletePerson(id) {
		if (pendingDelete !== id) {
			setPendingDelete(id);
			window.setTimeout(() => setPendingDelete((cur) => cur === id ? null : cur), 3500);
			return;
		}
		removePerson(id);
		setPendingDelete(null);
		toast.success("Ad silindi.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onAdd,
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Ad və soyad",
					"aria-label": "Yeni ad"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "sm:w-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Əlavə et"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								"aria-label": "Əvvəlki həftə",
								onClick: () => setWeekId((w) => shiftWeekId(w, -1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-fg",
									children: formatFridayDate(weekId)
								}), weekId === currentWeek ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-accent",
									children: "Cari həftə"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-muted hover:text-fg",
									onClick: () => setWeekId(currentWeek),
									children: "Cari həftəyə qayıt"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								"aria-label": "Növbəti həftə",
								onClick: () => setWeekId((w) => shiftWeekId(w, 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
							})
						]
					}),
					weekId > currentWeek ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-border bg-elevated px-3 py-3 text-sm text-muted",
						children: "Gələcək həftə — yalnız baxış üçündür."
					}) : weekId < currentWeek ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-accent/25 bg-accent/10 px-3 py-3 text-sm text-fg",
						children: "Keçmiş həftə — bütün günlər üçün qayıb qoymaq və silmək olar."
					}) : !friday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-border bg-elevated px-3 py-3 text-sm text-muted",
						children: "Cari həftəyə qayıb yalnız cümə günü qoyula bilər. Keçmiş həftələrə keçib qayıb yazmaq olar."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-accent/25 bg-accent/10 px-3 py-3 text-sm text-fg",
						children: "Cümə günüdür — bu həftənin keçmiş günləri və bu gün üçün qayıb qoymaq olar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-5 gap-1",
						children: WEEKDAYS.map((d) => {
							const past = today ? isPastOrToday(today, weekId, d.day) : false;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setDay(d.day),
								className: cn("min-h-11 rounded-md px-1 py-2 text-center transition-colors duration-150", day === d.day ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-medium",
									children: d.short
								}), !past ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-xs text-subtle",
									children: "gələcək"
								}) : null]
							}, d.day);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-fg",
					children: dayMeta.full
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: formatDayMonth(dayDate)
				})] }), people.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted",
					children: "Siyahı boşdur. Yuxarıdan ad əlavə edin."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-3",
					children: people.map((person) => {
						const rec = findRecord(records, person.id, weekId, day);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-fg",
									children: person.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: pendingDelete === person.id ? "danger" : "ghost",
									size: "icon",
									className: "size-11 shrink-0",
									"aria-label": pendingDelete === person.id ? `${person.name} silinsin?` : `${person.name} sil`,
									onClick: () => onDeletePerson(person.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPicker, {
								value: rec?.status ?? null,
								disabled: !editable,
								onChange: (status) => onStatus(person.id, status)
							})]
						}, person.id);
					})
				})]
			})
		]
	});
}
function HadithTab() {
	const hadiths = useAppStore((s) => s.hadiths);
	const addHadith = useAppStore((s) => s.addHadith);
	const removeHadith = useAppStore((s) => s.removeHadith);
	const [text, setText] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("");
	function onAdd(e) {
		e.preventDefault();
		const result = addHadith(text, source);
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		setText("");
		setSource("");
		toast.success("Hədis əlavə olundu.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: onAdd,
			className: "flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium text-fg",
					htmlFor: "hadith-text",
					children: "Yeni hədis"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "hadith-text",
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "نص الحديث",
					dir: "rtl",
					lang: "ar",
					className: "font-arabic text-lg leading-loose"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: source,
					onChange: (e) => setSource(e.target.value),
					placeholder: "المصدر (صحيح البخاري)",
					"aria-label": "Mənbə",
					dir: "rtl",
					lang: "ar",
					className: "font-arabic"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "self-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Əlavə et"]
				})
			]
		}), hadiths.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted",
			children: "Hədis yoxdur. Ana səhifədəki kart buradan doldurulur."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3",
			children: hadiths.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3 rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					dir: "rtl",
					lang: "ar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-arabic text-lg leading-loose text-fg",
						children: h.text
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-arabic text-sm tracking-wide text-muted",
						children: h.source
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					"aria-label": "Hədisi sil",
					onClick: () => {
						removeHadith(h.id);
						toast.success("Hədis silindi.");
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}, h.id))
		})]
	});
}
function AdminPage() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setUnlocked(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-bg" });
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGate, { onUnlock: () => setUnlocked(true) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPanel, { onLock: () => setUnlocked(false) });
}
//#endregion
export { AdminPage as component };

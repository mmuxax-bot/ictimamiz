import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as lazyRouteComponent, b as useRouter, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, v as createFileRoute, x as require_jsx_runtime, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-_83txrQH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var STORAGE_KEY = "meclis-qayib-v1";
var ADMIN_SESSION_KEY = "meclis-admin-session";
var SEED_HADITHS = [
	{
		id: "h-ar-1",
		text: "المُسْلِمُ أخُو المُسْلِمِ، لا يَظْلِمُهُ ولا يُسْلِمُهُ، ومَن كانَ في حاجَةِ أخِيهِ كانَ اللَّهُ في حاجَتِهِ",
		source: "صحيح البخاري، عن عبدالله بن عمر"
	},
	{
		id: "h-ar-2",
		text: "إنَّ المُسْلِمَ إذا عادَ أخاهُ المُسْلِمَ لَمْ يَزَلْ في خُرْفَةِ الجَنَّةِ حتَّى يَرْجِعَ",
		source: "صحيح مسلم، عن ثوبان"
	},
	{
		id: "h-ar-3",
		text: "لا تَباغَضُوا، ولا تَدابَرُوا، ولا تَنافَسُوا، وكُونُوا عِبادَ اللهِ إخْوانًا",
		source: "صحيح مسلم، عن أبي هريرة"
	},
	{
		id: "h-ar-4",
		text: "المسلمُ أخو المسلمِ لا يخونُهُ ولا يَكذِبُهُ، ولا يخذلُهُ، كلُّ المسلمِ علَى المسلمِ حرامٌ: عِرضُهُ ومالُهُ ودمُهُ. التَّقوَى ههُنا. بِحسبِ امرئٍ منَ الشَّرِّ أن يحتقِرَ أخاهُ المسلمَ",
		source: "سنن الترمذي، عن أبي هريرة"
	},
	{
		id: "h-ar-5",
		text: "انْصُرْ أخاكَ ظالِمًا أوْ مَظْلُومًا. فقالَ رَجُلٌ: يا رَسولَ اللَّهِ، أنْصُرُهُ إذا كانَ مَظْلُومًا، أفَرَأَيْتَ إذا كانَ ظالِمًا، كيفَ أنْصُرُهُ؟ قالَ: تَحْجُزُهُ — أوْ تَمْنَعُهُ — مِنَ الظُّلْمِ؛ فإنَّ ذلكَ نَصْرُهُ",
		source: "صحيح البخاري، عن أنس بن مالك"
	},
	{
		id: "h-ar-6",
		text: "سَبْعَةٌ يُظِلُّهُمُ اللَّهُ في ظِلِّهِ، يَومَ لا ظِلَّ إلَّا ظِلُّهُ: الإمَامُ العَادِلُ، وشَابٌّ نَشَأَ في عِبَادَةِ رَبِّهِ، ورَجُلٌ قَلْبُهُ مُعَلَّقٌ في المَسَاجِدِ، ورَجُلَانِ تَحَابَّا في اللَّهِ اجْتَمعا عليه وتَفَرَّقَا عليه، ورَجُلٌ طَلَبَتْهُ امْرَأَةٌ ذَاتُ مَنْصِبٍ وجَمَالٍ، فَقَالَ: إنِّي أخَافُ اللَّهَ، ورَجُلٌ تَصَدَّقَ، أخْفَى حتَّى لا تَعْلَمَ شِمَالُهُ ما تُنْفِقُ يَمِينُهُ، ورَجُلٌ ذَكَرَ اللَّهَ خَالِيًا فَفَاضَتْ عَيْنَاهُ",
		source: "صحيح البخاري، عن أبي هريرة"
	},
	{
		id: "h-ar-7",
		text: "حَقُّ المُسْلِمِ علَى المُسْلِمِ خَمْسٌ: رَدُّ السَّلَامِ، وعِيَادَةُ المَرِيضِ، واتِّبَاعُ الجَنَائِزِ، وإجَابَةُ الدَّعْوَةِ، وتَشْمِيتُ العَاطِسِ",
		source: "صحيح البخاري، عن أبي هريرة"
	},
	{
		id: "h-ar-8",
		text: "المؤمنُ مِرآةُ المؤمنِ، والمؤمنُ أخو المؤمنِ: يكفُّ عليه ضَيعتَه، ويحوطُه من ورائِه",
		source: "سنن أبي داود، عن أبي هريرة"
	},
	{
		id: "h-ar-9",
		text: "حقَّتْ مَحَبَّتِي لِلْمُتَحابِّينَ فِيَّ، وحقَّتْ مَحَبَّتِي لِلْمُتَوَاصِلِينَ فِيَّ، وحقَّتْ مَحَبَّتِي لِلْمُتَزَاوِرِينَ فِيَّ، وحقَّتْ مَحَبَّتِي لِلْمُتَباذِلِينَ فِيَّ",
		source: "صحيح الترغيب، عن عبادة بن الصامت"
	},
	{
		id: "h-ar-10",
		text: "قالَ اللَّهُ عزَّ وجلَّ: المتحابُّونَ في جلالي لَهُم مَنابرُ مِن نورٍ يغبطُهُمُ النَّبيُّونَ والشُّهداءُ",
		source: "سنن الترمذي، عن معاذ بن جبل"
	}
];
function newId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
var noopStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
var OLD_SEED_IDS = /* @__PURE__ */ new Set([
	"h1",
	"h2",
	"h3",
	"h4",
	"h5"
]);
function migrateHadiths(hadiths, version) {
	if (hadiths.some((h) => OLD_SEED_IDS.has(h.id)) || (version ?? 0) < 2) return {
		hadiths: SEED_HADITHS,
		hadithSeedVersion: 2
	};
	return {
		hadiths,
		hadithSeedVersion: 2
	};
}
var useAppStore = create()(persist((set, get) => ({
	people: [],
	hadiths: SEED_HADITHS,
	records: [],
	hadithSeedVersion: 2,
	hasHydrated: false,
	setHasHydrated: (value) => set({ hasHydrated: value }),
	addPerson: (rawName) => {
		const name = rawName.trim().replace(/\s+/g, " ");
		if (!name) return {
			ok: false,
			error: "Ad boş ola bilməz."
		};
		if (get().people.some((p) => p.name.localeCompare(name, "az", { sensitivity: "accent" }) === 0)) return {
			ok: false,
			error: "Bu ad artıq siyahıdadır."
		};
		set({ people: [...get().people, {
			id: newId(),
			name,
			createdAt: Date.now()
		}].sort((a, b) => a.name.localeCompare(b.name, "az")) });
		return { ok: true };
	},
	removePerson: (id) => {
		set({
			people: get().people.filter((p) => p.id !== id),
			records: get().records.filter((r) => r.personId !== id)
		});
	},
	addHadith: (rawText, rawSource) => {
		const text = rawText.trim();
		const source = rawSource.trim();
		if (!text) return {
			ok: false,
			error: "Hədis mətni boş ola bilməz."
		};
		set({ hadiths: [...get().hadiths, {
			id: newId(),
			text,
			source: source || "Əlavə olunub"
		}] });
		return { ok: true };
	},
	removeHadith: (id) => {
		set({ hadiths: get().hadiths.filter((h) => h.id !== id) });
	},
	setAttendance: (personId, weekId, day, status) => {
		const rest = get().records.filter((r) => !(r.personId === personId && r.weekId === weekId && r.day === day));
		if (!status) {
			set({ records: rest });
			return;
		}
		set({ records: [...rest, {
			personId,
			weekId,
			day,
			status
		}] });
	}
}), {
	name: STORAGE_KEY,
	storage: createJSONStorage(() => typeof window === "undefined" ? noopStorage : localStorage),
	partialize: (state) => ({
		people: state.people,
		hadiths: state.hadiths,
		records: state.records,
		hadithSeedVersion: state.hadithSeedVersion
	}),
	skipHydration: true,
	onRehydrateStorage: () => (state) => {
		if (!state) return;
		const migrated = migrateHadiths(state.hadiths, state.hadithSeedVersion);
		state.hadiths = migrated.hadiths;
		state.hadithSeedVersion = migrated.hadithSeedVersion;
		state.setHasHydrated(true);
	}
}));
function findRecord(records, personId, weekId, day) {
	return records.find((r) => r.personId === personId && r.weekId === weekId && r.day === day);
}
function rankAbsentees(people, records, weekId) {
	const scoped = weekId ? records.filter((r) => r.weekId === weekId) : records;
	return people.map((person) => {
		const mine = scoped.filter((r) => r.personId === person.id);
		const unexcused = mine.filter((r) => r.status === "unexcused").length;
		const excused = mine.filter((r) => r.status === "excused").length;
		return {
			person,
			unexcused,
			excused,
			present: mine.filter((r) => r.status === "present").length,
			absences: unexcused + excused
		};
	}).filter((row) => row.absences > 0).sort((a, b) => b.unexcused - a.unexcused || b.absences - a.absences || a.person.name.localeCompare(b.person.name, "az"));
}
function StoreProvider({ children }) {
	(0, import_react.useEffect)(() => {
		const finish = () => {
			const current = useAppStore.getState();
			const migrated = migrateHadiths(current.hadiths, current.hadithSeedVersion);
			useAppStore.setState({
				hadiths: migrated.hadiths,
				hadithSeedVersion: migrated.hadithSeedVersion
			});
			if (!useAppStore.getState().hasHydrated) useAppStore.getState().setHasHydrated(true);
		};
		const result = useAppStore.persist.rehydrate();
		if (result && typeof result.then === "function") result.then(finish);
		else finish();
		const timeout = window.setTimeout(() => {
			if (!useAppStore.getState().hasHydrated) useAppStore.getState().setHasHydrated(true);
		}, 80);
		return () => window.clearTimeout(timeout);
	}, []);
	return children;
}
var styles_default = "/assets/styles-QCB8s6ay.css";
var APP_NAME = "Məclis";
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Həftəlik qayıb dəftəri — davamiyyət, hədis və cümə qeydi."
			},
			{
				name: "theme-color",
				content: "#09090b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "az",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { className: "sonner-toast" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-XcUy79qD.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin-m87biqF5.mjs");
var Route = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	AdminRoute: Route.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { rankAbsentees as a, findRecord as i, useAppStore as o, ADMIN_SESSION_KEY as r, router_exports as t };

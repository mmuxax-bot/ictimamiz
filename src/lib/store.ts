import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isoWeekId } from "@/lib/week";

export type AttendanceStatus = "present" | "excused" | "unexcused";

export type Person = {
  id: string;
  name: string;
  createdAt: number;
};

export type Hadith = {
  id: string;
  text: string;
  source: string;
};

export type AttendanceRecord = {
  personId: string;
  weekId: string;
  day: number;
  status: AttendanceStatus;
};

export const ADMIN_CODE = "admin 26";
export const STORAGE_KEY = "meclis-qayib-v1";
export const ADMIN_SESSION_KEY = "meclis-admin-session";
export const HADITH_SEED_VERSION = 2;

export const SEED_HADITHS: Hadith[] = [
  {
    id: "h-ar-1",
    text: "المُسْلِمُ أخُو المُسْلِمِ، لا يَظْلِمُهُ ولا يُسْلِمُهُ، ومَن كانَ في حاجَةِ أخِيهِ كانَ اللَّهُ في حاجَتِهِ",
    source: "صحيح البخاري، عن عبدالله بن عمر",
  },
  {
    id: "h-ar-2",
    text: "إنَّ المُسْلِمَ إذا عادَ أخاهُ المُسْلِمَ لَمْ يَزَلْ في خُرْفَةِ الجَنَّةِ حتَّى يَرْجِعَ",
    source: "صحيح مسلم، عن ثوبان",
  },
  {
    id: "h-ar-3",
    text: "لا تَباغَضُوا، ولا تَدابَرُوا، ولا تَنافَسُوا، وكُونُوا عِبادَ اللهِ إخْوانًا",
    source: "صحيح مسلم، عن أبي هريرة",
  },
  {
    id: "h-ar-4",
    text: "المسلمُ أخو المسلمِ لا يخونُهُ ولا يَكذِبُهُ، ولا يخذلُهُ، كلُّ المسلمِ علَى المسلمِ حرامٌ: عِرضُهُ ومالُهُ ودمُهُ. التَّقوَى ههُنا. بِحسبِ امرئٍ منَ الشَّرِّ أن يحتقِرَ أخاهُ المسلمَ",
    source: "سنن الترمذي، عن أبي هريرة",
  },
  {
    id: "h-ar-5",
    text: "انْصُرْ أخاكَ ظالِمًا أوْ مَظْلُومًا. فقالَ رَجُلٌ: يا رَسولَ اللَّهِ، أنْصُرُهُ إذا كانَ مَظْلُومًا، أفَرَأَيْتَ إذا كانَ ظالِمًا، كيفَ أنْصُرُهُ؟ قالَ: تَحْجُزُهُ — أوْ تَمْنَعُهُ — مِنَ الظُّلْمِ؛ فإنَّ ذلكَ نَصْرُهُ",
    source: "صحيح البخاري، عن أنس بن مالك",
  },
  {
    id: "h-ar-6",
    text: "سَبْعَةٌ يُظِلُّهُمُ اللَّهُ في ظِلِّهِ، يَومَ لا ظِلَّ إلَّا ظِلُّهُ: الإمَامُ العَادِلُ، وشَابٌّ نَشَأَ في عِبَادَةِ رَبِّهِ، ورَجُلٌ قَلْبُهُ مُعَلَّقٌ في المَسَاجِدِ، ورَجُلَانِ تَحَابَّا في اللَّهِ اجْتَمعا عليه وتَفَرَّقَا عليه، ورَجُلٌ طَلَبَتْهُ امْرَأَةٌ ذَاتُ مَنْصِبٍ وجَمَالٍ، فَقَالَ: إنِّي أخَافُ اللَّهَ، ورَجُلٌ تَصَدَّقَ، أخْفَى حتَّى لا تَعْلَمَ شِمَالُهُ ما تُنْفِقُ يَمِينُهُ، ورَجُلٌ ذَكَرَ اللَّهَ خَالِيًا فَفَاضَتْ عَيْنَاهُ",
    source: "صحيح البخاري، عن أبي هريرة",
  },
  {
    id: "h-ar-7",
    text: "حَقُّ المُسْلِمِ علَى المُسْلِمِ خَمْسٌ: رَدُّ السَّلَامِ، وعِيَادَةُ المَرِيضِ، واتِّبَاعُ الجَنَائِزِ، وإجَابَةُ الدَّعْوَةِ، وتَشْمِيتُ العَاطِسِ",
    source: "صحيح البخاري، عن أبي هريرة",
  },
  {
    id: "h-ar-8",
    text: "المؤمنُ مِرآةُ المؤمنِ، والمؤمنُ أخو المؤمنِ: يكفُّ عليه ضَيعتَه، ويحوطُه من ورائِه",
    source: "سنن أبي داود، عن أبي هريرة",
  },
  {
    id: "h-ar-9",
    text: "حقَّتْ مَحَبَّتِي لِلْمُتَحابِّينَ فِيَّ، وحقَّتْ مَحَبَّتِي لِلْمُتَوَاصِلِينَ فِيَّ، وحقَّتْ مَحَبَّتِي لِلْمُتَزَاوِرِينَ فِيَّ، وحقَّتْ مَحَبَّتِي لِلْمُتَباذِلِينَ فِيَّ",
    source: "صحيح الترغيب، عن عبادة بن الصامت",
  },
  {
    id: "h-ar-10",
    text: "قالَ اللَّهُ عزَّ وجلَّ: المتحابُّونَ في جلالي لَهُم مَنابرُ مِن نورٍ يغبطُهُمُ النَّبيُّونَ والشُّهداءُ",
    source: "سنن الترمذي، عن معاذ بن جبل",
  },
];

type ActionResult = { ok: true } | { ok: false; error: string };

type AppState = {
  people: Person[];
  hadiths: Hadith[];
  records: AttendanceRecord[];
  hadithSeedVersion: number;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addPerson: (name: string) => ActionResult;
  removePerson: (id: string) => void;
  addHadith: (text: string, source: string) => ActionResult;
  removeHadith: (id: string) => void;
  setAttendance: (
    personId: string,
    weekId: string,
    day: number,
    status: AttendanceStatus | null,
  ) => void;
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const OLD_SEED_IDS = new Set(["h1", "h2", "h3", "h4", "h5"]);

export function migrateHadiths(
  hadiths: Hadith[],
  version: number | undefined,
): { hadiths: Hadith[]; hadithSeedVersion: number } {
  const hasLegacyAzerbaijaniSeeds = hadiths.some((h) => OLD_SEED_IDS.has(h.id));
  if (hasLegacyAzerbaijaniSeeds || (version ?? 0) < HADITH_SEED_VERSION) {
    return { hadiths: SEED_HADITHS, hadithSeedVersion: HADITH_SEED_VERSION };
  }
  return { hadiths, hadithSeedVersion: HADITH_SEED_VERSION };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      people: [],
      hadiths: SEED_HADITHS,
      records: [],
      hadithSeedVersion: HADITH_SEED_VERSION,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addPerson: (rawName) => {
        const name = rawName.trim().replace(/\s+/g, " ");
        if (!name) return { ok: false, error: "Ad boş ola bilməz." };
        const exists = get().people.some(
          (p) => p.name.localeCompare(name, "az", { sensitivity: "accent" }) === 0,
        );
        if (exists) return { ok: false, error: "Bu ad artıq siyahıdadır." };
        set({
          people: [
            ...get().people,
            { id: newId(), name, createdAt: Date.now() },
          ].sort((a, b) => a.name.localeCompare(b.name, "az")),
        });
        return { ok: true };
      },
      removePerson: (id) => {
        set({
          people: get().people.filter((p) => p.id !== id),
          records: get().records.filter((r) => r.personId !== id),
        });
      },
      addHadith: (rawText, rawSource) => {
        const text = rawText.trim();
        const source = rawSource.trim();
        if (!text) return { ok: false, error: "Hədis mətni boş ola bilməz." };
        set({
          hadiths: [
            ...get().hadiths,
            { id: newId(), text, source: source || "Əlavə olunub" },
          ],
        });
        return { ok: true };
      },
      removeHadith: (id) => {
        set({ hadiths: get().hadiths.filter((h) => h.id !== id) });
      },
      setAttendance: (personId, weekId, day, status) => {
        const rest = get().records.filter(
          (r) => !(r.personId === personId && r.weekId === weekId && r.day === day),
        );
        if (!status) {
          set({ records: rest });
          return;
        }
        set({ records: [...rest, { personId, weekId, day, status }] });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage,
      ),
      partialize: (state) => ({
        people: state.people,
        hadiths: state.hadiths,
        records: state.records,
        hadithSeedVersion: state.hadithSeedVersion,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const migrated = migrateHadiths(state.hadiths, state.hadithSeedVersion);
        state.hadiths = migrated.hadiths;
        state.hadithSeedVersion = migrated.hadithSeedVersion;
        state.setHasHydrated(true);
      },
    },
  ),
);

export function findRecord(
  records: AttendanceRecord[],
  personId: string,
  weekId: string,
  day: number,
): AttendanceRecord | undefined {
  return records.find(
    (r) => r.personId === personId && r.weekId === weekId && r.day === day,
  );
}

export type AbsenteeRank = {
  person: Person;
  unexcused: number;
  excused: number;
  present: number;
  absences: number;
};

export function rankAbsentees(
  people: Person[],
  records: AttendanceRecord[],
  weekId?: string,
): AbsenteeRank[] {
  const scoped = weekId ? records.filter((r) => r.weekId === weekId) : records;
  return people
    .map((person) => {
      const mine = scoped.filter((r) => r.personId === person.id);
      const unexcused = mine.filter((r) => r.status === "unexcused").length;
      const excused = mine.filter((r) => r.status === "excused").length;
      const present = mine.filter((r) => r.status === "present").length;
      return {
        person,
        unexcused,
        excused,
        present,
        absences: unexcused + excused,
      };
    })
    .sort(
      (a, b) =>
        b.unexcused - a.unexcused ||
        b.absences - a.absences ||
        a.person.name.localeCompare(b.person.name, "az"),
    );
}

export function currentWeekId(): string {
  return isoWeekId(new Date());
}

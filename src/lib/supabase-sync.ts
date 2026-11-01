import { supabase } from './supabase-client';
import type { Person, Hadith, AttendanceStatus, AttendanceRecord } from './store';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (id: string) => UUID_RE.test(id);

let meclisIdCache: string | null = null;
async function currentMeclisId(): Promise<string | null> {
  if (meclisIdCache) return meclisIdCache;
  const res = await supabase
    .from('meclis_qeydler')
    .select('id')
    .order('tarix', { ascending: false })
    .limit(1)
    .maybeSingle();
  meclisIdCache = res.data?.id ?? null;
  return meclisIdCache;
}

/** Seed hadiths into Supabase once when the table is empty. */
export async function seedHadithsIfEmpty(seed: Hadith[]): Promise<void> {
  const { count, error } = await supabase
    .from('meclis_hadisler')
    .select('id', { count: 'exact', head: true });
  if (error || (count ?? 0) > 0) return;
  const meclisId = await currentMeclisId();
  if (!meclisId) return;
  // Insert oldest-last so ordering by yaradildi keeps seed order stable.
  const rows = seed.map((h) => ({ meclis_id: meclisId, metn: h.text, menbe: h.source }));
  const ins = await supabase.from('meclis_hadisler').insert(rows);
  if (ins.error) console.error('[sync] hadis seed xətası:', ins.error.message);
}

export type SupabaseSnapshot = {
  people: Person[];
  hadiths: Hadith[];
  records: AttendanceRecord[];
};

export async function pullFromSupabase(): Promise<SupabaseSnapshot | null> {
  try {
    const [peopleRes, hadithRes, qiyabRes] = await Promise.all([
      supabase.from('meclis_ishtirakchilar').select('id, ad, yaradildi').order('ad'),
      supabase.from('meclis_hadisler').select('id, metn, menbe').order('yaradildi', { ascending: true }),
      supabase.from('meclis_qiyab_qeydleri').select('person_id, week_id, day, status'),
    ]);

    if (peopleRes.error || hadithRes.error || qiyabRes.error) {
      console.error('[sync] pull xetasi:',
        peopleRes.error?.message || hadithRes.error?.message || qiyabRes.error?.message);
      return null;
    }

    const people: Person[] = (peopleRes.data || []).map((r: any) => ({
      id: r.id,
      name: r.ad,
      createdAt: new Date(r.yaradildi).getTime(),
    }));
    const hadiths: Hadith[] = (hadithRes.data || []).map((r: any) => ({
      id: r.id,
      text: r.metn,
      source: r.menbe || '',
    }));
    const records: AttendanceRecord[] = (qiyabRes.data || []).map((r: any) => ({
      personId: r.person_id,
      weekId: r.week_id,
      day: r.day,
      status: r.status as AttendanceStatus,
    }));

    return { people, hadiths, records };
  } catch (err) {
    console.error('[sync] pull xetasi:', err);
    return null;
  }
}

export async function pushPerson(person: Person): Promise<{ remoteId: string } | null> {
  try {
    const meclisId = await currentMeclisId();
    if (!meclisId) {
      console.error('[sync] meclis tapılmadı');
      return null;
    }

    const insRes = await supabase
      .from('meclis_ishtirakchilar')
      .insert({
        ...(isUuid(person.id) ? { id: person.id } : {}),
        meclis_id: meclisId,
        ad: person.name,
        qiyab: 'var',
      })
      .select('id')
      .single();

    if (insRes.error) {
      console.error('[sync] pushPerson xetasi:', insRes.error.message);
      return null;
    }
    return insRes.data ? { remoteId: insRes.data.id } : null;
  } catch (err) {
    console.error('[sync] pushPerson xetasi:', err);
    return null;
  }
}

export async function deletePerson(id: string): Promise<void> {
  if (!isUuid(id)) return;
  try {
    const { error } = await supabase.from('meclis_ishtirakchilar').delete().eq('id', id);
    if (error) console.error('[sync] deletePerson xetasi:', error.message);
  } catch (err) {
    console.error('[sync] deletePerson xetasi:', err);
  }
}

export async function pushHadith(hadith: Hadith): Promise<{ remoteId: string } | null> {
  try {
    const meclisId = await currentMeclisId();
    if (!meclisId) return null;

    const insRes = await supabase
      .from('meclis_hadisler')
      .insert({
        ...(isUuid(hadith.id) ? { id: hadith.id } : {}),
        meclis_id: meclisId,
        metn: hadith.text,
        menbe: hadith.source,
      })
      .select('id')
      .single();

    if (insRes.error) {
      console.error('[sync] pushHadith xetasi:', insRes.error.message);
      return null;
    }
    return insRes.data ? { remoteId: insRes.data.id } : null;
  } catch (err) {
    console.error('[sync] pushHadith xetasi:', err);
    return null;
  }
}

export async function deleteHadith(id: string): Promise<void> {
  if (!isUuid(id)) return;
  try {
    const { error } = await supabase.from('meclis_hadisler').delete().eq('id', id);
    if (error) console.error('[sync] deleteHadith xetasi:', error.message);
  } catch (err) {
    console.error('[sync] deleteHadith xetasi:', err);
  }
}

export async function pushAttendance(
  personId: string,
  weekId: string,
  day: number,
  status: AttendanceStatus | null
): Promise<void> {
  if (!isUuid(personId)) return;
  try {
    if (status === null) {
      const { error } = await supabase
        .from('meclis_qiyab_qeydleri')
        .delete()
        .eq('person_id', personId)
        .eq('week_id', weekId)
        .eq('day', day);
      if (error) console.error('[sync] deleteAttendance xetasi:', error.message);
      return;
    }
    const { error } = await supabase
      .from('meclis_qiyab_qeydleri')
      .upsert(
        { person_id: personId, week_id: weekId, day, status },
        { onConflict: 'person_id,week_id,day' }
      );
    if (error) console.error('[sync] pushAttendance xetasi:', error.message);
  } catch (err) {
    console.error('[sync] pushAttendance xetasi:', err);
  }
}

export async function ensureInitialMeclis(): Promise<void> {
  try {
    const res = await supabase.from('meclis_qeydler').select('id').limit(1);

    if (res.error) {
      console.error('[sync] ensureInitialMeclis xetasi:', res.error.message);
      return;
    }
    if (!res.data || res.data.length === 0) {
      const today = new Date().toISOString().slice(0, 10);
      const ins = await supabase
        .from('meclis_qeydler')
        .insert({ tarix: today, movzu: 'İlk məclis' })
        .select('id')
        .single();
      if (ins.error) console.error('[sync] meclis yaratma xetasi:', ins.error.message);
      else meclisIdCache = ins.data.id;
    }
  } catch (err) {
    console.error('[sync] ensureInitialMeclis xetasi:', err);
  }
}

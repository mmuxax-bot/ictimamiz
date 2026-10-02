import { supabase } from './supabase-client';
import type { Person, Hadith, AttendanceStatus, AttendanceRecord } from './store';

export type SupabaseSnapshot = {
  people: Person[];
  hadiths: Hadith[];
  records: AttendanceRecord[];
};

export async function pullFromSupabase(): Promise<SupabaseSnapshot | null> {
  try {
    const [peopleRes, hadithRes, qiyabRes] = await Promise.all([
      supabase.from('meclis_ishtirakchilar').select('id, ad, yaradildi').order('ad'),
      supabase.from('meclis_hadisler').select('id, metn, menbe').order('yaradildi', { ascending: false }),
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
    const meclisRes = await supabase
      .from('meclis_qeydler')
      .select('id')
      .order('tarix', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!meclisRes.data) {
      console.error('[sync] meclis tapilmadi');
      return null;
    }

    const insRes = await supabase
      .from('meclis_ishtirakchilar')
      .insert({ meclis_id: meclisRes.data.id, ad: person.name, qiyab: 'var' })
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
  try {
    const { error } = await supabase.from('meclis_ishtirakchilar').delete().eq('id', id);
    if (error) console.error('[sync] deletePerson xetasi:', error.message);
  } catch (err) {
    console.error('[sync] deletePerson xetasi:', err);
  }
}

export async function pushHadith(hadith: Hadith): Promise<{ remoteId: string } | null> {
  try {
    const meclisRes = await supabase
      .from('meclis_qeydler')
      .select('id')
      .order('tarix', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!meclisRes.data) return null;

    const insRes = await supabase
      .from('meclis_hadisler')
      .insert({ meclis_id: meclisRes.data.id, metn: hadith.text, menbe: hadith.source })
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
        .insert({ tarix: today, movzu: 'Ilk meclis' });
      if (ins.error) console.error('[sync] meclis yaratma xetasi:', ins.error.message);
      else console.log('[sync] ilk meclis yaradildi');
    }
  } catch (err) {
    console.error('[sync] ensureInitialMeclis xetasi:', err);
  }
}

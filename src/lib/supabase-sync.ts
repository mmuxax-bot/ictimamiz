import { query } from './db-raw';
import type { Person, Hadith, AttendanceStatus, AttendanceRecord } from './store';

export type SupabaseSnapshot = {
  people: Person[];
  hadiths: Hadith[];
  records: AttendanceRecord[];
};

export async function pullFromSupabase(): Promise<SupabaseSnapshot | null> {
  try {
    const peopleRows = await query<{ id: string; ad: string; yaradildi: string }>(
      'SELECT id, ad, yaradildi FROM meclis_ishtirakchilar ORDER BY ad'
    );
    const hadithRows = await query<{ id: string; metn: string; menbe: string | null }>(
      'SELECT id, metn, menbe FROM meclis_hadisler ORDER BY yaradildi DESC'
    );
    const qiyabRows = await query<{
      person_id: string;
      week_id: string;
      day: number;
      status: AttendanceStatus;
    }>('SELECT person_id, week_id, day, status FROM meclis_qiyab_qeydleri');

    const people: Person[] = peopleRows.map((r) => ({
      id: r.id,
      name: r.ad,
      createdAt: new Date(r.yaradildi).getTime(),
    }));
    const hadiths: Hadith[] = hadithRows.map((r) => ({
      id: r.id,
      text: r.metn,
      source: r.menbe || '',
    }));
    const records: AttendanceRecord[] = qiyabRows.map((r) => ({
      personId: r.person_id,
      weekId: r.week_id,
      day: r.day,
      status: r.status,
    }));

    return { people, hadiths, records };
  } catch (err) {
    console.error('[sync] pull xetasi:', err);
    return null;
  }
}

export async function pushPerson(person: Person): Promise<void> {
  try {
    await query(
      "INSERT INTO meclis_ishtirakchilar (meclis_id, ad, qiyab) SELECT id, $1, 'var' FROM meclis_qeydler ORDER BY tarix DESC LIMIT 1",
      [person.name]
    );
  } catch (err) {
    console.error('[sync] pushPerson xetasi:', err);
  }
}

export async function deletePerson(id: string): Promise<void> {
  try {
    await query('DELETE FROM meclis_ishtirakchilar WHERE id = $1', [id]);
  } catch (err) {
    console.error('[sync] deletePerson xetasi:', err);
  }
}

export async function pushHadith(hadith: Hadith): Promise<void> {
  try {
    await query(
      "INSERT INTO meclis_hadisler (meclis_id, metn, menbe) SELECT id, $1, $2 FROM meclis_qeydler ORDER BY tarix DESC LIMIT 1",
      [hadith.text, hadith.source]
    );
  } catch (err) {
    console.error('[sync] pushHadith xetasi:', err);
  }
}

export async function deleteHadith(id: string): Promise<void> {
  try {
    await query('DELETE FROM meclis_hadisler WHERE id = $1', [id]);
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
      await query(
        'DELETE FROM meclis_qiyab_qeydleri WHERE person_id = $1 AND week_id = $2 AND day = $3',
        [personId, weekId, day]
      );
      return;
    }
    await query(
      'INSERT INTO meclis_qiyab_qeydleri (person_id, week_id, day, status) VALUES ($1, $2, $3, $4) ON CONFLICT (person_id, week_id, day) DO UPDATE SET status = $4, yenilendi = NOW()',
      [personId, weekId, day, status]
    );
  } catch (err) {
    console.error('[sync] pushAttendance xetasi:', err);
  }
}

export async function ensureInitialMeclis(): Promise<void> {
  try {
    const rows = await query<{ id: string }>('SELECT id FROM meclis_qeydler LIMIT 1');
    if (rows.length === 0) {
      const today = new Date().toISOString().slice(0, 10);
      await query('INSERT INTO meclis_qeydler (tarix, movzu) VALUES ($1, $2)', [
        today,
        'Ilk meclis',
      ]);
      console.log('[sync] ilk meclis yaradildi');
    }
  } catch (err) {
    console.error('[sync] ensureInitialMeclis xetasi:', err);
  }
}

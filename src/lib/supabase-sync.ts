import { query } from './db-raw';
import type { Person, Hadith, AttendanceStatus } from './store';

export type SupabaseSnapshot = {
  people: Person[];
  hadiths: Hadith[];
  records: [];
};

export async function pullFromSupabase(): Promise<SupabaseSnapshot | null> {
  try {
    const peopleRows = await query<{ id: string; ad: string; yaradildi: string }>(
      'SELECT id, ad, yaradildi FROM meclis_ishtirakchilar ORDER BY ad'
    );
    const hadithRows = await query<{ id: string; metn: string; menbe: string | null }>(
      'SELECT id, metn, menbe FROM meclis_hadisler ORDER BY yaradildi DESC'
    );
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
    return { people, hadiths, records: [] };
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
  status: AttendanceStatus | null
): Promise<void> {
  try {
    const qiyab =
      status === 'present'
        ? 'var'
        : status === 'excused'
          ? 'icaze'
          : status === 'unexcused'
            ? 'yox'
            : 'var';
    await query('UPDATE meclis_ishtirakchilar SET qiyab = $1 WHERE id = $2', [qiyab, personId]);
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

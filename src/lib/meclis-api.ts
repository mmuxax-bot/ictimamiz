import { query } from './db-raw';

export interface MeclisQeyd {
  id: string;
  tarix: string;
  movzu: string | null;
  qeyd: string | null;
}

export interface Ishtirakchi {
  id: string;
  meclis_id: string;
  ad: string;
  qiyab: 'var' | 'yox' | 'gec' | 'icaze';
  qeyd: string | null;
}

export interface Hadis {
  id: string;
  meclis_id: string;
  metn: string;
  menbe: string | null;
  movzu: string | null;
}

export async function getMeclisler(): Promise<MeclisQeyd[]> {
  return query<MeclisQeyd>(
    'SELECT * FROM meclis_qeydler ORDER BY tarix DESC LIMIT 100'
  );
}

export async function getMeclisById(id: string): Promise<MeclisQeyd | null> {
  const rows = await query<MeclisQeyd>(
    'SELECT * FROM meclis_qeydler WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function createMeclis(data: {
  tarix: string;
  movzu?: string;
  qeyd?: string;
}): Promise<MeclisQeyd> {
  const rows = await query<MeclisQeyd>(
    'INSERT INTO meclis_qeydler (tarix, movzu, qeyd) VALUES ($1, $2, $3) RETURNING *',
    [data.tarix, data.movzu || null, data.qeyd || null]
  );
  return rows[0];
}

export async function deleteMeclis(id: string): Promise<void> {
  await query('DELETE FROM meclis_qeydler WHERE id = $1', [id]);
}

export async function getIshtirakchilar(meclisId: string): Promise<Ishtirakchi[]> {
  return query<Ishtirakchi>(
    'SELECT * FROM meclis_ishtirakchilar WHERE meclis_id = $1 ORDER BY ad',
    [meclisId]
  );
}

export async function addIshtirakchi(data: {
  meclis_id: string;
  ad: string;
  qiyab: 'var' | 'yox' | 'gec' | 'icaze';
  qeyd?: string;
}): Promise<Ishtirakchi> {
  const rows = await query<Ishtirakchi>(
    'INSERT INTO meclis_ishtirakchilar (meclis_id, ad, qiyab, qeyd) VALUES ($1, $2, $3, $4) RETURNING *',
    [data.meclis_id, data.ad, data.qiyab, data.qeyd || null]
  );
  return rows[0];
}

export async function updateQiyab(
  id: string,
  qiyab: 'var' | 'yox' | 'gec' | 'icaze'
): Promise<void> {
  await query(
    'UPDATE meclis_ishtirakchilar SET qiyab = $1 WHERE id = $2',
    [qiyab, id]
  );
}

export async function deleteIshtirakchi(id: string): Promise<void> {
  await query('DELETE FROM meclis_ishtirakchilar WHERE id = $1', [id]);
}

export async function getHadisler(meclisId?: string): Promise<Hadis[]> {
  if (meclisId) {
    return query<Hadis>(
      'SELECT * FROM meclis_hadisler WHERE meclis_id = $1 ORDER BY yaradildi DESC',
      [meclisId]
    );
  }
  return query<Hadis>(
    'SELECT * FROM meclis_hadisler ORDER BY yaradildi DESC LIMIT 100'
  );
}

export async function addHadis(data: {
  meclis_id: string;
  metn: string;
  menbe?: string;
  movzu?: string;
}): Promise<Hadis> {
  const rows = await query<Hadis>(
    'INSERT INTO meclis_hadisler (meclis_id, metn, menbe, movzu) VALUES ($1, $2, $3, $4) RETURNING *',
    [data.meclis_id, data.metn, data.menbe || null, data.movzu || null]
  );
  return rows[0];
}

export async function deleteHadis(id: string): Promise<void> {
  await query('DELETE FROM meclis_hadisler WHERE id = $1', [id]);
}

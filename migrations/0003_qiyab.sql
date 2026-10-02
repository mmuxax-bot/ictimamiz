CREATE TABLE IF NOT EXISTS meclis_qiyab_qeydleri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES meclis_ishtirakchilar(id) ON DELETE CASCADE,
  week_id TEXT NOT NULL,
  day INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'excused', 'unexcused')),
  yaradildi TIMESTAMPTZ DEFAULT NOW(),
  yenilendi TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_id, week_id, day)
);
CREATE INDEX IF NOT EXISTS idx_qiyab_week ON meclis_qiyab_qeydleri(week_id);
CREATE INDEX IF NOT EXISTS idx_qiyab_person ON meclis_qiyab_qeydleri(person_id);

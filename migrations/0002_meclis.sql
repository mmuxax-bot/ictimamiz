CREATE TABLE IF NOT EXISTS meclis_qeydler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarix DATE NOT NULL,
  movzu TEXT,
  qeyd TEXT,
  yaradildi TIMESTAMPTZ DEFAULT NOW(),
  yenilendi TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meclis_ishtirakchilar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meclis_id UUID REFERENCES meclis_qeydler(id) ON DELETE CASCADE,
  ad TEXT NOT NULL,
  qiyab TEXT CHECK (qiyab IN ('var', 'yox', 'gec', 'icaze')),
  qeyd TEXT,
  yaradildi TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meclis_hadisler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meclis_id UUID REFERENCES meclis_qeydler(id) ON DELETE CASCADE,
  metn TEXT NOT NULL,
  menbe TEXT,
  movzu TEXT,
  yaradildi TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meclis_tarix ON meclis_qeydler(tarix DESC);
CREATE INDEX IF NOT EXISTS idx_ishtirak_meclis ON meclis_ishtirakchilar(meclis_id);
CREATE INDEX IF NOT EXISTS idx_hadis_meclis ON meclis_hadisler(meclis_id);

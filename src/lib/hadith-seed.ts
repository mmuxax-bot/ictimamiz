import { addHadis, getMeclisler } from './meclis-api';

const SEED_HADISLER = [
  {
    metn: 'Mominin qelbi Allahin evidir.',
    menbe: 'Hedis',
    movzu: 'Iman',
  },
  {
    metn: 'Elm oyrenmek her muselmana vacibdir.',
    menbe: 'Ibn Mace',
    movzu: 'Elm',
  },
  {
    metn: 'Sizin en yaxshiniz Qurani oyrenen ve oyredendir.',
    menbe: 'Buxari',
    movzu: 'Quran',
  },
  {
    metn: 'Temizlik imanin yarisidir.',
    menbe: 'Muslim',
    movzu: 'Temizlik',
  },
  {
    metn: 'Qonshusu acliq cheken kimsе bizden deyil.',
    menbe: 'Beyheqi',
    movzu: 'Qonshuluq',
  },
];

export async function seedHadislerIfEmpty(): Promise<{ seeded: boolean; count: number }> {
  const meclisler = await getMeclisler();

  if (meclisler.length === 0) {
    console.log('Hech bir meclis yoxdur, seed atlanir');
    return { seeded: false, count: 0 };
  }

  const ilkMeclis = meclisler[0];
  let added = 0;

  for (const h of SEED_HADISLER) {
    try {
      await addHadis({
        meclis_id: ilkMeclis.id,
        metn: h.metn,
        menbe: h.menbe,
        movzu: h.movzu,
      });
      added++;
    } catch (err) {
      console.error('Hadis elave xetasi:', err);
    }
  }

  console.log(added + ' hadis seed edildi');
  return { seeded: true, count: added };
}

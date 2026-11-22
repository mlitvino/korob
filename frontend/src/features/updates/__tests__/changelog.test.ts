import { CHANGELOG } from '../changelog';

describe('CHANGELOG', () => {
  it('has unique release ids, newest first', () => {
    const ids = CHANGELOG.map((release) => release.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...ids].sort().reverse());
  });

  it('gives every release a date and every feature a title and howTo', () => {
    expect(CHANGELOG.length).toBeGreaterThan(0);
    for (const release of CHANGELOG) {
      expect(Number.isNaN(new Date(release.date).getTime())).toBe(false);
      expect(release.features.length).toBeGreaterThan(0);
      for (const feature of release.features) {
        expect(feature.title.trim()).not.toBe('');
        expect(feature.howTo.trim()).not.toBe('');
      }
    }
  });
});

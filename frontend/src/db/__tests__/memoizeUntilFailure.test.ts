import { memoizeUntilFailure } from '../memoizeUntilFailure';

describe('memoizeUntilFailure', () => {
  it('runs once and shares the result while it succeeds', async () => {
    const run = jest.fn().mockResolvedValue(undefined);
    const once = memoizeUntilFailure(run);
    await Promise.all([once(), once()]);
    await once();
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('runs again after a failure instead of replaying the cached error', async () => {
    const run = jest.fn().mockRejectedValueOnce(new Error('disk full')).mockResolvedValue(
      undefined,
    );
    const once = memoizeUntilFailure(run);
    await expect(once()).rejects.toThrow('disk full');
    await expect(once()).resolves.toBeUndefined();
    expect(run).toHaveBeenCalledTimes(2);
  });
});

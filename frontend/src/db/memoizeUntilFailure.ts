/** Runs `run` once and shares its promise; a rejection is forgotten so the next call retries. */
export function memoizeUntilFailure(run: () => Promise<void>): () => Promise<void> {
  let pending: Promise<void> | null = null;
  return () => {
    pending ??= run().catch((error) => {
      pending = null;
      throw error;
    });
    return pending;
  };
}

/**
 * Utility to purge legacy and unnecessary database dumps from browser localStorage.
 * Only the active user session ('freelancehub_current_user') belongs in client storage.
 */
export function purgeUnnecessaryLocalStorage() {
  const UNNECESSARY_KEYS = [
    "freelancehub_freelancers",
    "freelancehub_users",
    "freelancehub_jobs",
    "freelancehub_proposals",
  ];

  UNNECESSARY_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore in restricted environments
    }
  });
}

// Auto-run immediately when loaded
purgeUnnecessaryLocalStorage();

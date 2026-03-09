// In-memory store: email -> last reset date (YYYY-MM-DD)
const resetStore = new Map<string, string>();

function todayDate(): string {
  return new Date().toISOString().split("T")[0]; // "2024-01-15"
}

export function canReset(email: string): boolean {
  const key = email.toLowerCase();
  const lastReset = resetStore.get(key);
  if (!lastReset) return true;
  return lastReset !== todayDate(); // allow if last reset was NOT today
}

export function markReset(email: string): void {
  resetStore.set(email.toLowerCase(), todayDate());
}

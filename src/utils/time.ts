export function formatTime(date: Date, fmt: '24h' | '12h', tz?: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: fmt === '12h',
    timeZone: tz,
  }).format(date);
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function tzAbbrev(tz: string, date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' });
  const parts = fmt.formatToParts(date).find(p => p.type === 'timeZoneName');
  return parts ? parts.value : tz;
}

export function clampToZero(ms: number): number {
  return ms < 0 ? 0 : ms;
}

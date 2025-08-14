export function openSessionWindow(sessionId: string): void {
  window.open('/garden?sessionId=' + encodeURIComponent(sessionId), '_blank', 'noopener,noreferrer');
}

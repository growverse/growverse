export function openSessionWindow(sessionId: string): void {
  window.open('/world?sessionId=' + encodeURIComponent(sessionId), '_blank', 'noopener,noreferrer');
}

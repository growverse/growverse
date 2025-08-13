// No React import needed for JSX in React 18+

export interface PortalUIProps {
  // No props needed - the portal system will access these elements directly via IDs
}

export function PortalUI(): JSX.Element {
  return (
    <>
      {/* Portal UI */}
      <div className="portal-ui" id="portalUI" role="dialog" aria-modal="true">
        <header>Teleport — başka bir garden seç</header>
        <div className="list" id="portalList"></div>
        <footer>
          <button className="btn" id="btnCancel">İptal (ESC)</button>
          <button className="btn primary" id="btnTeleport">Git</button>
        </footer>
      </div>
      
      {/* Portal hint */}
      <div className="hint" id="portalHint">
        Portala yaklaştın. Seçim paneli açıldı. Uzaklaşınca kapanır.
      </div>
      
      {/* Fade overlay for teleport */}
      <div className="fade" id="fade"></div>
    </>
  );
}

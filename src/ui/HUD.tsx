// No React import needed for JSX in React 18+

export interface HUDProps {
  // No props needed - the HUD content is updated directly via DOM manipulation
}

export function HUD(): JSX.Element {
  return (
    <div className="hud" id="hud">
      —
    </div>
  );
}

interface AlertBannerProps {
  message: string;
  onDismiss: () => void;
}

export function AlertBanner({ message, onDismiss }: AlertBannerProps): JSX.Element {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <p style={{ marginBottom: '1rem' }}>{message}</p>
        <button className="btn" type="button" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

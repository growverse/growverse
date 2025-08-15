import { AdminBotsPanel } from '../AdminBotsPanel';

type Props = {
  onBack: () => void;
};

export default function BotAvatarsView({ onBack }: Props): JSX.Element {
  return (
    <div className="bot-avatars-view">
      <div className="admin-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>Admin / Bot Avatars</h3>
      </div>
      <div className="admin-detail-content">
        <AdminBotsPanel />
      </div>
    </div>
  );
}

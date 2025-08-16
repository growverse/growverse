// No React import needed for JSX in React 18+
import { useLocalUser } from '@/state/userStore';

export function NameTag(): JSX.Element {
  const user = useLocalUser();
  return (
    <div className="name-tag" id="nameTag">
      {user.name}
    </div>
  );
}

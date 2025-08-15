import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { GraphicsQuality, UserPreferences } from '@/world/types';
import { useSignUp } from '../hooks/useSignUp';
import { ROLE_CATALOG, type Role } from '../constants/roles';
import type { CreateUserPayload } from '../api/users.client';

export function SignUpForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<Role>('learner');
  const [subRole, setSubRole] = useState<string>(
    ROLE_CATALOG['learner'].subRoles[0],
  );

  const [language, setLanguage] = useState('');
  const [timezone, setTimezone] = useState('');
  const [graphics, setGraphics] = useState<GraphicsQuality>('medium');
  const [audioVolume, setAudioVolume] = useState('');
  const [micEnabled, setMicEnabled] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);

  const { mutate, isSuccess, isError, error, isPending } = useSignUp();

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value as Role;
    setRole(nextRole);
    setSubRole(ROLE_CATALOG[nextRole].subRoles[0]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: CreateUserPayload = {
      email,
      username,
      role,
      subRole,
    };
    if (displayName) payload.displayName = displayName;

    const hasPrefs =
      language ||
      timezone ||
      graphics !== 'medium' ||
      audioVolume !== '' ||
      micEnabled ||
      !chatEnabled;

    if (hasPrefs) {
      const prefs: Partial<UserPreferences> = {};
      if (language) prefs.language = language;
      if (timezone) prefs.timezone = timezone;
      if (graphics !== 'medium') prefs.graphics = graphics;
      if (audioVolume !== '') prefs.audioVolume = Number(audioVolume);
      if (micEnabled) prefs.micEnabled = micEnabled;
      if (!chatEnabled) prefs.chatEnabled = chatEnabled;
      if (Object.keys(prefs).length > 0) payload.preferences = prefs;
    }

    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Display Name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Role
          <select value={role} onChange={handleRoleChange} required>
            {Object.keys(ROLE_CATALOG).map((r) => (
              <option key={r} value={r}>
                {ROLE_CATALOG[r as Role].label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Sub Role
          <select
            value={subRole}
            onChange={(e) => setSubRole(e.target.value)}
            required
          >
            {ROLE_CATALOG[role].subRoles.map((sr) => (
              <option key={sr} value={sr}>
                {sr}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Preferences (optional)</legend>
        <div>
          <label>
            Language
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Timezone
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Graphics
            <select
              value={graphics}
              onChange={(e) => setGraphics(e.target.value as GraphicsQuality)}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Audio Volume
            <input
              type="number"
              min="0"
              max="100"
              value={audioVolume}
              onChange={(e) => setAudioVolume(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={micEnabled}
              onChange={(e) => setMicEnabled(e.target.checked)}
            />
            Mic Enabled
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={chatEnabled}
              onChange={(e) => setChatEnabled(e.target.checked)}
            />
            Chat Enabled
          </label>
        </div>
      </fieldset>
      <button type="submit" disabled={isPending}>
        Sign Up
      </button>
      {isSuccess && <p role="alert">Account created!</p>}
      {isError && <p role="alert">{(error as Error)?.message ?? 'Error'}</p>}
    </form>
  );
}

import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { GraphicsQuality, UserPreferences } from '@/world/types';
import { useSignUp } from '../hooks/useSignUp';
import { ROLE_CATALOG, type Role } from '../constants/roles';
import type { CreateUserPayload } from '../api/users.client';
import { AlertBanner } from '@/components/AlertBanner';

export function SignUpForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState<Role>('learner');
  const [subRole, setSubRole] = useState<string>(ROLE_CATALOG['learner'].subRoles[0]);

  const [language, setLanguage] = useState('');
  const [timezone, setTimezone] = useState('');
  const [graphics, setGraphics] = useState<GraphicsQuality>('medium');
  const [audioVolume, setAudioVolume] = useState('');
  const [micEnabled, setMicEnabled] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);

  const { mutate, isSuccess, isError, error, isPending, reset } = useSignUp();

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
      password,
      passwordConfirmation,
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
    <form className="card" style={{ maxWidth: '480px', margin: '0 auto' }} onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className="form-grid">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="passwordConfirmation">Confirm Password</label>
        <input
          id="passwordConfirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />

        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={handleRoleChange} required>
          {Object.keys(ROLE_CATALOG).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label htmlFor="subRole">Sub Role</label>
        <select id="subRole" value={subRole} onChange={(e) => setSubRole(e.target.value)} required>
          {ROLE_CATALOG[role].subRoles.map((sr) => (
            <option key={sr} value={sr}>
              {sr}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend>Preferences (optional)</legend>
        <div className="form-grid">
          <label htmlFor="language">Language</label>
          <input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} />

          <label htmlFor="timezone">Timezone</label>
          <input id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />

          <label htmlFor="graphics">Graphics</label>
          <select
            id="graphics"
            value={graphics}
            onChange={(e) => setGraphics(e.target.value as GraphicsQuality)}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          <label htmlFor="audioVolume">Audio Volume</label>
          <input
            id="audioVolume"
            type="number"
            min="0"
            max="100"
            value={audioVolume}
            onChange={(e) => setAudioVolume(e.target.value)}
          />

          <label htmlFor="micEnabled" className="checkbox">
            <input
              id="micEnabled"
              type="checkbox"
              checked={micEnabled}
              onChange={(e) => setMicEnabled(e.target.checked)}
            />
            Mic Enabled
          </label>

          <label htmlFor="chatEnabled" className="checkbox">
            <input
              id="chatEnabled"
              type="checkbox"
              checked={chatEnabled}
              onChange={(e) => setChatEnabled(e.target.checked)}
            />
            Chat Enabled
          </label>
        </div>
      </fieldset>

      <button className="btn" type="submit" disabled={isPending}>
        Sign Up
      </button>
      {isSuccess && <p role="alert">Account created!</p>}
      {isError && <AlertBanner message={(error as Error)?.message ?? 'Error'} onDismiss={reset} />}
    </form>
  );
}

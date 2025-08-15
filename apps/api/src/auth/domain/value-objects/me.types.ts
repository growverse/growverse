export type Me = {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'admin' | 'instructor' | 'learner';
  subRole: string;
  status: 'active' | 'inactive' | 'banned';
  preferences?: {
    language: string;
    timezone: string;
    graphics: 'low' | 'medium' | 'high';
    audioVolume: number;
    micEnabled: boolean;
    chatEnabled: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
};

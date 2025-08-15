export const ROUTES = {
  users: '/users',
  user: (id: string) => `/users/${id}`,
  userPrefs: (id: string) => `/users/${id}/preferences`,
};

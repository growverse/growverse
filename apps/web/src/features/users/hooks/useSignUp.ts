import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type CreateUserPayload, type User } from '../api/users.client';

export function useSignUp() {
  const qc = useQueryClient();
  return useMutation<User, unknown, CreateUserPayload>({
    mutationFn: (payload) => usersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] }).catch(() => {});
    },
  });
}

import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSignUp } from '../useSignUp';
import { usersApi, type CreateUserPayload } from '../../api/users.client';

vi.mock('../../api/users.client', () => ({
  usersApi: {
    create: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('useSignUp', () => {
  it('calls usersApi.create with payload', async () => {
    const payload: CreateUserPayload = {
      email: 'a@b.c',
      username: 'alice',
      role: 'learner',
      subRole: 'pro',
    };
    const qc = new QueryClient();
    let mutateAsync: ReturnType<typeof useSignUp>['mutateAsync'];
    function Test() {
      const m = useSignUp();
      mutateAsync = m.mutateAsync;
      return null;
    }
    renderToString(createElement(QueryClientProvider, { client: qc }, createElement(Test)));
    await mutateAsync!(payload);
    expect(usersApi.create).toHaveBeenCalledWith(payload);
  });
});

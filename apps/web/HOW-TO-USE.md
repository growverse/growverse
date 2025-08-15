# API Core Usage

This app includes a lightweight HTTP client and world bridge for passing data from the React UI to the Three.js world.

## HttpClient

```ts
import { http } from '@/lib/api/http';

// GET
const user = await http.get<User>('/users/1');

// POST
await http.post('/users', { email: 'a@b.c' });
```

Errors throw `ApiError` with `status` and optional `data`.

## Query Client

The app is wrapped with a `QueryClientProvider`. You can use hooks from `@tanstack/react-query` anywhere in the component tree.

```ts
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/features/users/api/users.client';

function Profile({ id }: { id: string }) {
  const { data } = useQuery({ queryKey: ['user', id], queryFn: () => usersApi.get(id) });
  // ...
}
```

## World Bridge

`worldBridge` is a small event bus to share data with the Three.js world without coupling to React.

```ts
import { worldBridge } from '@/world/bridge/worldBridge';

// React side
worldBridge.user.set({ id: 'u1', role: 'learner', subRole: 'pro', preferences: {...} });

// Three world side
const user = worldBridge.user.get();
```

// No React import needed for JSX in React 18+
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from '@/app/App';
import './styles/global.css';
import './app/app.css';
import { AuthProvider } from '@/features/auth/hooks/useAuth';
import { queryClient } from '@/app/queryClient';

const appElement = document.getElementById('app');
if (!appElement) {
  throw new Error('App element not found');
}

const root = createRoot(appElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>,
);

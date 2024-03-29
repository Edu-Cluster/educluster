import '../styles/globals.scss';
import 'react-modern-drawer/dist/index.css';
import React from 'react';
import Header from '../components/Header/Header';
import { withTRPC } from '@trpc/next';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { Toaster } from 'react-hot-toast';
import superjson from 'superjson';
import type { AppProps } from 'next/app';
import type { AppRouter } from '../server/routers/app.routes';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000/';

    const links = [
      httpBatchLink({
        maxBatchSize: 10,
        url: `${url}/api/trpc`,
      }),
    ];

    if (typeof window !== 'undefined') {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        links: [
          httpBatchLink({
            url: '/api/trpc',
          }),
        ],
      };
    }

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      },

      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          };
        }
        return {};
      },

      links,
      transformer: superjson,

      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    };
  },
  ssr: true,
})(MyApp);

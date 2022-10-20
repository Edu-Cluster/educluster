import '../styles/globals.css';
import '../styles/app.scss';
import 'react-modern-drawer/dist/index.css';
import React from 'react';
import Header from '../components/Header/Header';
import { withTRPC } from '@trpc/next';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { Toaster } from 'react-hot-toast';
import superjson from 'superjson';
import type { AppProps } from 'next/app';
import type { AppRouter } from '../server/routers/app.routes';

// TODO add global popups: intro, settings, etc
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000/';

    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url: `${url}/api/trpc`,
      }),
    ];

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
  ssr: false,
})(MyApp);

import '../styles/globals.css';
import '../styles/app.scss';
import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import Header from '../client/components/Header';
import Footer from '../client/components/Footer';
import { withTRPC } from '@trpc/next';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { Toaster } from 'react-hot-toast';
import type { AppRouter } from '../server/routers/app.routes';
import superjson from 'superjson';

function MyApp({ Component, pageProps }: AppProps) {
  const [isSignedIn, setSignedIn] = useState(false);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header isSignedIn={isSignedIn} />
      <Component {...pageProps} />
      <Footer isSignedIn={isSignedIn} />
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

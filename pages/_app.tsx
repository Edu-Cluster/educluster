import '../styles/globals.scss';
import 'react-modern-drawer/dist/index.css';
import React, { useEffect } from 'react';
import Header from '../components/Header/Header';
import { withTRPC } from '@trpc/next';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { Toaster } from 'react-hot-toast';
import superjson from 'superjson';
import type { AppProps } from 'next/app';
import type { AppRouter } from '../server/routers/app.routes';
import io from 'socket.io-client';

export const SocketContext = React.createContext({});

function MyApp({ Component, pageProps }: AppProps) {
  const socket = io().connect();

  useEffect(() => {
    fetch('/api/socket').then(() => {
      socket.on('getNotification', (data) => {
        // TODO Lara: Mutation mit neuer Notification
      });
    });

    /*
    * socket.on('connect', () => {
      console.log('connected');
    });
    * */
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Component {...pageProps} />
    </SocketContext.Provider>
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

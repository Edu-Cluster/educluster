import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { withTRPC } from '@trpc/next';
import type { AppRouter } from '../server/routers/app.routes';
import superjson from 'superjson';
import { useState } from 'react';
import '../styles/app.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const [isSignedIn, setSignedIn] = useState(false);

  return (
    <>
      <Header isSignedIn={isSignedIn} />
      <Component {...pageProps} />
      <Footer isSignedIn={isSignedIn} />
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }): any {
    return {
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          };
        }
        return {};
      },
      transformer: superjson,
    };
  },
})(MyApp);

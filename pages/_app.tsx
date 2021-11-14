import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'next-auth/client';
import { useRouter } from 'next/router';
import client from '../apollo-client';
import AppLayout from '../components/AppLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const renderLayout =
    router.pathname === '/app' || router.pathname.startsWith('/app/');

  return (
    <ApolloProvider client={client}>
      <Provider session={pageProps.session}>
        {renderLayout ? (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </ApolloProvider>
  );
}
export default MyApp;

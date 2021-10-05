import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { Provider } from 'next-auth/client';
import { useRouter } from 'next/router';
import client from '../apollo-client';
import AppLayout from '../components/AppLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  console.log(router.pathname);

  const renderLayout =
    router.pathname === '/app' || router.pathname.startsWith('/app/');

  //@ts-ignore
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Provider session={pageProps.session}>
          {renderLayout ? (
            <AppLayout>
              <Box>
                <Component {...pageProps} />
              </Box>
            </AppLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </Provider>
      </ChakraProvider>
    </ApolloProvider>
  );
}
export default MyApp;

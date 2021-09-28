import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'next-auth/client';
import client from '../apollo-client';

function MyApp({ Component, pageProps }: AppProps) {

  //@ts-ignore
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Provider session={pageProps.session}>
          {getLayout(<Component {...pageProps} />)}
        </Provider>
      </ChakraProvider>
    </ApolloProvider>
  );
}
export default MyApp;

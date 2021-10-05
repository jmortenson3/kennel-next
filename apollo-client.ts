import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/client';

const gql_environments = {
  dev: 'https://5r89bux1ad.execute-api.us-east-1.amazonaws.com/',
  stg: 'https://wyjatae4p8.execute-api.us-east-1.amazonaws.com/',
};

const httpLink = createHttpLink({
  uri: gql_environments.dev,
});

const authLink = setContext(async (req, prevContext) => {
  // token seems to not be worth storing in localStorage since next-auth manages cookies
  // getSession pulls the session and includes the token
  // we set that token in the auth header here
  let token: any;
  const isBrowser = typeof window !== 'undefined';

  const session = await getSession(prevContext);

  if (session && session.accessToken) {
    console.log('-------------------------- authLink has token set in headers');
    token = session.accessToken;
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  }

  if (isBrowser) {
    console.log("FETCHING TOKEN IN LOCALSTORAGE");
    token = localStorage.getItem('token');
  }

  if (token && isBrowser) {
    console.log("SETTING TOKEN IN LOCALSTORAGE");
    localStorage.setItem('token', token);
  }
  
  console.log('going to return token to the apolloClient', token);

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

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
  let token: any;
  const isBrowser = typeof window !== 'undefined';

  const session = await getSession(prevContext);
  console.log('session inside authLink', session);

  if (session && session.accessToken) {
    token = session.accessToken;
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  }

  if (isBrowser) {
    token = localStorage.getItem('token');
  }

  if (!token) {
    const res = await fetch(`http://localhost:3000/api/auth/session`);
    if (res.ok) {
      const json = await res.json();
      console.log('json res', json);
      token = json.accessToken;
      if (isBrowser) {
        localStorage.setItem('token', token);
      }
    } else {
      console.log('no token');
    }
  }

  if (token && isBrowser) {
    localStorage.setItem('token', token);
  }
  
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

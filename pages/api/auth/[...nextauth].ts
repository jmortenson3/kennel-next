import NextAuth, { Account, Profile, Session, User } from 'next-auth';
import Providers from 'next-auth/providers';
import client from '../../../apollo-client';
import { gql } from '@apollo/client';

const PROVIDER_NAMES = {
  github: 'github',
  google: 'google',
  facebook: 'facebook',
};

export default NextAuth({
  events: {
    async signIn({ account, user, isNewUser }) {
      // console.log('-------------- signin event ------------------');
    },
    async createUser({ email, image, name }) {
      // console.log('-------------- createUser event ------------------');
    },
    async updateUser({ email, image, name }) {
      // console.log('-------------- updateUser event ------------------');
    },
    async linkAccount({ providerAccount, user }) {
      // console.log('-------------- linkAccount event ------------------');
    },
    async session(message: any) {
      // console.log('-------------- session event ------------------');
    },
    async signOut(message: any) {
      // console.log('-------------- signOut event ------------------');
      if (typeof window !== 'undefined') {
        // console.log('this is in the browser');
        localStorage.removeItem('token');
      } else {
        console.log('this is on the server');
      }
    },
    async error(message) {
      console.log(message);
      // console.log('-------------- error event ------------------');
    }
  },
  callbacks: {
    async signIn(user, account, profile) {
      // console.log('-------------- signin callback ------------------');
      // console.log({user, account, profile});
      if (account.provider === PROVIDER_NAMES.github) {
        return account.accessToken != null;
      }
      return false;
    },
    async redirect(url, baseUrl) {
      // console.log('-------------- redirect callback ------------------');
      // console.log({url, baseUrl});
      return baseUrl;
    },
    /**
     * 
     * @param session 
     * @param userOrToken 
     * @returns 
     */
    async session(session, userOrToken) {
      // console.log('-------------- session callback ------------------');
      // console.log({session, userOrToken});
      session.accessToken = userOrToken?.accessToken;
      return session;
    },
    /**
     *
     * This should only figure out how to get the token and passed it to the session
     * DO NOT CALL GraphQL queries from here if the query needs auth since the apollo client
     * sets tokens in the context method. Repeat: apollo client context runs for each query
     * 
     * What should be done here? Signup and signin ONLY
     * 
     * @param token Decrypted JSON web token (persisted from cookies?)
     * @param user From provider (only available on sign in)
     * @param account Provider account (only available on sign in)
     * @param profile Provider profile (only available on sign in)
     * @param isNewUser (only available on sign in, but relies on database configuration with next-auth)
     * @returns JWT that will be saved
     */
    async jwt(token, user, account, profile, isNewUser) {
      // console.log('-------------- jwt callback ------------------');
      // console.log({token, user, account, profile, isNewUser});

      const isSignInEvent = account && profile;

      if (!isSignInEvent) {
        return token;
      }

      // sign in event from here down
      let localUser: any = {};
      if (account.provider === PROVIDER_NAMES.github) {
        localUser = {
          email: profile?.email,
          avatar: profile?.avatar_url,
          name: profile?.name,
        };
      } else {
        console.log('SIGNIN unsupported login type, returning null token');
        return token;
      }

      // exchange provider token for a local token
      try {
        const { data: getUserData } = await client.query({
          query: gql`
            query Query($email: String!, $provider: String, $token: String!) {
              me(id: $email, provider: $provider, token: $token) {
                id
                email
                name
                avatar
                accessToken
              }
            }
          `,
          variables: {
            email: localUser.email,
            provider: 'github',
            token: account.accessToken,
          },
        });

        // console.log({getUserData});

        if (getUserData.me.id) {
          token.accessToken = getUserData.me.accessToken;
          console.log('SIGNIN returning token from me', token);
          return token;
        }
      } catch (err) {
        console.log('SIGNIN lookup user', err);
      }
      
      // create local user from provider profile
      try {
        const { data: createUserData } = await client.mutate({
          mutation: gql`
            mutation AddUserMutation(
              $email: String!
              $name: String
              $avatar: String
              $provider: String
              $token: String
            ) {
              addUser(email: $email, name: $name, avatar: $avatar, provider: $provider, token: $token) {
                id
                email
                name
                avatar
                accessToken
              }
            }
          `,
          variables: {
            email: localUser.email,
            name: localUser.name,
            avatar: localUser.avatar,
            provider: 'github',
            token: account?.accessToken,
          },
        });

        
        token.accessToken = createUserData.addUser.accessToken;
        console.log('SIGNIN returning token from addUser', token);
        return token;
      } catch (err) {
        console.log('SIGNIN create user', err);
        return token;
      }
    },
  },
  providers: [
    Providers.GitHub({
      clientId: '1cfbd9edc7b0d0eee6fb',
      clientSecret: '0a5f75c93986a7b791c5b353ddecbca228a47577',
      scope: 'read:user',
    }),
    Providers.Credentials({
      name: 'email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'ginny@woof.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          const { data: getUserData } = await client.query({
            query: gql`
              query Query($email: String!) {
                user(id: $email) {
                  id
                  email
                }
              }
            `,
            variables: {
              email: credentials.email,
            },
          });

          if (getUserData.id) {
            return getUserData;
          }
        } catch (err) {
          console.log('ERROR - user lookup failed');
          console.log(err);
        }

        try {
          const { data: createUserData } = await client.mutate({
            mutation: gql`
              mutation AddUserMutation($addUserEmail: String!) {
                addUser(email: $addUserEmail) {
                  id
                  email
                }
              }
            `,
            variables: {
              addUserEmail: credentials.email,
            },
          });

          if (createUserData.addUser.id) {
            return createUserData.addUser;
          } else {
            return null;
          }
        } catch (err) {
          console.log('ERROR - user create failed');
          console.log(err);
          return null;
        }
      },
    }),
  ],
});

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
      console.log('-------------- signin event ------------------');
    },
    async createUser({ email, image, name }) {
      console.log('-------------- createUser event ------------------');
    },
    async updateUser({ email, image, name }) {
      console.log('-------------- updateUser event ------------------');
    },
    async linkAccount({ providerAccount, user }) {
      console.log('-------------- linkAccount event ------------------');
    },
    async session(message: any) {
      console.log('-------------- session event ------------------');
    },
    async signOut(message: any) {
      console.log('-------------- signOut event ------------------');
      if (typeof window !== 'undefined') {
        console.log('this is in the browser');
        localStorage.removeItem('token');
      } else {
        console.log('this is on the server');
      }
    },
    async error(message) {
      console.log('-------------- error event ------------------');
    }
  },
  callbacks: {
    async signIn(user, account, profile) {
      console.log('-------------- signin callback ------------------');
      // console.log({user, account, profile});
      if (account.provider === PROVIDER_NAMES.github) {
        return account.accessToken != null;
      }
      return false;
    },
    async redirect(url, baseUrl) {
      console.log('-------------- redirect callback ------------------');
      // console.log({url, baseUrl});
      return baseUrl;
    },
    async session(session, userOrToken) {
      console.log('-------------- session callback ------------------');
      // console.log({session, userOrToken});
      session.accessToken = userOrToken?.accessToken;
      return session;
    },
    /**
     *
     * @param token Decrypted JSON web token
     * @param user From provider (only available on sign in)
     * @param account Provider account (only available on sign in)
     * @param profile Provider profile (only available on sign in)
     * @param isNewUser (only available on sign in, but relies on database configuration with next-auth)
     * @returns JWT that will be saved
     */
    async jwt(token, user, account, profile, isNewUser) {
      console.log('-------------- jwt callback ------------------');
      // console.log({token, user, account, profile, isNewUser});

      const isSignInEvent = account && profile;

      if (!isSignInEvent) {
        // console.log('not sign in event, returning token', token);
        return token;
      }

      let localUser: any = {};
      if (account.provider === PROVIDER_NAMES.github) {
        localUser = {
          email: profile?.email,
          avatar: profile?.avatar,
          name: profile?.name,
        };
      } else {
        return token;
      }

      // console.log(localUser);

      try {
        const { data: getUserData } = await client.query({
          query: gql`
            query Query($email: String!, $provider: String, $token: String!) {
              me(id: $email, provider: $provider, token: $token) {
                id
                email
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
          return token;
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const { data: createUserData } = await client.mutate({
          mutation: gql`
            mutation AddUserMutation(
              $email: String!
              $provider: String
              $token: String
            ) {
              addUser(email: $email, provider: $provider, token: $token) {
                id
                email
                accessToken
              }
            }
          `,
          variables: {
            email: localUser.email,
            provider: 'github',
            token: account?.accessToken,
          },
        });

        // console.log({createUserData});
        
        token.accessToken = createUserData.addUser.accessToken;
        return token;
      } catch (err) {
        console.log(err);
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
        console.log(credentials);
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

          console.log(createUserData);

          if (createUserData.addUser.id) {
            return createUserData.addUser;
          } else {
            console.log('returning null');
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

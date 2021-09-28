import { ReactElement } from 'react';
import { GridItem } from '@chakra-ui/react';
import { gql } from '@apollo/client';
import client from '../../apollo-client';
import AppLayout from '../../components/AppLayout';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

type Props = {
  user: {
    id: string;
    email: string;
    pets: any[];
  };
};

const Dashboard = ({user}: Props) => {
  return (
    <main>
      <h1>Heya {user.email}</h1>
    </main>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <GridItem bg='teal'>{page}</GridItem>
    </AppLayout>
  );
};


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  console.log('ssr props session', session);
  try {
    console.log('fethcing graphql me');
    const { data } = await client.query({
      query: gql`
        query Query {
          me {
            user {
              id
              email
              pets {
                id
                name
              }
            }
          }
        }
      `,
      context: ctx,
    });

    console.log('query results');
    console.log({data});

    return {
      props: {
        user: data.me?.user ?? {},
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        user: {},
      },
    };
  }
};


export default Dashboard;

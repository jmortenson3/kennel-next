import { gql } from '@apollo/client';
import client from '../../apollo-client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import {
  Heading,
  Link,
  HStack,
  Box,
  Text,
  Flex,
  Spacer,
  Center,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import PetCard from '../../components/PetCard';

type Props = {
  user: {
    id: string;
    email: string;
    name: string;
    pets: any[];
  };
};

const Dashboard = ({ user }: Props) => {
  return (
    <Box>
      <Heading>Heya {user.name}</Heading>
      <Box maxW='400px' p="24px 16px">
        <Flex>
          <Heading size="md">My pets</Heading>
          <Spacer />
          <Link href='/app/add-pet'>
            <Box bg='purple.500' borderRadius='50'>
              <Center p="6px">
                <AddIcon w={3} h={3} color='white' />
              </Center>
            </Box>
          </Link>
        </Flex>
        {user.pets && (
          <HStack align='left' p="24px 0">
            {user.pets.map((pet) => (
              <PetCard
                key={pet.id}
                id={pet.id}
                name={pet.name}
                birthdate={pet.birthdate}
                species={pet.species}
              />
            ))}
          </HStack>
        )}
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  try {
    const { data } = await client.query({
      query: gql`
        query Query {
          me {
            id
            email
            name
            pets {
              id
              name
              species
              birthdate
            }
          }
        }
      `,
      context: ctx,
    });

    console.log('got the user from me!', data.me);

    return {
      props: {
        user: data.me ?? {},
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

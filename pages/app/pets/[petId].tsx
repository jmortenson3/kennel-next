import { gql } from '@apollo/client';
import { useSession } from 'next-auth/client';
import client from '../../../apollo-client';

type Props = {
  id: string;
  name: string;
  species: string;
  birthdate: string;
};

const PetDetails = ({ id, name, species, birthdate }: Props) => {
  const [session, loading] = useSession();

  console.log({ event: 'update pet props', id, name, species, birthdate });

  return (
    <div className="flex">
      <div className="m-4">
        <h5>{name}</h5>
        <p>{species}</p>
        <p>{birthdate}</p>
      </div>
      <div className="m-4">
        <h5>Upcoming bookings for {name}</h5>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { petId } = context.params;

  const { data } = await client.query({
    query: gql`
      query Query($id: String!) {
        pet(id: $id) {
          id
          name
          species
          birthdate
        }
      }
    `,
    context,
    variables: {
      id: petId,
    },
  });
  return {
    props: {
      ...data.pet,
    },
  };
}

export default PetDetails;

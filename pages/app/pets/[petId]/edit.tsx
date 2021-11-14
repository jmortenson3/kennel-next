import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { useSession } from 'next-auth/client';
import client from '../../../../apollo-client';

type Props = {
  id: string;
  name: string;
  species: string;
  birthdate: string;
};

const UPDATE_PET = gql`
  mutation UpdatePetMutation(
    $name: String!
    $birthdate: String
    $species: String
  ) {
    addPet(name: $name, birthdate: $birthdate, species: $species) {
      id
      name
      birthdate
      species
    }
  }
`;

const UpdatePet = ({ id, name, species, birthdate }: Props) => {
  const [session, loading] = useSession();
  const [updatePet, { data }] = useMutation(UPDATE_PET);

  console.log({ event: 'update pet props', id, name, species, birthdate });

  return (
    <Formik
      initialValues={{ species, name, birthdate }}
      onSubmit={async (values, actions) => {
        console.log('update pet');
        console.log({ values });
        await updatePet({
          variables: {
            name: values.name,
            species: values.species,
            birthdate: values.birthdate,
          },
        });
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className='flex flex-col max-w-lg items-center '>
          <div role='group'>
            <label htmlFor='species'>
              Species?
              <label>
                <Field type='radio' name='species' value='dog' />
                Dog 🐕‍🦺
              </label>
              <label>
                <Field type='radio' name='species' value='cat' />
                Cat 🐈
              </label>
            </label>
          </div>

          <label htmlFor='name'>
            What's your pets name?
            <Field
              name='name'
              type='text'
              placeholder='Fido'
              className='bg-gray-200 rounded-md p-1'
            />
          </label>

          <label htmlFor='birthdate'>
            Pet's birthdate 🎂
            <Field name='birthdate' type='date' />
          </label>
          <div>
            <button
              className='bg-green-500 text-white px-3 py-1 rounded-md'
              disabled={isSubmitting}
              type='submit'
            >
              Save
            </button>
            <a href='/app' className='bg-gray-200 px-3 py-1 rounded-md'>
              Cancel
            </a>
          </div>
        </Form>
      )}
    </Formik>
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

export default UpdatePet;

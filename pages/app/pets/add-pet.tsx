import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { useSession } from 'next-auth/client';

const ADD_PET = gql`
  mutation AddPetMutation(
    $addPetName: String!
    $addPetUserOwnerId: String!
    $addPetBirthdate: String
    $addPetSpecies: String
  ) {
    addPet(
      name: $addPetName
      userOwnerId: $addPetUserOwnerId
      birthdate: $addPetBirthdate
      species: $addPetSpecies
    ) {
      id
      name
      birthdate
      species
    }
  }
`;

const AddPet = () => {
  const [session, loading] = useSession();
  const [addPet, { data }] = useMutation(ADD_PET);

  const ownerId = session?.user?.email;

  console.log(session);
  const validateName = (value: string) => {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  };

  return (
    <Formik
      initialValues={{ species: '', name: '', birthdate: '' }}
      onSubmit={async (values, actions) => {
        console.log('add pet');
        console.log({ values });
        await addPet({
          variables: {
            addPetName: values.name,
            addPetSpecies: values.species,
            addPetBirthdate: values.birthdate,
            addPetUserOwnerId: ownerId,
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
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

          <button
            className='bg-green-500'
            disabled={isSubmitting}
            type='submit'
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddPet;

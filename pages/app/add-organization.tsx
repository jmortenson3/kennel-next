import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { useSession } from 'next-auth/client';

const ADD_ORGANIZATION = gql`
  mutation AddOrganizationMutation(
    $addOrganizationName: String!
    $addOrganizationUserOwnerId: String!
  ) {
    addOrganization(
      name: $addOrganizationName
      userOwnerId: $addOrganizationUserOwnerId
    ) {
      id
      name
    }
  }
`;

const AddOrganization = () => {
  const [session, loading] = useSession();
  const [addOrganization, { data }] = useMutation(ADD_ORGANIZATION);

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
      initialValues={{ name: '' }}
      onSubmit={async (values, actions) => {
        console.log('add Organization');
        console.log({ values });
        await addOrganization({
          variables: {
            addOrganizationName: values.name,
            addOrganizationUserOwnerId: ownerId,
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor='name'>
            Organization name
            <Field name='name' validate={validateName} className='bg-gray-100 rounded-sm p-1' />
          </label>
          <div>
            <button disabled={isSubmitting} type='submit'>
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddOrganization;

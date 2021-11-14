import { gql, useMutation } from '@apollo/client';
import client from '../../../../apollo-client';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type Props = {
  org: {
    id: string;
    name: string;
    organizationLocations: {
      id: string;
      name: string;
    }[];
  };
};

const ADD_LOCATION = gql`
  mutation AddLocationMutation(
    $addLocationName: String!
    $addLocationOrgOwnerId: String!
  ) {
    addLocation(name: $addLocationName, orgOwnerId: $addLocationOrgOwnerId) {
      id
      name
    }
  }
`;

const AddLocation = ({ org }: Props) => {
  const [addLocation, { data }] = useMutation(ADD_LOCATION);

  console.log({ org });

  const validateName = (value: string) => {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  };

  return (
    <div>
      <Formik
        initialValues={{ name: '' }}
        onSubmit={async (values, actions) => {
          console.log({ values });
          await addLocation({
            variables: {
              addLocationName: values.name,
              addLocationOrgOwnerId: org.id,
            },
          });
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <label htmlFor='name'>Location name</label>
            <Field type='text' name='name' placeholder='613 Vine St Kennel' />
            <ErrorMessage name='name' component='div'/>
            <button disabled={isSubmitting} type='submit'>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export async function getServerSideProps(context: any) {
  const { orgId } = context.params;

  const { data } = await client.query({
    query: gql`
      query Query($id: String) {
        organization(id: $id) {
          id
          name
          organizationLocations {
            id
            name
          }
        }
      }
    `,
    context,
    variables: {
      id: orgId,
    },
  });

  return {
    props: {
      org: data.organization,
    },
  };
}

export default AddLocation;

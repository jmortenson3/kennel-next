import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import client from '../../apollo-client';

type Props = {
  user: {
    id: string;
    email: string;
    name: string;
    userPets: {
      id: string;
      name: string;
      species: string;
      birthdate: string;
    }[];
  };
  organization: {
    id: string;
    name: string;
    organizationLocations: {
      id: string;
      name: string;
    }[];
  };
};

const ADD_BOOKING = gql`
  mutation AddBookingMutation(
    $bookingDetails: [CreateBookingDetailsInput]
    $dropOffAt: String
    $locationOwnerId: String
    $orgOwnerId: String
    $pickUpAt: String
    $userOwnerId: String
  ) {
    addBooking(
      bookingDetails: $bookingDetails
      dropOffAt: $dropOffAt
      locationOwnerId: $locationOwnerId
      orgOwnerId: $orgOwnerId
      pickUpAt: $pickUpAt
      userOwnerId: $userOwnerId
    ) {
      success
      message
    }
  }
`;

const AddBooking = ({ user, organization }: Props) => {
  const [session, loading] = useSession();
  const [addBooking, { data }] = useMutation(ADD_BOOKING);
  const router = useRouter();

  const { orgId, locId } = router.query;

  const ownerId = session?.user?.email;

  return (
    <Formik
      initialValues={{
        dropOffAt: '',
        pickUpAt: '',
        orgOwnerId: orgId,
        orgName: organization.name,
        locationOwnerId:
          organization.organizationLocations.filter((x) => x.id === locId)[0]
            .id ?? '',
        userOwnerId: user.id,
        pets: [],
      }}
      onSubmit={async (values, actions) => {
        const bookingDetails = values.pets?.map((petId) => ({ petId }));
        try {
          await addBooking({
            variables: {
              bookingDetails,
              dropOffAt: values.dropOffAt,
              locationOwnerId: values.locationOwnerId,
              orgOwnerId: values.orgOwnerId,
              pickUpAt: values.pickUpAt,
              userOwnerId: values.userOwnerId,
            },
          });
        } catch (err) {
          console.error(err);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor='orgName'>
            Organization name
            <Field name='orgName' type='text' />
          </label>

          <label htmlFor='locationOwnerId'>
            Location
            <Field name='locationOwnerId' />
          </label>

          <label htmlFor='dropOffAt'>
            Drop off at
            <Field name='dropOffAt' type='date' />
          </label>

          <label htmlFor='pickUpAt'>
            Pick up at
            <Field name='pickUpAt' type='date' />
          </label>

          <label htmlFor='pets'>
            Who's going?
            <Field name='pets' component='select' multiple={true}>
              {user.userPets.map((pet) => (
                <option value={pet.id}>{pet.name}</option>
              ))}
            </Field>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  try {
    const { data } = await client.query({
      query: gql`
        query Query($organizationId: String!) {
          me {
            id
            email
            name
            userPets {
              id
              name
              species
              birthdate
            }
          }
          organization(id: $organizationId) {
            id
            name
            organizationLocations {
              id
              name
            }
          }
        }
      `,
      context: ctx,
      variables: {
        organizationId: ctx.query.orgId,
      },
    });

    console.log('got the user from me!', data.me);

    return {
      props: {
        user: data.me ?? {},
        organization: data.organization ?? {},
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

export default AddBooking;

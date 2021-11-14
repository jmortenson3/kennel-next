import { gql } from '@apollo/client';
import client from '../../../apollo-client';
import BookingTable from '../../../components/BookingTable';

type Props = {
  org: {
    id: string;
    name: string;
    organizationLocations: {
      id: string;
      name: string;
    }[];
    organizationBookings: {
      id: string;
      dropOffAt: string;
      pickUpAt: string;
      status: string;
      bookingDetails: {
        id: string;
        bookingDetailsPet: {
          id: string;
          name: string;
        }
      }[];
      bookingOrganization: {
        id: string;
        name: string;
      };
      bookingLocation: {
        id: string;
        name: string;
      };
    }[];
  };
};

const OrgDashboard = ({ org }: Props) => {
  console.log({ org });
  return (
    <div>
    <h3>You're in org {org?.name}</h3>
      <div className="p-6">
        <h4 className="text-4xl">Bookings</h4>
        {org?.organizationBookings && org.organizationBookings.length > 0 && (
          <BookingTable bookings={org.organizationBookings} />
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { orgId } = context.params;

  const { data } = await client.query({
    query: gql`
      query Query($id: String!) {
        organization(id: $id) {
          id
          name
          organizationLocations {
            id
            name
          }
          organizationBookings {
            id
            pickUpAt
            dropOffAt
            status
            bookingDetails {
              id
              bookingDetailsPet {
                id
                name
              }
            }
            bookingOrganization {
              id
              name
            }
            bookingLocation {
              id
              name
            }
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

export default OrgDashboard;

import { gql } from '@apollo/client';
import client from '../../../../apollo-client';

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

const LocationDashboard = ({ org }: Props) => {
  return (
    <div>
      <h3>You're in org {org?.name}</h3>
      <div className="flex">
        <div>
        </div>
        <div>
          <h4>Bookings</h4>
        </div>
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
        }
      }
    `,
    context,
    variables: {
      id: orgId,
    },
  });
  console.log({ data });
  return {
    props: {
      org: data.organization,
    },
  };
}

export default LocationDashboard;

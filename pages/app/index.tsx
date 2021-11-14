import { gql } from '@apollo/client';
import client from '../../apollo-client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import PetCard from '../../components/PetCard';

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
    userBookings: {
      id: string;
      dropOffAt: string;
      pickUpAt: string;
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

const Dashboard = ({ user }: Props) => {
  return (
    <div>
      <h1>Heya {user.name}</h1>
      <div className="max-w-md pt-6 pb-4">
        <div className="flex">
          <h1>My pets</h1>
          <a href='/app/pets/add-pet'>
            <div className="bg-purple-500 rounded-full">
              <div className="p-2">
                +
              </div>
            </div>
          </a>
        </div>
        {user.userPets && (
          <div className="flex">
            {user.userPets.map((pet) => (
              <PetCard
                key={pet.id}
                id={pet.id}
                name={pet.name}
                birthdate={pet.birthdate}
                species={pet.species}
              />
            ))}
          </div>
        )}
        {user.userBookings && (
          <div className="flex px-4">
            {user.userBookings.map((booking) => (
              <div className="shadow-md p-6" key={booking.id}>
                <h4>{booking.dropOffAt ?? '?'} - {booking.pickUpAt ?? '?'}</h4>
                <p className="font-bold">Who?</p>
                <p>
                {booking.bookingDetails && (booking.bookingDetails.map(bd => (
                  bd.bookingDetailsPet.name
                ))).join(', ')}
                </p>
                <p className="font-bold">Where?</p><p>Reserved with {booking.bookingOrganization?.name}</p>
                <p>At {booking.bookingLocation?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
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
            userPets {
              id
              name
              species
              birthdate
            }
            userMemberships {
              id
              membershipOrganization {
                id
                name
              }
            }
            userBookings {
              id
              dropOffAt
              pickUpAt
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
      context: ctx,
    });

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

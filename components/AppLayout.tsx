import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import AppNav from './AppNav';

type Props = {
  children: any;
};

const GET_ME = gql`
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
    }
  }
`;

const AppLayout = ({ children }: Props) => {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_ME);

  const pathItems = router.asPath.split('/').slice(1);
  const breadCrumbs: { relativePath: string; pathItem: string }[] =
    pathItems.map((pathItem, i, arr) => {
      return {
        relativePath: `/${arr.slice(0, i + 1).join('/')}`,
        pathItem: i === 0 ? 'home' : pathItem, // rename app to home
      };
    });
  return (
    <div className='grid grid-cols-appLayout grid-rows-appLayout h-screen relative'>
      <div className='col-span-1 row-span-2'>
        <AppNav me={data?.me} />
      </div>
      <div className='row-span-1'>
        {breadCrumbs.map((bc) => (
          <a
            className='text-2xl cursor-pointer hover:underline'
            href={bc.relativePath}
          >
            {'/' + bc.pathItem}
          </a>
        ))}
      </div>
      <div className='overflow-y-scroll row-span-1'>{children}</div>
    </div>
  );
};

export default AppLayout;

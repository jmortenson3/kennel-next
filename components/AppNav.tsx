import Profile from './Profile';

type Props = {
  me: {
    id: string;
    email: string;
    name: string;
    userPets: [
      {
        id: string;
        name: string;
        species: string;
        birthdate: string;
      }
    ];
    userMemberships: [
      {
        id: string;
        membershipOrganization: {
          id: string;
          name: string;
        };
      }
    ];
  };
};

const AppNav = ({ me }: Props) => {
  const organizations =
    me?.userMemberships?.length > 0 &&
    me?.userMemberships.map((membership) => {
      return membership.membershipOrganization;
    });

  console.log(organizations);

  return (
    <div className='flex flex-col h-full pt-4 pb-4 bg-green-900'>
      <h6 className='text-gray-100 uppercase text-xs font-bold'>
        Organizations
        <span className="p-2 bg-blue-500 rounded-full"><a href='/app/add-organization'>+</a></span>
      </h6>
      {organizations &&
        organizations.map(
          (organization: any) =>
            organization?.id && (
              <a
                className='text-white'
                key={organization.id}
                href={`/app/org/${organization.id}`}
              >
                {organization.name}
              </a>
            )
        )}
      <div className="flex-grow"></div>
      <div>
        <Profile />
      </div>
    </div>
  );
};

export default AppNav;

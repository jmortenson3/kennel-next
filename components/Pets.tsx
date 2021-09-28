import { useQuery, gql } from '@apollo/client';

const QUERY = gql`
  query Query($email: String!) {
    user(id: $email) {
      id
      email
      pets {
        id
        name
      }
    }
  }
`;

export default function Pets() {
  const { data, loading, error } = useQuery(QUERY, {
    variables: { email: 'josiah.mortenson@gmail.com' },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  const user = data.user;

  return <p>{JSON.stringify(user)}</p>;
}

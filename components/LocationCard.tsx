type Props = {
  id: string;
  orgId: string;
  name: string;
};

export default function LocationCard({ id, orgId, name }: Props) {

  return (
    <div className="shadow-xl p-16 min-w-200">
      <h4>{name}</h4>
      <p>Give this link to your users to schedule a booking for this location:<br/>
        {`http://localhost:3000/app/add-booking?orgId=${orgId}&locId=${id}`}</p>
        <a href={`http://localhost:3000/app/add-booking?orgId=${orgId}&locId=${id}`}>Click here to see for yourself 💨!</a>
    </div>
  );
}

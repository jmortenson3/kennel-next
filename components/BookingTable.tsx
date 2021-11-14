
type Props = {
  bookings: {
    id: string;
    status: string;
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
}

const BookingTable = ({ bookings }: Props) => {

  return (
    <table className="table-fixed border-2">
      <thead>
        <tr>
          <td>Booking no.</td>
          <td>Status</td>
          <td>Drop off at</td>
          <td>Pick up at</td>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody className="">
        {bookings && bookings.length > 0 && bookings.map((b, i) => (
        <tr className={i % 2 == 0 ? 'bg-gray-100' : ''}>
          <td>{b.id}</td>
          <td>{b.status}</td>
          <td>{b.dropOffAt}</td>
          <td>{b.pickUpAt}</td>
          <td>Check in</td>
          <td>Check out</td>
        </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BookingTable;
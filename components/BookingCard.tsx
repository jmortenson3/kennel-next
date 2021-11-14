
type Props = {
  booking: {
    pickUpAt: string;
    dropOffAt: string;
    bookingDetails: {
      bookingDetailsPet: {
        id: string;
        name: string;
      };
    }[];
    bookingOrganization: {
      id: string;
      name: string;
    };
    bookingLocation: {
      id: string;
      name: string;
    };
  };
};

export default function BookingCard({ booking }: Props) {
  return (
    <div className="shadow-md w-full px-24 pt-12">
      <h4>
        {booking.bookingDetails &&
          booking.bookingDetails
            .map((bd) => bd.bookingDetailsPet.name)
            .join(', ')}
      </h4>
      <p>
        {booking.dropOffAt ?? '?'} - {booking.pickUpAt ?? '?'}
      </p>
      <p>
        {booking.bookingOrganization?.name} - {booking.bookingLocation?.name}
      </p>
    </div>
  );
}

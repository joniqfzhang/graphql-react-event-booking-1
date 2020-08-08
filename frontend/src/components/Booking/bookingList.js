import React from 'react';
import './bookingList.css';

const bookingList = (props) => (
  <ul className='bookings__list'>
    {props.bookings.map((booking) => {
      return (
        <li key={booking._id} className='bookings__item'>
          <div className='bookings__item-data'>
            {booking.event.title}-${booking.event.price} -{' '}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className='bookings__item-action'>
            <button
              className='btn'
              onClick={props.deleteBooking.bind(this, booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default bookingList;

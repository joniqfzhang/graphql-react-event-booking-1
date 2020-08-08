import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth-context';
import Spinner from '../components/Spinner/spinner';
import BookingList from '../components/Booking/bookingList';
import BookingChart from '../components/Booking/bookingChart';
import BookingsControls from '../components/Booking/bookingsControls';

function Bookings() {
  const context = useContext(AuthContext);
  const token = context.state.token;
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState('list');
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
              bookings {
                _id
                createdAt
                updatedAt
                event{
                  _id
                  title
                  description
                  date
                  price
                }
              }
            }
          `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        // console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        //console.log('resData', resData.data);
        setBookings(resData.data.bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const deleteBookingHander = (bookingId) => {
    setIsLoading(true);
    // const requestBody = {
    //   query: `
    //     mutation {
    //       cancelBooking (bookingId: "${bookingId}") {
    //           _id
    //           title
    //           description
    //           date
    //         }
    //       }
    //     `,
    // };

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking (bookingId: $id) {
              _id
              title
              description
              date
            }
          }
        `,
      variavles: {
        id: bookingId,
      },
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        // console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log('resData', resData.data);
        const updatedBookings = bookings.filter(
          (booking) => booking._id !== bookingId
        );
        setBookings(updatedBookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const outputTypeChangeHandler = (outputType) => {
    if (outputType === 'list') {
      setOutputType('list');
    } else {
      setOutputType('chart');
    }
  };

  // let content = <Spinner />;
  // if (!isLoading) {
  const content = (
    <>
      <BookingsControls
        activeOutputType={outputType}
        onChange={outputTypeChangeHandler}
      />
      {/* <div>
        <button onClick={outputTypeChangeHandler.bind(this, 'list')}>
          List
        </button>
        <button onClick={outputTypeChangeHandler.bind(this, 'chart')}>
          Chart
        </button>
      </div> */}
      <div>
        {outputType === 'list' ? (
          <BookingList
            bookings={bookings}
            deleteBooking={deleteBookingHander}
            onChange={outputTypeChangeHandler}
          />
        ) : (
          <BookingChart
            bookings={bookings}
            onChange={outputTypeChangeHandler}
          />
        )}
      </div>
    </>
  );
  // }
  //return <>{content}</>;
  return <>{isLoading ? <Spinner /> : content}</>;
}

export default Bookings;

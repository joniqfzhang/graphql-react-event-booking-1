import React, { useState, useReducer, useContext, useEffect } from 'react';
import './events.css';
import Modal from '../components/Modal/modal';
import Backdrop from '../components/Backdrop/backdrop';
import { AuthContext } from '../context/auth-context';
import EventList from '../components/Events/eventList';
import Spinner from '../components/Spinner/spinner';

function Events() {
  const context = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetchEvents();
  }, []);

  //console.log('events', events);
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const startCreateEventHandler = () => {
    setCreating(true);
  };
  const token = context.state.token;
  console.log('token:', token);

  const initalState = {
    title: '',
    price: '',
    date: '',
    description: '',
  };
  const reducer = (state, { field, value }) => {
    return {
      ...state,
      [field]: value,
    };
  };
  let [state, dispatch] = useReducer(reducer, initalState);
  const onChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
  };
  //state = { ...state, price: parseInt(state.price) };
  const { title, price, date, description } = state;

  const modalConfirmHandler = () => {
    setCreating(false);
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = { title, price, date, description };
    //console.log(event);
    const requestBody = {
      query: `
          mutation {
              createEvent(eventInput: {title:"${title}", description:"${description}", price:${price}, date:"${date}"}) {
                _id
                title
                description
                price
                date
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
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log('resData', resData);
        //fetchEvents();
        const updatedEvents = [...events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          price: resData.data.createEvent.price,
          date: resData.data.createEvent.date,
          creator: {
            _id: context.state.userId,
          },
        });
        setEvents(updatedEvents);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const viewDetailHandler = (eventId) => {
    const selectedEvent = events.find((event) => event._id === eventId);
    setSelectedEvent(selectedEvent);
  };

  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
              _id
              createdAt
              updatedAt
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
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log('resData', resData.data);
        setSelectedEvent(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
              events {
                _id
                title
                description
                price
                date
                creator{
                  _id
                  email
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
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log('resData', resData.data);
        setEvents(resData.data.events);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title='Add Event'
          canCancel
          canConfirm
          onCancle={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText='Confirm'>
          <form>
            <div className='form-control'>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                id='title'
                name='title'
                value={title}
                onChange={onChange}></input>
            </div>
            <div className='form-control'>
              <label htmlFor='price'>Price</label>
              <input
                type='namber'
                id='price'
                name='price'
                value={price}
                onChange={onChange}></input>
            </div>
            <div className='form-control'>
              <label htmlFor='date'>Date</label>
              <input
                type='datetime-local'
                id='date'
                name='date'
                value={date}
                onChange={onChange}></input>
            </div>
            <div className='form-control'>
              <label htmlFor='description'>Description</label>
              <textarea
                id='description'
                name='description'
                value={description}
                row='4'
                onChange={onChange}></textarea>
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancle={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={token ? 'Book' : 'Confirm'}>
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {context.state.token && (
        <div className='events-control'>
          <p>Share your own Events!</p>
          <button className='btn' onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          eventList={events}
          authUserId={context.state.userId}
          onViewDetail={viewDetailHandler}
        />
      )}
    </>
  );
}

export default Events;

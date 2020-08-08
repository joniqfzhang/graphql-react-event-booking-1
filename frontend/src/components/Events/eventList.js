import React from 'react';
import './eventList.css';
import EventItem from './eventItem';

const eventList = (props) => {
  //console.log(props.eventList);
  const events = props.eventList.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        eventTitle={event.title}
        eventDescription={event.description}
        eventPrice={event.price}
        eventDate={event.date}
        userId={props.authUserId}
        creatorId={event.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <>{<ul className='event__list'>{events}</ul>}</>;
};

export default eventList;

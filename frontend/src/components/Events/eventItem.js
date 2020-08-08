import React from 'react';
import './eventItem.css';
const eventItem = (props) => {
  const {
    eventId,
    eventTitle,
    eventDescription,
    eventPrice,
    eventDate,
    userId,
    creatorId,
    onDetail,
  } = props;
  return (
    <>
      <li className='event__list-item'>
        <div>
          <h1>{eventTitle}</h1>
          <h2>
            ${eventPrice} - {new Date(eventDate).toLocaleDateString()}
          </h2>
        </div>
        <div>
          {userId === creatorId ? (
            <p>You are the owner of the event.</p>
          ) : (
            <button className='btn' onClick={onDetail.bind(this, eventId)}>
              View Details
            </button>
          )}
        </div>
      </li>
    </>
  );
};

export default eventItem;

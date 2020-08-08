import React from 'react';
import './bookingsControls.css';

const bookingsControl = (props) => {
  return (
    <div className='bookings-control'>
      <button
        onClick={props.onChange.bind(this, 'list')}
        className={props.activeOutputType === 'list' ? 'active' : ''}>
        List
      </button>
      <button
        onClick={props.onChange.bind(this, 'chart')}
        className={props.activeOutputType === 'chart' ? 'active' : ''}>
        Chart
      </button>
    </div>
  );
};

export default bookingsControl;

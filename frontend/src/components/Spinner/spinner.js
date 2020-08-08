import React from 'react';
import './spinner.css';

export default function spinner() {
  return (
    <div className='spinner'>
      <div className='lds-dual-ring'></div>
    </div>
  );
}

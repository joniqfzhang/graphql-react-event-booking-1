import React from 'react';
import './modal.css';

const modal = (props) => {
  return (
    <div className='modal'>
      <header className='modal__header'>
        <h1>{props.title}</h1>
      </header>
      <section className='modal__content'>{props.children}</section>
      <section className='modal__actions'>
        {props.canCancel && (
          <button className='btn' onClick={props.onCancle}>
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button className='btn' onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )}
      </section>
    </div>
  );
};

export default modal;

import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css';
import { AuthContext } from '../../context/auth-context';

const MainNavigation = (props) => {
  const context = useContext(AuthContext);
  const logout = () => {
    context.dispatch({ type: 'LOGOUT' });
  };
  console.log('context', context);
  return (
    <header className='main-navigation'>
      <div className='main-navigation__logo'>
        <h1>EasyEvent</h1>
      </div>
      <nav className='main-navigation__items'>
        <ul>
          {!context.state.token && (
            <li>
              <NavLink to='/auth'>Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to='/events'>Events</NavLink>
          </li>
          {context.state.token && (
            <>
              <li>
                <NavLink to='/bookings'>Bookings</NavLink>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;

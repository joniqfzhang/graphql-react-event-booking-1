import React, { useContext } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import auth from './pages/auth';
import events from './pages/events';
import bookings from './pages/bookings';
import MainNavigation from './components/navigation/mainNavigation';
import { AuthContext } from './context/auth-context';

import './App.css';

function App() {
  const context = useContext(AuthContext);
  console.log('App:', context);

  return (
    <BrowserRouter>
      <React.Fragment>
        {/* <AuthContextProvider> */}
        <MainNavigation />
        <main className='main-content'>
          <Switch>
            {!context.state.token && <Route path='/auth' component={auth} />}
            <Route path='/events' component={events} />
            {context.state.token && <Redirect from='/' to='/events' exact />}
            {context.state.token && (
              <Redirect from='/auth' to='/events' exact />
            )}
            {context.state.token && (
              <Route path='/bookings' component={bookings} />
            )}
            {!context.state.token && <Redirect to='/auth' exact />}
          </Switch>
        </main>
        {/* </AuthContextProvider> */}
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;

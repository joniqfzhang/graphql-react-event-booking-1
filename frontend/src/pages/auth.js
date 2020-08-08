import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import './auth.css';

function Auth(props) {
  const { state, dispatch } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
            query {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    userId
                    token
                    tokenExpiration
                }
            }
        `,
    };
    // if (!isLogin) {
    //   requestBody = {
    //     query: `
    //              mutation {
    //               createUser(userInput: {email: "${email}", password: "${password}"}) {
    //                   _id
    //                   email
    //               }
    //              }
    //           `,
    //   };
    // }
    if (!isLogin) {
      requestBody = {
        query: `
                 mutation Login(userInput: {$email: String!, $password: String!}){
                  createUser(userInput: {email: $email, password: $password}) {
                      _id
                      email
                  }
                 }
              `,
        variables: {
          userInput: { email: email, password: password },
        },
      };
    }
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log('resData', resData);
        if (resData.data.createUser) {
          console.log(
            resData.data.createUser._id,
            resData.data.createUser.email
          );
        } else if (resData.data.login.token) {
          const payload = {
            token: resData.data.login.token,
            userId: resData.data.login.userId,
            login: resData.data.login,
          };

          dispatch({ type: 'LOGIN', payload });
          console.log('payload,', payload);
          console.log('state,', state); //still initialState
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <form className='auth-form' onSubmit={submitHandler}>
      <div className='form-control'>
        <label htmlFor='email'>E-mail:</label>
        <input
          type='email'
          id='email'
          onChange={(e) => setEmail(e.target.value)}></input>
      </div>
      <div className='form-control'>
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          onChange={(e) => setPassword(e.target.value)}></input>
      </div>
      <div className='form-action'>
        <button type='submit'>Submit</button>
        <button type='button' onClick={switchModeHandler}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>
  );
}

//function auth error below, so have to use Auth
//React Hook "useState" is called in function "auth" which is neither a React function component or a custom React Hook function  react-hooks/rules-of-hooks
export default Auth;

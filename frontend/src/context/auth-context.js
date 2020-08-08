import React, { createContext, useReducer } from 'react';

const initialState = {
  token: null,
  userId: null,
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        login: action.payload.login,
      };
    case 'LOGOUT':
      return { ...state, token: null, userId: null };
    default:
      return state;
  }
};

const AuthContext = createContext(initialState); //AuthContext conains Provider and Consumer
//const { Provider } = AuthContext;

const AuthContextProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };

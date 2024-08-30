import React, { useContext, useReducer } from "react";

//////////////////////
// INITIAL STATE
//////////////////////

const initialState = {
  url: "https://jobrepo.onrender.com/",
  token: null,
  username: null,
  jobs: [],
  new: {
    title: "",
    application_url: "",
    company: "",
  },
  edit: {
    id: 0,
    title: "",
    application_url: "",
    company: "",
  },
};

//////////////////////
// REDUCER
//////////////////////
// action = {type: "", payload: ""}

const reducer = (state, action) => {
  switch (action.type) {
    case "auth":
      let newState = { ...state, ...action.payload };
      return newState;
    case "logout":
      newState = { ...state, token: null, username: null };
      window.localStorage.removeItem("auth");
      return newState;
    case "getJobs":
      newState = { ...state, jobs: action.payload };
      return newState;
    case "select":
      newState = { ...state, edit: action.payload };
      return newState;
    default:
      return state;
  }
};

//////////////////////
// AppContext
//////////////////////

const AppContext = React.createContext(null);

//////////////////////
// AppState Component
//////////////////////

export const AppState = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

//////////////////////
// userAppState hook
//////////////////////

export const useAppState = () => {
  return useContext(AppContext);
};

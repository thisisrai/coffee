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
      return { ...state, ...action.payload };
    case "logout":
      window.localStorage.removeItem("auth");
      return { ...state, token: null, username: null };
    case "getJobs":
      return { ...state, jobs: action.payload };
    case "select":
      return { ...state, edit: action.payload };
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

export const useAppState = () => useContext(AppContext);

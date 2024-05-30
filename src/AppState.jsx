import React, { useReducer } from "react"

//////////////////////
// INITIAL STATE
//////////////////////

const initialState = {
  url: "https://jobrepo.onrender.com/"
}

//////////////////////
// REDUCER
//////////////////////
// action = {type: "", payload: ""}

const reducer = (state, action) => {
  switch(action.type){
    default:
      return state
  }
}

//////////////////////
// AppContext
//////////////////////

const AppContext = React.createContext(null)

//////////////////////
// AppState Component
//////////////////////

export const AppState = (props) => {

  const [state, dispatch] = useReducer(reducer, initialState)

  return <AppContext.Provider value={{state, dispatch}}>
    {props.children}
  </AppContext.Provider>

};

//////////////////////
// userAppState hook
//////////////////////

export const userAppState = () => {
  return React.useContext(AppContext)
}
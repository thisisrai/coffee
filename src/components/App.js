import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "../pages/Home.jsx";
import Auth from "../pages/Auth.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import { useAppState } from "../AppState.jsx";
import Nav from "./Nav.jsx";


export const App = (props) => {

  const {state, dispatch} = useAppState()
  const navigate = useNavigate()

  React.useEffect(() => {
    const auth = JSON.parse(window.localStorage.getItem("auth"));

    if (auth) {
      dispatch({type: "auth", payload: auth})
      navigate("/dashboard")
    } else {
      navigate("/auth/login")
    }
  }, [])

  return <>
  <Nav/>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/auth/:form' element={<Auth/>}/>
    <Route path='/dashboard/*' element={<Dashboard/>}/>
  </Routes>
  </>;
};
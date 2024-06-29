import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const Nav = (props) => {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()

  return <header>
    <h1>Coffee Job</h1>
    <nav>
      {state.token ? <div onClick={() => {
        dispatch({ type: "logout"});
        navigate("/")
      }}>Logout</div> :
        <>
          <Link to="/"><div>Home</div></Link>
          <Link to="/auth/signup"><div>Signup</div></Link>
          <Link to="/auth/login"><div>Login</div></Link>
        </>
      }
    </nav>
  </header>
}

export default Nav;
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const Auth = (props) => {
  const { form } = useParams();

  const type = form
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  })
  const [userData, setUserData] = React.useState(null);
  const navigate = useNavigate()

  React.useEffect(() => {
    if (userData) {
      const {token, user} = userData;
      dispatch({ type: "auth", payload: {token, username: user.username} });
      window.localStorage.setItem("auth", JSON.stringify({token, username: user.username}))
      navigate("/dashboard")
    }
  }, [userData]);

  const {state, dispatch} = useAppState()

  const actions = {
    signup: () => {
      return fetch(state.url + "/users", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json())
    },
    login: () => {
      return fetch(state.url + "/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json())
    }
  }

  const handleChange = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    actions[type]().then((data) => {
      setUserData(data)
    })
  }

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="username/email" value={formData.username} onChange={handleChange}/>
        <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleChange}/>
        <input type="submit" value={type} />
      </form>
    </div>
  )
}

export default Auth;
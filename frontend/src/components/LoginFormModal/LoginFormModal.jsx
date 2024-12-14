import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) setErrors({ credential: "The provided credentials were invalid" });
    }
  };

  const handleDemoUser = async () => {
    try {
      await dispatch(sessionActions.login({
        credential: "demo@user.io",
        password: "password",
      }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    }
  };

  return (
    <div className="login-modal">
      <h1 className="login-label">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-form-label">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}

          />
        </label>
        <label className="login-form-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
        </label>
        {errors.credential && <p className="login-error">{errors.credential}</p>}
        <button
          className="login-button"
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
      </form>
      <button className="demo-user-button" onClick={handleDemoUser}>
        Log In as Demo User
      </button>
      </div>
  );
}

export default LoginFormModal;

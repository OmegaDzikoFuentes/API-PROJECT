import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();


  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Confirm Password field must match the Password field",
      });
      return;
    }

    setErrors({});
    try {
      await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      );
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  const isSignUpDisabled = () => {
    return (
      !email.trim() ||
      !username.trim() ||
      username.length < 4 ||
      !firstName.trim() ||
      !lastName.trim() ||
      password.length < 6 ||
      password !== confirmPassword
    );
  };

  return (
    <div className="signup-modal">
      <h1 className="signup-label">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}

          />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}

        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}

          />
        </label>
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}

          />
        </label>
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}

          />
        </label>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button
          type="submit"
          disabled={isSignUpDisabled()}
          className={isSignUpDisabled() ? "disabled" : ""}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;

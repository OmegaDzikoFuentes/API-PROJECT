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

    // Client-side validations
    const newErrors = {};

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email.";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.length < 4) {
      newErrors.username = "Username must be at least 4 characters.";
    } else if (/\S+@\S+\.\S+/.test(username)) {
      newErrors.username = "Username cannot be an email.";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be 6 characters or more.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Confirm Password field must match the Password field.";
    }

    // Set errors if found and stop execution
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and proceed with the API call
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

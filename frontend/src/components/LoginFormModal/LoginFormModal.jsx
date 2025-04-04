import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

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
      const errorMsg = data.errors?.credential || "The provided credentials were invalid";
      setErrors({ credential: errorMsg });
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
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credential">
            Username or Email
          </label>
          <input
            id="credential"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          />
          {errors.credential && (
            <p className="text-red-500 text-xs italic mt-2">{errors.credential}</p>
          )}
        </div>
        <button
          className="bg-powder-blue hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
        <button 
          className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-300" 
          type="button"
          onClick={handleDemoUser}
        >
          Log In as Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
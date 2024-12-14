import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaceOfWorship } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navigation">
      <div className="logo">
      <FontAwesomeIcon icon={faPlaceOfWorship} size="2x" />
        <NavLink to="/" className="nav-brand">
          StayCation
        </NavLink>
      </div>
      {isLoaded && (
        <div className="nav-links">
          {sessionUser && (
            <NavLink to="/spots/new" className="create-spot-button">
              Create a New Spot
            </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}


export default Navigation;

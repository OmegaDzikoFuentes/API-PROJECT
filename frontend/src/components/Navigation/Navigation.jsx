import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navigation">
      <div className="logo">
        {/* FontAwesome Airbnb logo */}
        <FontAwesomeIcon icon={faAirbnb} className="favicon" />
        <NavLink to="/" className="nav-brand">
          AirBnB
        </NavLink>
      </div>
      {isLoaded && (
        <div className="profile-button-container">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}


export default Navigation;

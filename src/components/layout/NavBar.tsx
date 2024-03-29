import classes from "./NavBar.module.css";
import { NavLink } from "react-router-dom";

/**
 * Navbar for the website.
 * @constructor
 */
const NavBar = () => {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>FHIR report</div>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink to="/new_report" className={(navData) => (navData.isActive ? classes.active : "")}>
              New report
            </NavLink>
          </li>

          <li>
            <NavLink to="/results_list" className={(navData) => (navData.isActive ? classes.active : "")}>
              Results list
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;

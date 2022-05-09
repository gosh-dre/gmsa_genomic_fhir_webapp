import classes from './Layout.module.css'
import NavBar from "./NavBar";
import React from "react";

/**
 * Generic layout component to ensure consistent styling of the app.
 * @param props any child component to be passed through
 * @constructor
 */
const Layout: React.FC<any> = (props) => {
  return (
    <>
      <NavBar/>
      <main className={classes.main}>{props.children}</main>
    </>
  );
};

export default Layout;

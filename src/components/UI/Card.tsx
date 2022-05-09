import classes from './Card.module.css';
import React from "react";

/**
 * Generic card.
 * @param props any child component to be passed through
 * @constructor
 */
const Card: React.FC<any> = (props) => {
  return (
    <div className={classes.card}>
      {props.children}
    </div>
  );
}

export default Card;

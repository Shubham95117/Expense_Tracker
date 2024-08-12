import React from "react";
import { Button } from "react-bootstrap";

const Buttons = (props) => {
  return (
    <Button
      className={props.className}
      onClick={props.onClick}
      type={props.type}
    >
      {props.children}
    </Button>
  );
};

export default Buttons;

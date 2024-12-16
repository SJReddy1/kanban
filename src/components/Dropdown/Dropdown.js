import React, { useEffect, useRef } from "react";

import "./Dropdown.css";

function Dropdown({ className, onClose, children }) {
  const dropdownRef = useRef();

  const handleClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose?.();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div
      ref={dropdownRef}
      className={`dropdown custom-scroll ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default Dropdown;

import React from "react";

const AlertMessage = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: type === "error" ? "red" : "green",
        padding: "10px",
        color: "white",
      }}
    >
      {message}
      <button onClick={onClose} style={{ marginLeft: "10px", color: "black" }}>
        X
      </button>
    </div>
  );
};

export default AlertMessage;

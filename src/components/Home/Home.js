import React from "react";
import AlertasVencimientos from "./AlertasVencimientos";
import NotificacionesIA from "./NotificacionesIA";

const Home = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#1f2937" }}>Dashboard</h1>
      <NotificacionesIA />
      <AlertasVencimientos />
      <div
        style={{
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center",
          color: "#6b7280",
        }}
      >
        Bienvenido a FarmaGest
      </div>
    </div>
  );
};
export default Home;

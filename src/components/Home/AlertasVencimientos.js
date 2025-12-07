import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getProductosPorVencerAPI,
  selectProductosPorVencer,
  selectLotesLoading,
} from "../../redux/lotesSlice";
import { FaExclamationTriangle, FaCalendarTimes } from "react-icons/fa";

const AlertasVencimientos = () => {
  const dispatch = useDispatch();
  const productosPorVencer = useSelector(selectProductosPorVencer);
  const loading = useSelector(selectLotesLoading);

  useEffect(() => {
    dispatch(getProductosPorVencerAPI(30)); // Próximos 30 días
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Cargando alertas...</div>
    );
  }

  const vencidos = productosPorVencer.filter((p) => p.dias_restantes < 0);
  const criticos = productosPorVencer.filter(
    (p) => p.dias_restantes >= 0 && p.dias_restantes <= 7
  );
  const proximos = productosPorVencer.filter(
    (p) => p.dias_restantes > 7 && p.dias_restantes <= 30
  );

  const totalVencidos = vencidos.reduce(
    (sum, p) => sum + (parseFloat(p.valor_inventario) || 0),
    0
  );

  if (productosPorVencer.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
        <FaCalendarTimes style={{ fontSize: "24px", color: "#ef4444", marginRight: "10px" }} />
        <h3 style={{ margin: 0, color: "#1f2937" }}>Alertas de Vencimientos</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "15px" }}>
        {vencidos.length > 0 && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #ef4444",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ef4444" }}>
              {vencidos.length}
            </div>
            <div style={{ fontSize: "14px", color: "#991b1b" }}>Productos Vencidos</div>
            <div style={{ fontSize: "12px", color: "#991b1b", marginTop: "5px" }}>
              ${totalVencidos.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}

        {criticos.length > 0 && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #f59e0b",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>
              {criticos.length}
            </div>
            <div style={{ fontSize: "14px", color: "#92400e" }}>Críticos (≤7 días)</div>
          </div>
        )}

        {proximos.length > 0 && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #fbbf24",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fbbf24" }}>
              {proximos.length}
            </div>
            <div style={{ fontSize: "14px", color: "#78350f" }}>Próximos (≤30 días)</div>
          </div>
        )}
      </div>

      <Link
        to="/lotes/por-vencer"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
          fontSize: "14px",
        }}
      >
        Ver detalles →
      </Link>
    </div>
  );
};

export default AlertasVencimientos;


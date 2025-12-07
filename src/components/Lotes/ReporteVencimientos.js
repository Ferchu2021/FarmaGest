import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPerdidasVencimientosAPI,
  selectPerdidasVencimientos,
  selectLotesLoading,
  selectLotesError,
} from "../../redux/lotesSlice";

const ReporteVencimientos = () => {
  const dispatch = useDispatch();
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const perdidas = useSelector(selectPerdidasVencimientos);
  const loading = useSelector(selectLotesLoading);
  const error = useSelector(selectLotesError);

  useEffect(() => {
    dispatch(getPerdidasVencimientosAPI(fechaDesde || null, fechaHasta || null));
  }, [dispatch, fechaDesde, fechaHasta]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value || 0);
  };

  const totalPerdida = perdidas.reduce((sum, p) => sum + (parseFloat(p.perdida_total) || 0), 0);
  const totalUnidades = perdidas.reduce((sum, p) => sum + (parseInt(p.unidades_vencidas) || 0), 0);

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <h2>Reporte de Pérdidas por Vencimientos</h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="fecha-desde">Desde:</label>
            <input
              id="fecha-desde"
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="form-control"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="fecha-hasta">Hasta:</label>
            <input
              id="fecha-hasta"
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="form-control"
            />
          </div>
          <button
            className="buttonPage"
            onClick={() => {
              setFechaDesde("");
              setFechaHasta("");
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div style={{ padding: "20px", backgroundColor: "#f3f4f6", borderRadius: "8px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
              {formatCurrency(totalPerdida)}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Pérdida Total</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
              {totalUnidades}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Unidades Vencidas</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
              {perdidas.length}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Meses con Pérdidas</div>
          </div>
        </div>
      </div>

      <div className="containerTableAndPagesSelected">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Cargando...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
            Error: {error}
          </div>
        ) : perdidas.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            No hay pérdidas registradas en el período seleccionado
          </div>
        ) : (
          <table className="headerTable">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Lotes Vencidos</th>
                <th>Unidades Vencidas</th>
                <th>Pérdida Total</th>
                <th>Productos Afectados</th>
              </tr>
            </thead>
            <tbody>
              {perdidas.map((perdida, index) => (
                <tr key={index}>
                  <td>{formatDate(perdida.mes_vencimiento)}</td>
                  <td>{perdida.cantidad_lotes_vencidos || 0}</td>
                  <td>{perdida.unidades_vencidas || 0}</td>
                  <td style={{ color: "#ef4444", fontWeight: "bold" }}>
                    {formatCurrency(perdida.perdida_total || 0)}
                  </td>
                  <td>{perdida.productos_afectados || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReporteVencimientos;


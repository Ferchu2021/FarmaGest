import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductosPorVencerAPI,
  selectProductosPorVencer,
  selectLotesLoading,
  selectLotesError,
} from "../../redux/lotesSlice";

const ProductosPorVencer = () => {
  const dispatch = useDispatch();
  const [dias, setDias] = useState(30);
  const productosPorVencer = useSelector(selectProductosPorVencer);
  const loading = useSelector(selectLotesLoading);
  const error = useSelector(selectLotesError);

  useEffect(() => {
    dispatch(getProductosPorVencerAPI(dias));
  }, [dispatch, dias]);

  const getNivelAlertaColor = (nivel) => {
    switch (nivel) {
      case "VENCIDO":
        return "#ef4444"; // Rojo
      case "CRÍTICO":
        return "#f59e0b"; // Amarillo/naranja
      case "PRÓXIMO":
        return "#fbbf24"; // Amarillo claro
      default:
        return "#10b981"; // Verde
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("es-AR");
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

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <h2>Productos por Vencer</h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label htmlFor="dias-select">Días a considerar:</label>
          <select
            id="dias-select"
            className="form-select"
            value={dias}
            onChange={(e) => setDias(parseInt(e.target.value))}
            style={{ width: "120px" }}
          >
            <option value={7}>7 días</option>
            <option value={15}>15 días</option>
            <option value={30}>30 días</option>
            <option value={60}>60 días</option>
            <option value={90}>90 días</option>
          </select>
        </div>
      </div>

      <div className="containerTableAndPagesSelected">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Cargando...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
            Error: {error}
          </div>
        ) : productosPorVencer.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            No hay productos próximos a vencer en los próximos {dias} días
          </div>
        ) : (
          <table className="headerTable">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th>Número de Lote</th>
                <th>Fecha Vencimiento</th>
                <th>Días Restantes</th>
                <th>Cantidad</th>
                <th>Valor Inventario</th>
                <th>Nivel Alerta</th>
              </tr>
            </thead>
            <tbody>
              {productosPorVencer.map((item) => (
                <tr key={`${item.lote_id}-${item.producto_id}`}>
                  <td>{item.producto_nombre || "-"}</td>
                  <td>{item.producto_codigo || "-"}</td>
                  <td>{item.numero_lote || "-"}</td>
                  <td>{formatDate(item.fecha_vencimiento)}</td>
                  <td>
                    <span
                      style={{
                        color:
                          item.dias_restantes < 0
                            ? "#ef4444"
                            : item.dias_restantes <= 7
                            ? "#f59e0b"
                            : "#10b981",
                        fontWeight: "bold",
                      }}
                    >
                      {item.dias_restantes !== null && item.dias_restantes !== undefined
                        ? item.dias_restantes
                        : "-"}{" "}
                      días
                    </span>
                  </td>
                  <td>{item.cantidad_actual || 0}</td>
                  <td>{formatCurrency(item.valor_inventario || 0)}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: getNivelAlertaColor(item.nivel_alerta),
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {item.nivel_alerta || "NORMAL"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductosPorVencer;









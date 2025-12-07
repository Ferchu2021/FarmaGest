import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getPerdidasVencimientosAPI,
  selectPerdidasVencimientos,
  selectLotesLoading,
  selectLotesError,
} from "../../redux/lotesSlice";
import API from "../../config";

const ReporteVencimientos = () => {
  const dispatch = useDispatch();
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [detalleLotes, setDetalleLotes] = useState([]);
  const perdidas = useSelector(selectPerdidasVencimientos);
  const loading = useSelector(selectLotesLoading);
  const error = useSelector(selectLotesError);

  useEffect(() => {
    dispatch(getPerdidasVencimientosAPI(fechaDesde || null, fechaHasta || null));
  }, [dispatch, fechaDesde, fechaHasta]);
  
  // Cargar detalle cuando se activa
  useEffect(() => {
    if (mostrarDetalle) {
      cargarDetalleLotes();
    }
  }, [mostrarDetalle, fechaDesde, fechaHasta]);

  const cargarDetalleLotes = async () => {
    try {
      const params = { incluirDetalle: 'true' };
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;
      
      const response = await axios.get(`${API}/lotes/perdidas`, { params });
      if (response.data && response.data.detalle) {
        setDetalleLotes(response.data.detalle);
      } else if (Array.isArray(response.data)) {
        setDetalleLotes([]);
      }
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      setDetalleLotes([]);
    }
  };

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
          <>
            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Resumen por Mes</h3>
              <button
                className="buttonPage"
                onClick={() => {
                  setMostrarDetalle(!mostrarDetalle);
                  if (!mostrarDetalle) {
                    cargarDetalleLotes();
                  }
                }}
              >
                {mostrarDetalle ? "Ocultar" : "Ver"} Detalle de Lotes Vencidos
              </button>
            </div>
            <table className="headerTable" style={{ marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Lotes Vencidos</th>
                  <th>Unidades Vencidas</th>
                  <th>Pérdida Total</th>
                  <th>Productos Afectados</th>
                  {perdidas[0]?.productos_lista && <th>Productos</th>}
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
                    {perdida.productos_lista && (
                      <td style={{ fontSize: "12px", maxWidth: "200px" }}>
                        {perdida.productos_lista}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {mostrarDetalle && detalleLotes.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <h3>Detalle de Lotes Vencidos</h3>
                <table className="headerTable">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Número de Lote</th>
                      <th>Fecha Vencimiento</th>
                      <th>Días Vencido</th>
                      <th>Unidades</th>
                      <th>Precio Compra</th>
                      <th>Pérdida Económica</th>
                      <th>Proveedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalleLotes.map((lote) => (
                      <tr key={lote.lote_id}>
                        <td>{lote.producto_nombre || "-"}</td>
                        <td>{lote.numero_lote || "-"}</td>
                        <td>{formatDate(lote.fecha_vencimiento)}</td>
                        <td>
                          <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                            {lote.dias_vencido || 0} días
                          </span>
                        </td>
                        <td>{lote.unidades_vencidas || 0}</td>
                        <td>{formatCurrency(lote.precio_compra || 0)}</td>
                        <td style={{ color: "#ef4444", fontWeight: "bold" }}>
                          {formatCurrency(lote.perdida_economica || 0)}
                        </td>
                        <td>{lote.proveedor_nombre || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReporteVencimientos;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getNotificacionesIAPI,
  selectNotificaciones,
  selectResumen,
  selectNotificacionesIALoading,
  selectUltimaActualizacion,
} from "../../redux/notificacionesIASlice";
import {
  FaExclamationTriangle,
  FaRobot,
  FaChartLine,
  FaLightbulb,
  FaArrowRight,
  FaSync,
} from "react-icons/fa";

const NotificacionesIA = () => {
  const dispatch = useDispatch();
  const notificaciones = useSelector(selectNotificaciones);
  const resumen = useSelector(selectResumen);
  const loading = useSelector(selectNotificacionesIALoading);
  const ultimaActualizacion = useSelector(selectUltimaActualizacion);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    dispatch(getNotificacionesIAPI(30));
  }, [dispatch]);

  // Auto-refresh cada 5 minutos si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      dispatch(getNotificacionesIAPI(30));
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [autoRefresh, dispatch]);

  const handleRefresh = () => {
    dispatch(getNotificacionesIAPI(30));
  };

  if (loading && !notificaciones) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <FaRobot style={{ fontSize: "24px", marginBottom: "10px" }} />
        <div>Cargando análisis inteligente...</div>
      </div>
    );
  }

  if (!notificaciones || !resumen) {
    return null;
  }

  const criticas = notificaciones.criticas || [];
  const alta = notificaciones.alta || [];
  const media = notificaciones.media || [];
  const todas = notificaciones.todas || [];

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaRobot style={{ fontSize: "24px", color: "#6366f1", marginRight: "10px" }} />
          <h3 style={{ margin: 0, color: "#1f2937" }}>Notificaciones Inteligentes de Vencimientos</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleRefresh}
            style={{
              padding: "5px 10px",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            title="Actualizar"
          >
            <FaSync />
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-actualizar
          </label>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>Resumen Ejecutivo</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
              {resumen.total_lotes_en_riesgo || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Lotes en riesgo</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
              ${(resumen.valor_total_inventario_riesgo || 0).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Valor en riesgo</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>
              ${(resumen.valor_inventario_critico || 0).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Valor crítico</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
              {resumen.lotes_alta_prioridad || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Alta prioridad</div>
          </div>
        </div>
        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#fff", borderRadius: "4px" }}>
          <div style={{ fontSize: "14px", color: "#374151" }}>
            <strong>Tendencia:</strong> {resumen.tendencia || "No disponible"}
          </div>
        </div>
      </div>

      {/* Notificaciones Críticas */}
      {criticas.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaExclamationTriangle style={{ color: "#ef4444", marginRight: "8px" }} />
            <h4 style={{ margin: 0, color: "#dc2626" }}>Alertas Críticas ({criticas.length})</h4>
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {criticas.slice(0, 5).map((lote) => (
              <div
                key={lote.lote_id}
                style={{
                  backgroundColor: "#fee2e2",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  borderLeft: "4px solid #ef4444",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div>
                    <strong>{lote.producto_nombre}</strong>
                    <div style={{ fontSize: "12px", color: "#991b1b" }}>
                      Lote: {lote.numero_lote} | Días restantes: {lote.dias_restantes}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#dc2626" }}>
                      Score: {lote.score_urgencia}/100
                    </div>
                    <div style={{ fontSize: "12px", color: "#991b1b" }}>
                      ${(lote.valor_inventario || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                {lote.recomendaciones && lote.recomendaciones.length > 0 && (
                  <div style={{ marginTop: "8px" }}>
                    {lote.recomendaciones.slice(0, 2).map((rec, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: "12px",
                          padding: "6px",
                          backgroundColor: "#fff",
                          borderRadius: "4px",
                          marginTop: "4px",
                          display: "flex",
                          alignItems: "start",
                          gap: "8px",
                        }}
                      >
                        <FaLightbulb style={{ color: "#f59e0b", marginTop: "2px", flexShrink: 0 }} />
                        <span>{rec.mensaje}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notificaciones Alta Prioridad */}
      {alta.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaExclamationTriangle style={{ color: "#f59e0b", marginRight: "8px" }} />
            <h4 style={{ margin: 0, color: "#d97706" }}>Alta Prioridad ({alta.length})</h4>
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {alta.slice(0, 3).map((lote) => (
              <div
                key={lote.lote_id}
                style={{
                  backgroundColor: "#fef3c7",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "6px",
                  borderLeft: "4px solid #f59e0b",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>{lote.producto_nombre}</strong>
                    <div style={{ fontSize: "12px", color: "#92400e" }}>
                      {lote.dias_restantes} días restantes | Score: {lote.score_urgencia}/100
                    </div>
                  </div>
                  {lote.recomendaciones && lote.recomendaciones.length > 0 && (
                    <div style={{ fontSize: "11px", color: "#78350f", fontStyle: "italic" }}>
                      {lote.recomendaciones[0].mensaje}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones Recomendadas */}
      {resumen.acciones_recomendadas && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaChartLine style={{ color: "#6366f1", marginRight: "8px" }} />
            <h4 style={{ margin: 0, color: "#4f46e5" }}>Acciones Recomendadas</h4>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {resumen.acciones_recomendadas.promocion > 0 && (
              <div style={{ padding: "10px", backgroundColor: "#eef2ff", borderRadius: "6px" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#6366f1" }}>
                  {resumen.acciones_recomendadas.promocion}
                </div>
                <div style={{ fontSize: "12px", color: "#4f46e5" }}>Promociones sugeridas</div>
              </div>
            )}
            {resumen.acciones_recomendadas.revision_compras > 0 && (
              <div style={{ padding: "10px", backgroundColor: "#fef3c7", borderRadius: "6px" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>
                  {resumen.acciones_recomendadas.revision_compras}
                </div>
                <div style={{ fontSize: "12px", color: "#d97706" }}>Revisiones de compras</div>
              </div>
            )}
            {resumen.acciones_recomendadas.revision_producto > 0 && (
              <div style={{ padding: "10px", backgroundColor: "#fee2e2", borderRadius: "6px" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>
                  {resumen.acciones_recomendadas.revision_producto}
                </div>
                <div style={{ fontSize: "12px", color: "#dc2626" }}>Revisiones de productos</div>
              </div>
            )}
            {resumen.acciones_recomendadas.planificacion > 0 && (
              <div style={{ padding: "10px", backgroundColor: "#d1fae5", borderRadius: "6px" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>
                  {resumen.acciones_recomendadas.planificacion}
                </div>
                <div style={{ fontSize: "12px", color: "#059669" }}>Planificaciones</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enlaces y última actualización */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
        <Link
          to="/lotes/por-vencer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "10px 20px",
            backgroundColor: "#6366f1",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          Ver todos los lotes
          <FaArrowRight />
        </Link>
        {ultimaActualizacion && (
          <div style={{ fontSize: "11px", color: "#6b7280" }}>
            Última actualización: {new Date(ultimaActualizacion).toLocaleString("es-AR")}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificacionesIA;









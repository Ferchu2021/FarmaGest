import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrediccionesIAPI,
  selectPredicciones,
  selectNotificacionesIALoading,
} from "../../redux/notificacionesIASlice";
import { FaChartLine, FaExclamationTriangle, FaArrowUp, FaArrowDown } from "react-icons/fa";

const DashboardPredicciones = () => {
  const dispatch = useDispatch();
  const predicciones = useSelector(selectPredicciones);
  const loading = useSelector(selectNotificacionesIALoading);
  const [diasPrediccion, setDiasPrediccion] = useState(60);

  useEffect(() => {
    dispatch(getPrediccionesIAPI(diasPrediccion));
  }, [dispatch, diasPrediccion]);

  if (loading && !predicciones) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <FaChartLine style={{ fontSize: "24px", marginBottom: "10px" }} />
        <div>Cargando predicciones...</div>
      </div>
    );
  }

  if (!predicciones) {
    return null;
  }

  const productosProblematicos = predicciones.productos_problematicos || [];
  const productosAltoRiesgo = predicciones.productos_alto_riesgo || [];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#1f2937" }}>Dashboard de Predicciones</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>
            Horizonte de predicción:
            <select
              value={diasPrediccion}
              onChange={(e) => setDiasPrediccion(Number(e.target.value))}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            >
              <option value={30}>30 días</option>
              <option value={60}>60 días</option>
              <option value={90}>90 días</option>
            </select>
          </label>
        </div>
      </div>

      {/* Recomendación General */}
      {predicciones.recomendacion_general && (
        <div
          style={{
            backgroundColor: "#eef2ff",
            borderLeft: "4px solid #6366f1",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
            <FaArrowUp style={{ color: "#6366f1", fontSize: "20px", marginTop: "2px" }} />
            <div>
              <strong style={{ color: "#4f46e5" }}>Recomendación General:</strong>
              <p style={{ margin: "5px 0 0 0", color: "#374151" }}>
                {predicciones.recomendacion_general}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Productos Problemáticos */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <FaExclamationTriangle style={{ color: "#ef4444", marginRight: "10px", fontSize: "20px" }} />
            <h2 style={{ margin: 0, color: "#1f2937" }}>
              Productos Problemáticos ({productosProblematicos.length})
            </h2>
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "15px" }}>
            Productos que han tenido problemas de vencimiento históricamente
          </p>

          {productosProblematicos.length > 0 ? (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {productosProblematicos.map((prod, index) => (
                <div
                  key={prod.producto_id || index}
                  style={{
                    backgroundColor: "#fee2e2",
                    padding: "12px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    borderLeft: "4px solid #ef4444",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <strong style={{ color: "#991b1b" }}>{prod.nombre}</strong>
                    <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: "bold" }}>
                      {prod.veces_vencido}x vencido
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#991b1b" }}>
                    Pérdida promedio: $
                    {parseFloat(prod.perdida_promedio || 0).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              ✅ No hay productos problemáticos identificados
            </div>
          )}
        </div>

        {/* Productos de Alto Riesgo */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <FaArrowDown style={{ color: "#f59e0b", marginRight: "10px", fontSize: "20px" }} />
            <h2 style={{ margin: 0, color: "#1f2937" }}>
              Productos de Alto Riesgo ({productosAltoRiesgo.length})
            </h2>
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "15px" }}>
            Productos con alto stock y baja rotación (riesgo de vencimiento futuro)
          </p>

          {productosAltoRiesgo.length > 0 ? (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {productosAltoRiesgo.map((prod, index) => {
                const ratio = parseFloat(prod.ratio_stock_venta || 0);
                return (
                  <div
                    key={prod.producto_id || index}
                    style={{
                      backgroundColor: ratio > 50 ? "#fee2e2" : ratio > 30 ? "#fef3c7" : "#eef2ff",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "10px",
                      borderLeft: `4px solid ${ratio > 50 ? "#ef4444" : ratio > 30 ? "#f59e0b" : "#6366f1"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <strong>{prod.nombre}</strong>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: ratio > 50 ? "#dc2626" : ratio > 30 ? "#d97706" : "#4f46e5",
                        }}
                      >
                        Ratio: {ratio.toFixed(1)}x
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "5px" }}>
                      <div>Stock actual: {prod.stock} unidades</div>
                      <div>
                        Vendido en 90 días: {prod.unidades_vendidas_90dias || 0} unidades
                      </div>
                      <div style={{ marginTop: "5px", fontStyle: "italic" }}>
                        {ratio > 50
                          ? "⚠️ Riesgo muy alto - Considerar acción inmediata"
                          : ratio > 30
                          ? "⚠️ Riesgo alto - Revisar estrategia de compras"
                          : "ℹ️ Monitorear de cerca"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              ✅ No hay productos de alto riesgo identificados
            </div>
          )}
        </div>
      </div>

      {/* Resumen de Métricas */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: "#1f2937" }}>Resumen de Métricas</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          <div style={{ textAlign: "center", padding: "15px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ef4444" }}>
              {productosProblematicos.length}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Productos problemáticos</div>
          </div>
          <div style={{ textAlign: "center", padding: "15px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>
              {productosAltoRiesgo.length}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Productos alto riesgo</div>
          </div>
          <div style={{ textAlign: "center", padding: "15px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#6366f1" }}>
              {productosProblematicos.reduce(
                (sum, p) => sum + parseFloat(p.perdida_promedio || 0),
                0
              ).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              })}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>Pérdida histórica promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPredicciones;


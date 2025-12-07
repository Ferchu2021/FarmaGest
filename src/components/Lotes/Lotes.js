import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLotesAPI,
  selectLotes,
  selectLotesLoading,
  selectLotesError,
} from "../../redux/lotesSlice";
import LoteForm from "./LoteForm";

const Lotes = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [productoFilter, setProductoFilter] = useState("");
  const pageSize = 10;

  const lotes = useSelector(selectLotes);
  const loading = useSelector(selectLotesLoading);
  const error = useSelector(selectLotesError);

  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const usuarioId = logged?.sesion?.usuario_id;
  const sesion = logged?.sesion?.sesion_id;

  useEffect(() => {
    dispatch(
      getLotesAPI({
        page,
        pageSize,
        search,
        estado: estadoFilter || null,
        productoId: productoFilter || null,
      })
    );
  }, [dispatch, page, pageSize, search, estadoFilter, productoFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("es-AR");
    } catch {
      return dateString;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "VENCIDO":
        return "#ef4444";
      case "PRONTO_VENCER":
        return "#f59e0b";
      case "AGOTADO":
        return "#6b7280";
      default:
        return "#10b981";
    }
  };

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <input
          className="inputSearch"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por lote o producto..."
        />
        <select
          className="form-select"
          value={estadoFilter}
          onChange={(e) => {
            setEstadoFilter(e.target.value);
            setPage(1);
          }}
          style={{ width: "200px" }}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="PRONTO_VENCER">Pronto a vencer</option>
          <option value="VENCIDO">Vencido</option>
          <option value="AGOTADO">Agotado</option>
        </select>
        <LoteForm usuarioId={usuarioId} />
      </div>

      <div className="containerTableAndPagesSelected">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Cargando...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
            Error: {error}
          </div>
        ) : lotes.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            No se encontraron lotes con los filtros aplicados
          </div>
        ) : (
          <table className="headerTable">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Número de Lote</th>
                <th>Fecha Vencimiento</th>
                <th>Cantidad Inicial</th>
                <th>Cantidad Actual</th>
                <th>Días hasta Vencimiento</th>
                <th>Estado</th>
                <th>Proveedor</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => (
                <tr key={lote.lote_id}>
                  <td>{lote.producto_nombre || "-"}</td>
                  <td>{lote.numero_lote || "-"}</td>
                  <td>{formatDate(lote.fecha_vencimiento)}</td>
                  <td>{lote.cantidad_inicial || 0}</td>
                  <td>{lote.cantidad_actual || 0}</td>
                  <td>
                    <span
                      style={{
                        color:
                          lote.dias_hasta_vencimiento < 0
                            ? "#ef4444"
                            : lote.dias_hasta_vencimiento <= 7
                            ? "#f59e0b"
                            : "#10b981",
                        fontWeight: "bold",
                      }}
                    >
                      {lote.dias_hasta_vencimiento !== null &&
                      lote.dias_hasta_vencimiento !== undefined
                        ? lote.dias_hasta_vencimiento
                        : "-"}{" "}
                      días
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: getEstadoColor(lote.estado),
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {lote.estado || "ACTIVO"}
                    </span>
                  </td>
                  <td>{lote.proveedor_nombre || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Lotes;


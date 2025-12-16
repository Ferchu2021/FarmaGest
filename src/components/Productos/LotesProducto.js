import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { FaBox, FaPlusCircle } from "react-icons/fa";
import {
  getLotesAPI,
  selectLotes,
  selectLotesLoading,
  addLoteAPI,
  getLotesAPI as refreshLotes,
} from "../../redux/lotesSlice";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const LotesProducto = ({ producto, usuarioId, onClose }) => {
  const dispatch = useDispatch();
  const [showAddLote, setShowAddLote] = useState(false);
  const lotes = useSelector(selectLotes);
  const loading = useSelector(selectLotesLoading);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (producto && producto.producto_id) {
      dispatch(getLotesAPI({ productoId: producto.producto_id, page: 1, pageSize: 100 }));
    }
  }, [dispatch, producto]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("es-AR");
    } catch {
      return dateString;
    }
  };

  const getEstadoColor = (estado, dias) => {
    if (dias < 0) return "#ef4444"; // Vencido
    if (dias <= 7) return "#f59e0b"; // Crítico
    if (dias <= 30) return "#fbbf24"; // Próximo
    return "#10b981"; // Normal
  };

  const onSubmitLote = async (data) => {
    try {
      const loteData = {
        producto_id: producto.producto_id,
        numero_lote: data.numero_lote,
        fecha_vencimiento: data.fecha_vencimiento,
        fecha_fabricacion: data.fecha_fabricacion || null,
        cantidad_inicial: parseInt(data.cantidad_inicial),
        cantidad_actual: parseInt(data.cantidad_actual || data.cantidad_inicial),
        precio_compra: data.precio_compra ? parseFloat(data.precio_compra) : null,
        precio_venta: data.precio_venta ? parseFloat(data.precio_venta) : null,
        ubicacion: data.ubicacion || null,
        observaciones: data.observaciones || null,
        usuario_id: usuarioId,
      };

      await dispatch(addLoteAPI(loteData)).unwrap();
      
      Swal.fire({
        icon: "success",
        title: "Lote agregado",
        text: "El lote ha sido agregado correctamente.",
      });
      
      setShowAddLote(false);
      reset();
      dispatch(getLotesAPI({ productoId: producto.producto_id, page: 1, pageSize: 100 }));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.mensaje || "No se pudo agregar el lote.",
      });
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaBox style={{ marginRight: "8px" }} />
          Lotes de {producto?.Nombre || producto?.nombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Código:</strong> {producto?.Codigo || producto?.codigo}
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowAddLote(true)}
          >
            <FaPlusCircle style={{ marginRight: "5px" }} />
            Agregar Lote
          </Button>
        </div>

        {showAddLote && (
          <div style={{ 
            padding: "15px", 
            backgroundColor: "#f3f4f6", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <h6>Nuevo Lote</h6>
            <form onSubmit={handleSubmit(onSubmitLote)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label>Número de Lote *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    {...register("numero_lote", { required: "Requerido" })}
                  />
                  {errors.numero_lote && (
                    <small style={{ color: "red" }}>{errors.numero_lote.message}</small>
                  )}
                </div>
                <div>
                  <label>Fecha Vencimiento *</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    {...register("fecha_vencimiento", { required: "Requerido" })}
                  />
                  {errors.fecha_vencimiento && (
                    <small style={{ color: "red" }}>{errors.fecha_vencimiento.message}</small>
                  )}
                </div>
                <div>
                  <label>Cantidad Inicial *</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="1"
                    {...register("cantidad_inicial", { required: "Requerido", min: 1 })}
                  />
                </div>
                <div>
                  <label>Precio Compra</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-sm"
                    {...register("precio_compra")}
                  />
                </div>
              </div>
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <Button type="submit" variant="primary" size="sm">
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowAddLote(false);
                    reset();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>Cargando lotes...</div>
        ) : lotes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
            No hay lotes registrados para este producto
          </div>
        ) : (
          <table className="headerTable" style={{ fontSize: "14px" }}>
            <thead>
              <tr>
                <th>Número Lote</th>
                <th>Vencimiento</th>
                <th>Cantidad</th>
                <th>Días Restantes</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => (
                <tr key={lote.lote_id}>
                  <td>{lote.numero_lote}</td>
                  <td>{formatDate(lote.fecha_vencimiento)}</td>
                  <td>
                    {lote.cantidad_actual} / {lote.cantidad_inicial}
                  </td>
                  <td>
                    <span
                      style={{
                        color: getEstadoColor(lote.estado, lote.dias_hasta_vencimiento),
                        fontWeight: "bold",
                      }}
                    >
                      {lote.dias_hasta_vencimiento !== null &&
                      lote.dias_hasta_vencimiento !== undefined
                        ? `${lote.dias_hasta_vencimiento} días`
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: getEstadoColor(lote.estado, lote.dias_hasta_vencimiento),
                        color: "white",
                        fontSize: "11px",
                      }}
                    >
                      {lote.estado || "ACTIVO"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LotesProducto;









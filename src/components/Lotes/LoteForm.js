import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addLoteAPI, getLotesAPI } from "../../redux/lotesSlice";
import { getProductosAPI, selectProductos } from "../../redux/productosSlice";
import Swal from "sweetalert2";

const LoteForm = ({ usuarioId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const productos = useSelector(selectProductos);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      producto_id: "",
      numero_lote: "",
      fecha_vencimiento: "",
      fecha_fabricacion: "",
      cantidad_inicial: "",
      cantidad_actual: "",
      precio_compra: "",
      precio_venta: "",
      proveedor_id: "",
      ubicacion: "",
    },
  });

  useEffect(() => {
    if (show && productos.length === 0) {
      dispatch(getProductosAPI({ page: 1, pageSize: 100 }));
    }
  }, [show, productos.length, dispatch]);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  const onSubmit = async (data) => {
    try {
      const loteData = {
        producto_id: parseInt(data.producto_id),
        numero_lote: data.numero_lote,
        fecha_vencimiento: data.fecha_vencimiento,
        fecha_fabricacion: data.fecha_fabricacion || null,
        cantidad_inicial: parseInt(data.cantidad_inicial),
        cantidad_actual: parseInt(data.cantidad_actual || data.cantidad_inicial),
        precio_compra: data.precio_compra ? parseFloat(data.precio_compra) : null,
        precio_venta: data.precio_venta ? parseFloat(data.precio_venta) : null,
        proveedor_id: data.proveedor_id ? parseInt(data.proveedor_id) : null,
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
      
      handleClose();
      dispatch(getLotesAPI({ page: 1, pageSize: 10 }));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.mensaje || "No se pudo agregar el lote.",
      });
    }
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle style={{ width: "30px", height: "30px", marginRight: "5px" }} />
        <div>Nuevo Lote</div>
      </div>
      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Lote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="producto_id">Producto *</label>
                <select
                  id="producto_id"
                  className="form-select"
                  {...register("producto_id", { required: "Este campo es requerido" })}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map((producto) => (
                    <option key={producto.producto_id} value={producto.producto_id}>
                      {producto.Nombre} - {producto.Codigo}
                    </option>
                  ))}
                </select>
                {errors.producto_id && (
                  <p style={{ color: "red" }}>{errors.producto_id.message}</p>
                )}
              </div>

              <div className="form-group col-md-12">
                <label htmlFor="numero_lote">Número de Lote *</label>
                <input
                  type="text"
                  id="numero_lote"
                  className="form-control"
                  {...register("numero_lote", { required: "Este campo es requerido" })}
                />
                {errors.numero_lote && (
                  <p style={{ color: "red" }}>{errors.numero_lote.message}</p>
                )}
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="fecha_vencimiento">Fecha de Vencimiento *</label>
                <input
                  type="date"
                  id="fecha_vencimiento"
                  className="form-control"
                  {...register("fecha_vencimiento", { required: "Este campo es requerido" })}
                />
                {errors.fecha_vencimiento && (
                  <p style={{ color: "red" }}>{errors.fecha_vencimiento.message}</p>
                )}
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="fecha_fabricacion">Fecha de Fabricación</label>
                <input
                  type="date"
                  id="fecha_fabricacion"
                  className="form-control"
                  {...register("fecha_fabricacion")}
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="cantidad_inicial">Cantidad Inicial *</label>
                <input
                  type="number"
                  id="cantidad_inicial"
                  className="form-control"
                  min="1"
                  {...register("cantidad_inicial", {
                    required: "Este campo es requerido",
                    min: { value: 1, message: "La cantidad debe ser mayor a 0" },
                  })}
                />
                {errors.cantidad_inicial && (
                  <p style={{ color: "red" }}>{errors.cantidad_inicial.message}</p>
                )}
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="cantidad_actual">Cantidad Actual</label>
                <input
                  type="number"
                  id="cantidad_actual"
                  className="form-control"
                  min="0"
                  {...register("cantidad_actual")}
                  placeholder="Dejar vacío para usar cantidad inicial"
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="precio_compra">Precio de Compra</label>
                <input
                  type="number"
                  step="0.01"
                  id="precio_compra"
                  className="form-control"
                  min="0"
                  {...register("precio_compra")}
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="precio_venta">Precio de Venta</label>
                <input
                  type="number"
                  step="0.01"
                  id="precio_venta"
                  className="form-control"
                  min="0"
                  {...register("precio_venta")}
                />
              </div>

              <div className="form-group col-md-12">
                <label htmlFor="ubicacion">Ubicación</label>
                <input
                  type="text"
                  id="ubicacion"
                  className="form-control"
                  {...register("ubicacion")}
                  placeholder="Ej: Estante A1, Refrigerador"
                />
              </div>

              <div className="form-group col-md-12">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  className="form-control"
                  rows="3"
                  {...register("observaciones")}
                />
              </div>
            </div>

            <Modal.Footer>
              <Button type="submit" className="buttonConfirm">
                <FaSave className="iconConfirm" />
                Confirmar
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoteForm;









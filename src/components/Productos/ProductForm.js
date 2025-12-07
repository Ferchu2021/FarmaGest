import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addProductoAPI } from "../../redux/productosSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import ProductoBuilder from "../../patterns/builders/ProductoBuilder";
import ProductoAdapter from "../../patterns/adapters/ProductoAdapter";
import Swal from "sweetalert2";

const ProductFormModal = ({ Categorias, Proveedores = [], usuarioId }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoriaID: "", // Valor por defecto vacío
      categoriaDesc: "", // Valor por defecto vacío
      porcentaje_iva: 21,
      es_medicamento: false,
    },
  });

  const [show, setShow] = useState(false);
  const [precioCalculado, setPrecioCalculado] = useState(null);
  const [mostrarPrecioCalculado, setMostrarPrecioCalculado] = useState(false);

  const handleClose = () => {
    setShow(false);
    reset();
    setPrecioCalculado(null);
    setMostrarPrecioCalculado(false);
  };

  const handleShow = () => setShow(true);
  
  const calcularPrecio = (precioCompraBase, esMedicamento, porcentajeIVA) => {
    if (!precioCompraBase || precioCompraBase <= 0) {
      setMostrarPrecioCalculado(false);
      return;
    }
    
    const porcentajeGanancia = esMedicamento ? 25 : 30;
    const precioConGanancia = precioCompraBase * (1 + porcentajeGanancia / 100);
    const precioFinal = precioConGanancia * (1 + (porcentajeIVA || 21) / 100);
    
    setPrecioCalculado(precioFinal.toFixed(2));
    setMostrarPrecioCalculado(true);
  };

  const handleAddProduct = (data) => {
    try {
      // Usar Builder Pattern para construir el objeto de producto
      const productoData = new ProductoBuilder()
        .setNombre(data.productoNombre)
        .setCodigo(data.codigo)
        .setMarca(data.marca)
        .setCategoria(data.categoriaID, data.categoriaDesc)
        .setPrecio(data.precio)
        .setStock(data.cantidad)
        .setUsuario(usuarioId)
        .build();

      // Usar Adapter Pattern para transformar a formato del backend
      const backendData = ProductoAdapter.toBackendFormat(data, usuarioId);
      
      dispatch(addProductoAPI(backendData));
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: error.message,
      });
    }
  };

  const handleChange = (e) => {
    const selectedCategoriaDesc = e.target.selectedOptions[0].getAttribute(
      "data-user-categoria"
    );
    setValue("categoriaDesc", selectedCategoriaDesc);
    setValue("categoriaID", e.target.value);
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Nuevo Producto</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleAddProduct)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="productoNombre">Nombre del producto:</label>
                <input
                  type="text"
                  id="productoNombre"
                  className="form-control"
                  {...register("productoNombre", {
                    required: "Este campo es requerido",
                  })}
                  autoFocus
                />
                {errors.productoNombre && (
                  <p style={{ color: "red" }}>
                    {errors.productoNombre.message}
                  </p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="codigo">Codigo:</label>
                <input
                  type="text"
                  id="codigo"
                  className="form-control"
                  {...register("codigo", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.codigo && (
                  <p style={{ color: "red" }}>{errors.codigo.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="marca">Marca:</label>
                <input
                  type="text"
                  id="marca"
                  className="form-control"
                  {...register("marca", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.marca && (
                  <p style={{ color: "red" }}>{errors.marca.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="es_medicamento">
                  <input
                    type="checkbox"
                    id="es_medicamento"
                    {...register("es_medicamento")}
                    onChange={(e) => {
                      setValue("es_medicamento", e.target.checked);
                      const precioCompra = watch("precio_compra_base");
                      const porcentajeIVA = watch("porcentaje_iva");
                      if (precioCompra) {
                        calcularPrecio(precioCompra, e.target.checked, porcentajeIVA);
                      }
                    }}
                    style={{ marginRight: "8px" }}
                  />
                  Es Medicamento (25% ganancia) - Si no está marcado, aplica 30% ganancia
                </label>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="precio_compra_base">Precio de Compra Base (sin ganancias ni IVA):</label>
                <input
                  type="number"
                  step="0.01"
                  id="precio_compra_base"
                  className="form-control"
                  {...register("precio_compra_base")}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setValue("precio_compra_base", value);
                    const esMedicamento = watch("es_medicamento");
                    const porcentajeIVA = watch("porcentaje_iva");
                    calcularPrecio(value, esMedicamento, porcentajeIVA);
                    if (mostrarPrecioCalculado && precioCalculado) {
                      setValue("precio", precioCalculado);
                    }
                  }}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="porcentaje_iva">Porcentaje IVA (%):</label>
                <input
                  type="number"
                  step="0.01"
                  id="porcentaje_iva"
                  className="form-control"
                  defaultValue="21"
                  {...register("porcentaje_iva")}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 21;
                    setValue("porcentaje_iva", value);
                    const precioCompra = watch("precio_compra_base");
                    const esMedicamento = watch("es_medicamento");
                    if (precioCompra) {
                      calcularPrecio(precioCompra, esMedicamento, value);
                    }
                  }}
                />
              </div>
              {mostrarPrecioCalculado && precioCalculado && (
                <div className="form-group col-md-12">
                  <div style={{ 
                    padding: "10px", 
                    backgroundColor: "#d1fae5", 
                    borderRadius: "4px",
                    border: "1px solid #10b981"
                  }}>
                    <strong>Precio de Venta Calculado: ${parseFloat(precioCalculado).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                    <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#065f46" }}>
                      (Incluye {watch("es_medicamento") ? "25%" : "30%"} de ganancia + {watch("porcentaje_iva") || 21}% IVA)
                    </p>
                  </div>
                </div>
              )}
              <div className="form-group col-md-12">
                <label htmlFor="precio">Precio de Venta (se puede modificar manualmente):</label>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  {...register("precio", {
                    required: "Este campo es requerido",
                    pattern: {
                      value: /^\d+(?:[\.,]\d{0,2})?$/,
                      message: "Ingrese un número válido (ej: 1234.56)",
                    },
                  })}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, ".");
                    setValue("precio", value);
                  }}
                />
                {errors.precio && (
                  <p style={{ color: "red" }}>{errors.precio.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control"
                  {...register("cantidad", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.cantidad && (
                  <p style={{ color: "red" }}>{errors.cantidad.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="categoriaID">Categoria (Opcional):</label>
                <select
                  id="categoriaID"
                  className="form-select"
                  {...register("categoriaID")}
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" className="default-option">
                    {Categorias && Array.isArray(Categorias) && Categorias.length > 0 
                      ? "Seleccionar Categoria (Opcional)" 
                      : "Sin categorías disponibles (Opcional)"}
                  </option>
                  {Categorias && Array.isArray(Categorias) && Categorias.length > 0 && (
                    Categorias.map((categoria) => (
                      <option
                        key={categoria.categoria_id || categoria.id}
                        value={categoria.categoria_id || categoria.id}
                        data-user-categoria={categoria.nombre || categoria.Nombre || categoria.name}
                      >
                        {categoria.nombre || categoria.Nombre || categoria.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.categoriaID && errors.categoriaID.message && (
                  <p style={{ color: "red" }}>{errors.categoriaID.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="proveedorID">Proveedor (Opcional):</label>
                <select
                  id="proveedorID"
                  className="form-select"
                  {...register("proveedorID")}
                  defaultValue=""
                >
                  <option value="" className="default-option">
                    {Proveedores && Array.isArray(Proveedores) && Proveedores.length > 0 
                      ? "Seleccionar Proveedor (Opcional)" 
                      : "Sin proveedores disponibles (Opcional)"}
                  </option>
                  {Proveedores && Array.isArray(Proveedores) && Proveedores.length > 0 && (
                    Proveedores.map((proveedor) => (
                      <option
                        key={proveedor.proveedor_id || proveedor.id}
                        value={proveedor.proveedor_id || proveedor.id}
                      >
                        {proveedor.razon_social || proveedor.Razon_social || "-"}
                      </option>
                    ))
                  )}
                </select>
                {errors.proveedorID && errors.proveedorID.message && (
                  <p style={{ color: "red" }}>{errors.proveedorID.message}</p>
                )}
              </div>
            </div>
            <input type="hidden" {...register("categoriaDesc")} />
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

export default ProductFormModal;

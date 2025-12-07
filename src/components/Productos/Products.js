import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductosAPI,
  deleteProductoAPI,
  getCategoriasAPI,
  getProductosFiltrosAPI,
  selectProductos,
} from "../../redux/productosSlice";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import EditProductFormModal from "./EditProductForm";
import LotesProducto from "./LotesProducto";

const Products = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [marcaFilter, setMarcaFilter] = useState("");
  const [proveedorFilter, setProveedorFilter] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [showLotesModal, setShowLotesModal] = useState(false);

  const pageSize = 8;
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const usuarioId = logged?.sesion?.usuario_id;
  const sesion = logged?.sesion?.sesion_id;

  useEffect(() => {
    dispatch(
      getProductosAPI({
        page,
        pageSize,
        search,
        sesion,
        marca: marcaFilter.trim() || undefined,
        proveedorId:
          proveedorFilter !== "" ? Number(proveedorFilter) : undefined,
      })
    );
  }, [dispatch, page, pageSize, search, sesion, marcaFilter, proveedorFilter]);

  useEffect(() => {
    dispatch(getCategoriasAPI());
    dispatch(getProductosFiltrosAPI());
  }, [dispatch]);

  const Categorias =
    useSelector((state) => state?.producto?.categoriasState) || [];
  const filtrosState =
    useSelector((state) => state?.producto?.filtrosState) || {};

  const productos = useSelector(selectProductos);
  const marcasDisponibles = filtrosState.marcas || [];
  const proveedoresDisponibles = filtrosState.proveedores || [];

  const columns = [
    { key: "Nombre", label: "Nombre" },
    { key: "Codigo", label: "Código" },
    { key: "Marca", label: "Marca" },
    { key: "Proveedor", label: "Proveedor" },
    { key: "Stock", label: "Stock" },
    { key: "Precio", label: "Precio" },
    { key: "FechaCreacion", label: "Creado" },
  ];

  const formatPrice = (value) =>
    `$${Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  const handleDelete = (dato) => {
    const datoWithUserId = { ...dato, usuario_id: usuarioId };
    Swal.fire({
      title: "Advertencia!",
      html: `¿Esta seguro que desea eliminar el producto <b>${dato.Nombre}</b> ? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProductoAPI(datoWithUserId));
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleClearFilters = () => {
    setMarcaFilter("");
    setProveedorFilter("");
    setPage(1);
  };

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <div>
          <input
            id="search-productos"
            name="search-productos"
            className="inputSearch"
            type="text"
            onChange={handleSearchChange}
            value={search}
            placeholder=" &#xF002; Buscar..."
          />
        </div>
        <div style={{ display: "flex" }}>
          <ProductForm Categorias={Categorias} Proveedores={proveedoresDisponibles} usuarioId={usuarioId} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <select
          className="form-select"
          style={{ width: "220px" }}
          value={marcaFilter}
          onChange={(e) => {
            setMarcaFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas las marcas</option>
          {marcasDisponibles.map((marca) => (
            <option key={marca} value={marca}>
              {marca}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          style={{ width: "220px" }}
          value={proveedorFilter}
          onChange={(e) => {
            setProveedorFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos los proveedores</option>
          {proveedoresDisponibles.map((prov) => (
            <option key={prov.proveedor_id} value={prov.proveedor_id}>
              {prov.razon_social || "-"}
            </option>
          ))}
        </select>
        <button className="buttonPage" onClick={handleClearFilters}>
          Limpiar filtros
        </button>
      </div>

      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th style={{ width: "70px" }}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((dato) => (
                <tr
                  key={dato.producto_id}
                  style={{
                    backgroundColor: dato.Stock <= 0 ? "#f8d7da" : undefined,
                  }}
                >
                  {columns.map((column) => {
                    const isStock = column.key === "Stock";
                    let value = dato[column.key];

                    if (column.key === "Precio") {
                      value = formatPrice(value);
                    } else if (column.key === "FechaCreacion") {
                      value = formatDate(value);
                    }

                    return (
                      <td
                        key={`${dato.producto_id}-${column.key}`}
                        style={{
                          color: isStock && dato.Stock <= 0 ? "red" : undefined,
                          fontWeight: isStock ? "bold" : undefined,
                        }}
                      >
                        {value ?? "-"}
                      </td>
                    );
                  })}
                  <td style={{ flexWrap: "nowrap" }}>
                    <FaBox
                      className="iconABM"
                      style={{ color: "#3b82f6", cursor: "pointer", marginRight: "8px" }}
                      onClick={() => {
                        setProductoSeleccionado(dato);
                        setShowLotesModal(true);
                      }}
                      title="Ver lotes"
                    />
                    <EditProductFormModal
                      productSelected={dato}
                      Categorias={Categorias}
                      usuarioId={usuarioId}
                    />
                    <FaRegTrashCan
                      className="iconABM"
                      onClick={() => handleDelete(dato)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="NoData"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="buttonPage"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          style={{ marginLeft: "10px" }}
          disabled={productos.length < pageSize}
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
      {showLotesModal && productoSeleccionado && (
        <LotesProducto
          producto={productoSeleccionado}
          usuarioId={usuarioId}
          onClose={() => {
            setShowLotesModal(false);
            setProductoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};
export default Products;


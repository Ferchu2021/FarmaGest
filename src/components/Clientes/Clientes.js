/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientesAPI,
  deleteClienteAPI,
  getObrasSocialesAPI,
  getCiudadesAPI,
} from "../../redux/clientesSlice";
import { FaRegTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import ClienteForm from "./ClienteForm";
import EditClienteForm from "./EditClienteForm";

const Clientes = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [obraSocialID, setObraSocialID] = useState(0);
  const [ciudadID, setCiudadID] = useState(0);
  const pageSize = 8;

  const logged = JSON.parse(sessionStorage.getItem("logged"));
  const usuarioId = logged?.sesion?.usuario_id;
  const sesion = logged?.sesion?.sesion_id;
  const clientes = useSelector(
    (state) => state && state.cliente && state.cliente
  );
  const ObrasSociales = useSelector(
    (state) => state && state.cliente && state.cliente.obrasSocialesState
  );
  const Ciudades = useSelector(
    (state) => state && state.cliente && state.cliente.ciudadesState
  );

  useEffect(() => {
    dispatch(
      getClientesAPI(page, pageSize, search, obraSocialID, ciudadID, sesion)
    );
    dispatch(getObrasSocialesAPI());
    dispatch(getCiudadesAPI());
  }, [dispatch, page, pageSize, search, obraSocialID, ciudadID]);

  const keys = Object.keys(
    (clientes && clientes.initialState && clientes.initialState[0]) || {}
  );

  const handleDelete = (cliente) => {
    const datoWithUserId = { ...cliente, usuario_id: usuarioId };
    Swal.fire({
      title: "Advertencia!",
      text: `¿Está seguro que desea eliminar al cliente ${cliente.Nombre} ${cliente.Apellido}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteClienteAPI(datoWithUserId));
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleObraSocialChange = (e) => {
    setObraSocialID(e.target.value);
  };

  const handleCiudadChange = (e) => {
    setCiudadID(e.target.value);
  };

  return (
    <div className="containerSelected">
      <div className="headerSelected">
        <div style={{ display: "flex" }}>
          <input
            className="inputSearch"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="&#xF002; Buscar..."
          />
        </div>
        <div style={{ display: "flex" }}>
          <ClienteForm
            ObrasSociales={ObrasSociales && ObrasSociales}
            Ciudades={Ciudades && Ciudades}
            usuarioId={usuarioId}
          />
        </div>
      </div>
      <div className="containerTableAndPagesSelected">
        <table className="headerTable">
          <thead>
            <tr>
              {keys
                .filter(
                  (column) =>
                    column !== "cliente_id" &&
                    column !== "obra_social_id" &&
                    column !== "ciudad_id"
                )
                .map((column, index) => (
                  <th key={`header-${column}-${index}`}>
                    {column == "obra_social" ? "Obra Social" : column}
                  </th>
                ))}
              <th style={{ width: "70px" }}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes &&
            clientes.initialState &&
            clientes.initialState.length === 0 ? (
              <tr>
                <td colSpan={keys.length + 1} className="NoData">
                  Sin datos
                </td>
              </tr>
            ) : (
              clientes &&
              clientes.initialState &&
              clientes.initialState.map((cliente) => (
                <tr key={cliente.cliente_id}>
                  {keys
                    .filter(
                      (column) =>
                        column !== "cliente_id" &&
                        column !== "obra_social_id" &&
                        column !== "ciudad_id"
                    )
                    .map((column) => (
                      <td key={`${cliente.cliente_id}-${column}`}>
                        {cliente[column]}
                      </td>
                    ))}
                  <td style={{ flexWrap: "nowrap" }}>
                    <EditClienteForm
                      clienteSelected={cliente}
                      ObrasSociales={ObrasSociales && ObrasSociales}
                      Ciudades={Ciudades && Ciudades}
                      usuarioId={usuarioId}
                    />
                    <FaRegTrashAlt
                      className="iconABM"
                      onClick={() => handleDelete(cliente)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div /* style={{ border: "solid 1px" }} */>
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
          disabled={
            clientes &&
            clientes.initialState &&
            clientes.initialState.length < pageSize
          }
          className="buttonPage"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Clientes;

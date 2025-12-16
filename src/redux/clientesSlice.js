/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const initialState = {
  initialState: [],
  obrasSocialesState: [],
  ciudadesState: [],
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
  },
};

const clientesSlice = createSlice({
  name: "clientes",
  initialState,
  reducers: {
    getClientes: (state, action) => {
      const payload = action.payload;

      const clientes = Array.isArray(payload?.clientes)
        ? payload.clientes
        : Array.isArray(payload)
        ? payload
        : [];

      state.initialState = clientes;

      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.pagination = {
          total: payload.total ?? state.pagination.total,
          page: payload.page ?? state.pagination.page,
          pageSize: payload.pageSize ?? state.pagination.pageSize,
        };
      }
    },
    getObrasSociales: (state, action) => {
      const payload = action.payload;
      const obrasSociales = Array.isArray(payload?.obrasSociales)
        ? payload.obrasSociales
        : Array.isArray(payload)
        ? payload
        : [];

      state.obrasSocialesState = obrasSociales;
    },
    getCiudades: (state, action) => {
      state.ciudadesState = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    addCliente: (state, action) => {
      const currentClientes = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = [action.payload, ...currentClientes];
    },
    deleteCliente: (state, action) => {
      const currentClientes = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = currentClientes.filter(
        (cliente) => cliente?.cliente_id !== action?.payload
      );
    },
    editCliente: (state, action) => {
      const currentClientes = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = currentClientes.map((cliente) =>
        cliente?.cliente_id === action?.payload?.cliente_id
          ? action.payload
          : cliente
      );
    },
  },
});

export const {
  getClientes,
  getObrasSociales,
  getCiudades,
  addCliente,
  deleteCliente,
  editCliente,
} = clientesSlice.actions;

// Funciones API para interactuar con el backend

export const getClientesAPI = (
  page,
  pageSize,
  search,
  obraSocialID,
  ciudadID,
  sesion
) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/clientes`, {
        params: {
          page,
          pageSize,
          search,
          obraSocialID,
          ciudadID,
          sesion,
        },
      });

      if (response.status === 200) {
        dispatch(getClientes(response.data));
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };
};

export const addClienteAPI = (clienteData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/clientes`, clienteData);

      if (response.status === 201) {
        const newCliente = {
          cliente_id: response.data.cliente_id,
          Nombre: clienteData.nombre,
          Apellido: clienteData.apellido,
          DNI: clienteData.dni,
          obra_social_id: clienteData.obra_social_id,
          obra_social: clienteData.obra_social,
          ciudad_id: clienteData.ciudad_id,
          Ciudad: clienteData.Ciudad,
        };

        dispatch(addCliente(newCliente));
        Swal.fire({
          icon: "success",
          title: "Cliente agregado",
          text: "El cliente ha sido agregado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        const status = error.response.status;
        const mensaje = error.response.data?.mensaje || error.response.data?.message;
        
        if (status === 409) {
          // DNI duplicado
          Swal.fire({
            icon: "warning",
            title: "DNI duplicado",
            text: mensaje || "El DNI ingresado ya está registrado. Por favor, verifica el DNI e intenta nuevamente.",
          });
        } else if (status === 400) {
          // Error de validación
          Swal.fire({
            icon: "warning",
            title: "Error de validación",
            text: mensaje || "Por favor, completa todos los campos requeridos correctamente.",
          });
        } else {
          // Otro error del servidor
          Swal.fire({
            icon: "error",
            title: "Error",
            text: mensaje || "Hubo un problema al agregar el cliente. Inténtalo nuevamente.",
          });
        }
      } else if (error.request) {
        // Error de conexión
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
        });
      } else {
        // Otro error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al agregar el cliente.",
        });
      }
    }
  };
};

export const deleteClienteAPI = (clienteData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/clientes/delete/${clienteData.cliente_id}`,
        clienteData
      );

      if (response.status === 200) {
        dispatch(deleteCliente(clienteData.cliente_id));
        Swal.fire({
          icon: "success",
          title: "Cliente eliminado",
          text: "El cliente ha sido eliminado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el cliente.",
      });
    }
  };
};

export const editClienteAPI = (clienteData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/clientes/${clienteData.cliente_id}`,
        clienteData
      );

      if (response.status === 200) {
        const editarCliente = {
          cliente_id: clienteData.cliente_id,
          Nombre: clienteData.nombre,
          Apellido: clienteData.apellido,
          DNI: clienteData.dni,
          obra_social_id: clienteData.obra_social_id,
          obra_social: clienteData.obra_social,
          ciudad_id: clienteData.ciudad_id,
          Ciudad: clienteData.Ciudad,
        };
        dispatch(editCliente(editarCliente));
        Swal.fire({
          icon: "success",
          title: "Cliente actualizado",
          text: "El cliente ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el cliente.",
      });
    }
  };
};

export const getObrasSocialesAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/clientes/obras-sociales`);

      if (response.status === 200) {
        dispatch(getObrasSociales(response.data));
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };
};

export const getCiudadesAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/clientes/ciudades`);

      if (response.status === 200) {
        dispatch(getCiudades(response.data));
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };
};

export default clientesSlice.reducer;

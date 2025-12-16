/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../config";

const initialState = {
  initialState: [],
  rolesState: [],
  loginState: {},
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

const usuarioDataSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    getUsuarioLogin: (state, action) => {
      state.loginState = action.payload || {};
    },
    logoutUsuario: (state) => {
      state.loginState = {};
    },
    getUsuarios: (state, action) => {
      const payload = action.payload;

      const usuarios = Array.isArray(payload?.usuarios)
        ? payload.usuarios
        : Array.isArray(payload)
        ? payload
        : [];

      state.initialState = usuarios;

      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.pagination = {
          total: payload.total ?? state.pagination.total,
          page: payload.page ?? state.pagination.page,
          pageSize: payload.pageSize ?? state.pagination.pageSize,
          totalPages: payload.totalPages ?? state.pagination.totalPages,
        };
      }
    },
    getRoles: (state, action) => {
      const roles = Array.isArray(action.payload) ? action.payload : [];
      state.rolesState = roles;
    },
    addUsuario: (state, action) => {
      const currentUsuarios = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = [action.payload, ...currentUsuarios];
    },
    deleteUsuario: (state, action) => {
      const currentUsuarios = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = currentUsuarios.filter(
        (usuarioData) => usuarioData?.usuario_id !== action?.payload
      );
    },
    editUsuario: (state, action) => {
      const currentUsuarios = Array.isArray(state.initialState)
        ? state.initialState
        : [];

      state.initialState = currentUsuarios.map((usuarioData) =>
        usuarioData?.usuario_id === action?.payload?.usuario_id
          ? action.payload
          : usuarioData
      );
    },
  },
});

export const {
  getUsuarioLogin,
  logoutUsuario,
  getUsuarios,
  getRoles,
  addUsuario,
  deleteUsuario,
  editUsuario,
} = usuarioDataSlice.actions;

// Funciones API para interactuar con el backend

export const getUsuariosAPI = (page, pageSize, search, rolID, sesion) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios`, {
        params: {
          page,
          pageSize,
          search,
          rolID,
          sesion,
        },
      });

      if (response.status === 200) {
        dispatch(getUsuarios(response.data));
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };
};

export const getRolesAPI = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios/roles`);

      if (response.status === 200) {
        // Asegurarse de que response.data es un array
        const roles = Array.isArray(response.data) ? response.data : (response.data?.rows || []);
        console.log("Roles obtenidos:", roles);
        dispatch(getRoles(roles));
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
      console.error("Detalles del error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // En caso de error, establecer un array vacío para evitar errores en el frontend
      dispatch(getRoles([]));
    }
  };
};

export const addUsuarioAPI = (usuarioData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/usuarios`, usuarioData);

      if (response.status === 201) {
        const newUsuario = {
          usuario_id: response.data.usuario_id,
          Nombre: usuarioData.nombre,
          Apellido: usuarioData.apellido,
          Correo: usuarioData.correo,
          Rol: usuarioData.Rol,
          rol_id: usuarioData.rol_id,
        };
        dispatch(addUsuario(newUsuario));
        Swal.fire({
          icon: "success",
          title: "Usuario agregado",
          text: "El usuario ha sido agregado correctamente.",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: error.response.data?.mensaje || "Error de validación",
        });
      } else if (error.response && error.response.status) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data?.mensaje || `Error ${error.response.status}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor.",
        });
      }
    }
  };
};

export const deleteUsuarioAPI = (usuarioData) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API}/usuarios/${usuarioData.usuario_id}`
      );

      if (response.status === 200) {
        dispatch(deleteUsuario(usuarioData.usuario_id));
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          text: "El usuario ha sido eliminado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el usuario.",
      });
    }
  };
};

export const editUsuarioAPI = (usuarioData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${API}/usuarios/${usuarioData.usuario_id}`,
        usuarioData
      );

      if (response.status === 200) {
        const editarUsuario = {
          usuario_id: usuarioData.usuario_id,
          Nombre: usuarioData.nombre,
          Apellido: usuarioData.apellido,
          Correo: usuarioData.correo,
          Rol: usuarioData.Rol,
          rol_id: usuarioData.rol_id,
        };
        dispatch(editUsuario(editarUsuario));
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: "El usuario ha sido actualizado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el usuario.",
      });
    }
  };
};

export const getUsuarioLoginAPI = (
  correo,
  password,
  ip_address,
  user_agent
) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios/login`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: {
          correo: correo && correo,
          contrasena: password && password,
          ip_address: ip_address && ip_address,
          user_agent: user_agent && user_agent,
        },
      });

      if (response.status === 200) {
        dispatch(getUsuarioLogin(response.data));
      }
    } catch (error) {
      // Verificar si es un error de conexión (sin response)
      if (!error.response) {
        // Error de conexión o backend no disponible
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
        });
        // Limpiar el estado de login
        dispatch(getUsuarioLogin({}));
        return;
      }

      // Si hay response, es un error del servidor
      if (error.response.status === 401) {
        // Error de autenticación (usuario o contraseña incorrectos)
        const mensaje =
          (typeof error.response.data === 'object' && error.response.data?.mensaje) ||
          (typeof error.response.data === 'string' && error.response.data) ||
          "Usuario o contraseña incorrectos";
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: mensaje,
        });
        // Limpiar el estado de login
        dispatch(getUsuarioLogin({}));
      } else if (error.response.status) {
        // Otro error del servidor
        const mensaje =
          (typeof error.response.data === 'object' && error.response.data?.mensaje) ||
          (typeof error.response.data === 'string' && error.response.data) ||
          `Error ${error.response.status}`;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: mensaje,
        });
        // Limpiar el estado de login
        dispatch(getUsuarioLogin({}));
      }
    }
  };
};

export const updatePasswordDataAPI = (dataUser) => {
  const { correo, currentPassword } = dataUser;
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/usuarios/login`, {
        params: {
          correo: correo && correo,
          contrasena: currentPassword && currentPassword,
        },
      });
      if (response?.data.correo !== undefined) {
        const action = response?.data;
        if (action !== 1) {
          const response2 = await axios.put(
            `${API}/usuarios/pwd/${correo}`,
            dataUser
          );
          if (response2?.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Password actualizado",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Password no pudo actualizarse",
            });
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Password invalido",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Advertencia!",
          text: error.response.data || "Credenciales inválidas",
        });
      } else if (error.response && error.response.status) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response.data?.mensaje || error.response.data || `Error ${error.response.status}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor.",
        });
      }
    }
  };
};

export const resetPasswordDataAPI = (dataUser) => {
  const { correo } = dataUser;

  return async (dispatch) => {
    try {
      const response2 = await axios.put(
        `${API}/usuarios/pwd/${correo}`,
        dataUser
      );
      if (response2?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password Updated",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Password cannot be updated",
        });
      }
    } catch (error) {}
  };
};

export const logoutUsuarioAPI = (sesion_id) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${API}/usuarios/logout/${sesion_id}`);
      if (response && response?.status === 200) {
        dispatch(logoutUsuario());
      }
    } catch (error) {
      console.log("error ", error);
    }
  };
};

export default usuarioDataSlice.reducer;

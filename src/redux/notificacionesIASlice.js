/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const initialState = {
  notificaciones: null,
  predicciones: null,
  resumen: null,
  loading: false,
  error: null,
  ultimaActualizacion: null,
};

const notificacionesIASlice = createSlice({
  name: "notificacionesIA",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getNotificaciones: (state, action) => {
      const payload = action.payload;
      state.notificaciones = payload?.notificaciones || null;
      state.resumen = payload?.resumen || null;
      state.ultimaActualizacion = payload?.timestamp || new Date().toISOString();
      state.loading = false;
      state.error = null;
    },
    getPredicciones: (state, action) => {
      state.predicciones = action.payload || null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, getNotificaciones, getPredicciones } =
  notificacionesIASlice.actions;

// Selectors
export const selectNotificaciones = (state) => state.notificacionesIA.notificaciones;
export const selectPredicciones = (state) => state.notificacionesIA.predicciones;
export const selectResumen = (state) => state.notificacionesIA.resumen;
export const selectNotificacionesIALoading = (state) => state.notificacionesIA.loading;
export const selectNotificacionesIAError = (state) => state.notificacionesIA.error;
export const selectUltimaActualizacion = (state) => state.notificacionesIA.ultimaActualizacion;

// Async thunks
export const getNotificacionesIAPI = (dias = 30) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${API}/notificaciones-ia/vencimientos?dias=${dias}`);
    dispatch(getNotificaciones(response.data));
  } catch (error) {
    console.error("Error al obtener notificaciones IA:", error);
    dispatch(setError(error.response?.data?.mensaje || "Error al obtener notificaciones"));
  }
};

export const getPrediccionesIAPI = (dias = 60) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${API}/notificaciones-ia/predicciones?dias=${dias}`);
    dispatch(getPredicciones(response.data));
  } catch (error) {
    console.error("Error al obtener predicciones IA:", error);
    dispatch(setError(error.response?.data?.mensaje || "Error al obtener predicciones"));
  }
};

export default notificacionesIASlice.reducer;









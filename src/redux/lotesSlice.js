/* eslint-disable eqeqeq */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const initialState = {
  lotes: [],
  productosPorVencer: [],
  perdidasVencimientos: [],
  movimientosLote: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

const lotesSlice = createSlice({
  name: "lotes",
  initialState,
  reducers: {
    getLotes: (state, action) => {
      const payload = action.payload;
      const lotes = Array.isArray(payload) ? payload : [];

      state.lotes = lotes;
      state.loading = false;
      state.error = null;

      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.pagination = {
          total: payload.total ?? state.pagination.total,
          page: payload.page ?? state.pagination.page,
          pageSize: payload.pageSize ?? state.pagination.pageSize,
          totalPages: payload.totalPages ?? state.pagination.totalPages,
        };
      }
    },
    getProductosPorVencer: (state, action) => {
      state.productosPorVencer = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
    getPerdidasVencimientos: (state, action) => {
      state.perdidasVencimientos = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
    getMovimientosLote: (state, action) => {
      state.movimientosLote = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLote: (state, action) => {
      state.lotes.push(action.payload);
    },
    updateLote: (state, action) => {
      const index = state.lotes.findIndex((l) => l.lote_id === action.payload.lote_id);
      if (index !== -1) {
        state.lotes[index] = { ...state.lotes[index], ...action.payload };
      }
    },
  },
});

export const {
  getLotes,
  getProductosPorVencer,
  getPerdidasVencimientos,
  getMovimientosLote,
  setLoading,
  setError,
  addLote,
  updateLote,
} = lotesSlice.actions;

// Selectores
export const selectLotes = (state) => state?.lotes?.lotes || [];
export const selectProductosPorVencer = (state) => state?.lotes?.productosPorVencer || [];
export const selectPerdidasVencimientos = (state) => state?.lotes?.perdidasVencimientos || [];
export const selectLotesLoading = (state) => state?.lotes?.loading || false;
export const selectLotesError = (state) => state?.lotes?.error;

// Funciones API
export const getLotesAPI = (options = {}) => {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    productoId = null,
    estado = null,
    diasVencimiento = null,
  } = options;

  return async (dispatch) => {
    try {
      dispatch(setLoading());
      const params = {
        page,
        pageSize,
        search,
      };

      if (productoId) params.productoId = productoId;
      if (estado) params.estado = estado;
      if (diasVencimiento) params.diasVencimiento = diasVencimiento;

      const response = await axios.get(`${API}/lotes`, { params });

      if (response.status === 200) {
        dispatch(getLotes(response.data || []));
      }
    } catch (error) {
      console.error("Error al obtener lotes:", error);
      dispatch(setError(error.response?.data?.mensaje || error.message));
      dispatch(getLotes([]));
    }
  };
};

export const getProductosPorVencerAPI = (dias = 30) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading());
      const response = await axios.get(`${API}/lotes/por-vencer`, {
        params: { dias },
      });

      if (response.status === 200) {
        dispatch(getProductosPorVencer(response.data || []));
      }
    } catch (error) {
      console.error("Error al obtener productos por vencer:", error);
      dispatch(setError(error.response?.data?.mensaje || error.message));
      dispatch(getProductosPorVencer([]));
    }
  };
};

export const getPerdidasVencimientosAPI = (fechaDesde = null, fechaHasta = null) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading());
      const params = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;

      const response = await axios.get(`${API}/lotes/perdidas`, { params });

      if (response.status === 200) {
        dispatch(getPerdidasVencimientos(response.data || []));
      }
    } catch (error) {
      console.error("Error al obtener pérdidas:", error);
      dispatch(setError(error.response?.data?.mensaje || error.message));
      dispatch(getPerdidasVencimientos([]));
    }
  };
};

export const getMovimientosLoteAPI = (loteId) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading());
      const response = await axios.get(`${API}/lotes/${loteId}/movimientos`);

      if (response.status === 200) {
        dispatch(getMovimientosLote(response.data || []));
      }
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
      dispatch(setError(error.response?.data?.mensaje || error.message));
      dispatch(getMovimientosLote([]));
    }
  };
};

export const addLoteAPI = (loteData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API}/lotes`, loteData);

      if (response.status === 201) {
        dispatch(getLotesAPI());
        return { success: true, lote_id: response.data.lote_id };
      }
    } catch (error) {
      console.error("Error al agregar lote:", error);
      throw error;
    }
  };
};

export const updateCantidadLoteAPI = (loteId, nuevaCantidad, motivo, usuarioId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${API}/lotes/${loteId}/cantidad`, {
        nueva_cantidad: nuevaCantidad,
        motivo,
        usuario_id: usuarioId,
      });

      if (response.status === 200) {
        dispatch(getLotesAPI());
        return { success: true };
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      throw error;
    }
  };
};

export default lotesSlice.reducer;









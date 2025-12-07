import { configureStore } from "@reduxjs/toolkit";
import productoDataSlice from "../redux/productosSlice";
import usuarioDataSlice from "../redux/usuariosSlice";
import proveedorDataSlice from "../redux/proveedoresSlice";
import clienteDataSlice from "../redux/clientesSlice";
import obraSocialDataSlice from "../redux/obrasSocialesSlice";
import ventaDataSlice from "../redux/ventasSlice";
import reporteDataSlice from "../redux/reportesSlice";
import auditoriaProductosDataSlice from "../redux/auditoriaProductosSlice";
import auditoriaClientesDataSlice from "../redux/auditoriaClientesSlice";
import auditoriaObrasSocialesDataSlice from "../redux/auditoriaObrasSocialesSlice";
import liquidacionObrasSocialesDataSlice from "../redux/liquidacionObrasSocialesSlice";
import sesionesDataSlice from "../redux/sesionesSlice";
import lotesDataSlice from "../redux/lotesSlice";

export default configureStore({
  reducer: {
    venta: ventaDataSlice,
    producto: productoDataSlice,
    usuario: usuarioDataSlice,
    proveedor: proveedorDataSlice,
    cliente: clienteDataSlice,
    obrasocial: obraSocialDataSlice,
    reporte: reporteDataSlice,
    auditoriaProductos: auditoriaProductosDataSlice,
    auditoriaClientes: auditoriaClientesDataSlice,
    auditoriaObrasSociales: auditoriaObrasSocialesDataSlice,
    liquidacionObrasSociales: liquidacionObrasSocialesDataSlice,
    sesiones: sesionesDataSlice,
    lotes: lotesDataSlice,
  },
});

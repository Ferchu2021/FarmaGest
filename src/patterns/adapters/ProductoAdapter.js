/**
 * Adapter Pattern para transformar datos entre formatos del backend y frontend
 * Elimina duplicación de lógica de transformación
 */
class ProductoAdapter {
  /**
   * Adapta datos del formulario al formato del backend
   * @param {Object} formData - Datos del formulario
   * @param {number} usuarioId - ID del usuario
   * @returns {Object} Datos en formato del backend
   */
  static toBackendFormat(formData, usuarioId) {
    return {
      nombre: formData.productoNombre,
      codigo: formData.codigo,
      marca: formData.marca,
      categoria_id: formData.categoriaID === 0 || formData.categoriaID === "" ? null : parseInt(formData.categoriaID),
      precio: ProductoAdapter.parseDecimal(formData.precio),
      precio_compra_base: formData.precio_compra_base ? ProductoAdapter.parseDecimal(formData.precio_compra_base) : null,
      stock: parseInt(formData.cantidad, 10),
      proveedor_id: formData.proveedorID === 0 || formData.proveedorID === "" ? null : parseInt(formData.proveedorID),
      es_medicamento: formData.es_medicamento === true || formData.es_medicamento === "true",
      porcentaje_iva: formData.porcentaje_iva ? ProductoAdapter.parseDecimal(formData.porcentaje_iva) : 21,
      usuario_id: usuarioId,
    };
  }

  /**
   * Adapta respuesta del backend al formato del frontend
   * @param {Object} backendResponse - Respuesta del backend
   * @param {Object} formData - Datos originales del formulario
   * @returns {Object} Datos en formato del frontend
   */
  static toFrontendFormat(backendResponse, formData) {
    return {
      producto_id: backendResponse.producto_id,
      Nombre: formData.productoNombre,
      Codigo: formData.codigo,
      Marca: formData.marca,
      Categoria: formData.categoriaDesc,
      categoria_id: formData.categoriaID === 0 || formData.categoriaID === "" ? null : parseInt(formData.categoriaID),
      Stock: parseInt(formData.cantidad),
      Precio: ProductoAdapter.parseDecimal(formData.precio),
    };
  }

  /**
   * Adapta datos del backend al formato para edición en formulario
   * @param {Object} backendData - Datos del backend
   * @returns {Object} Datos en formato del formulario
   */
  static toEditFormat(backendData) {
    return {
      productoNombre: backendData.Nombre || "",
      codigo: backendData.Codigo || "",
      marca: backendData.Marca || "",
      categoriaID: backendData.categoria_id || 0,
      categoriaDesc: backendData.Categoria || "",
      precio: backendData.Precio || 0,
      cantidad: backendData.Stock || 0,
    };
  }

  /**
   * Adapta datos para actualización
   * @param {Object} formData - Datos del formulario
   * @param {number} productoId - ID del producto
   * @param {number} usuarioId - ID del usuario
   * @returns {Object} Datos en formato del backend
   */
  static toUpdateFormat(formData, productoId, usuarioId) {
    return {
      producto_id: productoId,
      nombre: formData.productoNombre,
      codigo: formData.codigo,
      marca: formData.marca,
      categoria_id: formData.categoriaID === 0 || formData.categoriaID === "" ? null : parseInt(formData.categoriaID),
      precio: ProductoAdapter.parseDecimal(formData.precio),
      precio_compra_base: formData.precio_compra_base ? ProductoAdapter.parseDecimal(formData.precio_compra_base) : null,
      stock: parseInt(formData.cantidad, 10),
      proveedor_id: formData.proveedorID === 0 || formData.proveedorID === "" ? null : parseInt(formData.proveedorID),
      es_medicamento: formData.es_medicamento === true || formData.es_medicamento === "true",
      porcentaje_iva: formData.porcentaje_iva ? ProductoAdapter.parseDecimal(formData.porcentaje_iva) : 21,
      usuario_id: usuarioId,
    };
  }

  /**
   * Adapta datos actualizados del backend al formato del frontend
   * @param {Object} formData - Datos del formulario
   * @param {number} productoId - ID del producto
   * @returns {Object} Datos en formato del frontend
   */
  static toUpdatedFrontendFormat(formData, productoId) {
    return {
      producto_id: productoId,
      Nombre: formData.productoNombre,
      Codigo: formData.codigo,
      Marca: formData.marca,
      Categoria: formData.categoriaDesc,
      categoria_id: formData.categoriaID === 0 || formData.categoriaID === "" ? null : parseInt(formData.categoriaID),
      Stock: parseInt(formData.cantidad),
      Precio: ProductoAdapter.parseDecimal(formData.precio),
    };
  }

  static parseDecimal(value) {
    if (value === null || value === undefined) return 0;
    const normalized = String(value).replace(",", ".");
    const result = parseFloat(normalized);
    return isNaN(result) ? 0 : result;
  }
}

export default ProductoAdapter;




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../shared/Layout";
import FormLogin from "../components/login/FormLogin";
import Ventas from "../components/Ventas/Ventas";
import Products from "../components/Productos/Products";
import Usuarios from "../components/Usuarios/Usuarios";
import Proveedores from "../components/Proveedores/Proveedores";
import Clientes from "../components/Clientes/Clientes";
import ObrasSociales from "../components/ObrasSociales/ObrasSociales";
import Pedidos from "../components/Pedidos/Pedidos";
import Reportes from "../components/Reportes/Reportes";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteVentas from "./PrivateVentas";
import PrivateRouteProveedores from "./PrivateProveedores";
import PrivateRoutePedidos from "./PrivatePedidos";
import PrivateRouteClientes from "./PrivateClientes";
import PrivateRouteUsuarios from "./PrivateUsuarios";
import PrivateRouteObrasSociales from "./PrivateObrasSociales";
import Auditoria from "../components/Auditoria/Auditoria";
import Sesiones from "../components/Auditoria/Sesiones";
import ForgotPassword from "../components/login/ForgotPassword";
import ResetForgottenPassword from "../components/login/ResetForgottenPassword";
import ProductosPorVencer from "../components/Lotes/ProductosPorVencer";
import ReporteVencimientos from "../components/Lotes/ReporteVencimientos";
import Lotes from "../components/Lotes/Lotes";
import DashboardPredicciones from "../components/Predicciones/DashboardPredicciones";

const AppRouter = () => {
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  return (
    <Router>
      <Routes>
        {/* Ruta pública para el formulario de inicio de sesión */}
        <Route element={<PublicRoute logged={logged} />}>
          <Route path="/login" element={<FormLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetForgottenPassword />}
          />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateRoute logged={logged} />}>
          <Route element={<PrivateRoutePedidos logged={logged} />}>
            <Route
              path="/pedidos"
              element={
                <Layout title={"pedidos"}>
                  <Pedidos />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteProveedores logged={logged} />}>
            <Route
              path="/proveedores"
              element={
                <Layout title={"proveedores"}>
                  <Proveedores />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteVentas logged={logged} />}>
            <Route
              path="/ventas"
              element={
                <Layout title={"ventas"}>
                  <Ventas />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteClientes logged={logged} />}>
            <Route
              path="/clientes"
              element={
                <Layout title={"clientes"}>
                  <Clientes />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/"
            element={
              <Layout title={"productos"}>
                <Products />
              </Layout>
            }
          />
          <Route element={<PrivateRouteUsuarios logged={logged} />}>
            <Route
              path="/usuarios"
              element={
                <Layout title={"usuarios"}>
                  <Usuarios />
                </Layout>
              }
            />
            <Route
              path="/reportes"
              element={
                <Layout title={"reportes"}>
                  <Reportes />
                </Layout>
              }
            />
            <Route
              path="/auditoria"
              element={
                <Layout title={"auditoria"}>
                  <Auditoria />
                </Layout>
              }
            />
            <Route
              path="/sesiones"
              element={
                <Layout title={"sesiones"}>
                  <Sesiones />
                </Layout>
              }
            />
            <Route
              path="/lotes"
              element={
                <Layout title={"lotes"}>
                  <Lotes />
                </Layout>
              }
            />
            <Route
              path="/lotes/por-vencer"
              element={
                <Layout title={"productos-por-vencer"}>
                  <ProductosPorVencer />
                </Layout>
              }
            />
            <Route
              path="/lotes/reporte-perdidas"
              element={
                <Layout title={"reporte-vencimientos"}>
                  <ReporteVencimientos />
                </Layout>
              }
            />
            <Route
              path="/predicciones"
              element={
                <Layout title={"predicciones"}>
                  <DashboardPredicciones />
                </Layout>
              }
            />
          </Route>
          <Route element={<PrivateRouteObrasSociales logged={logged} />}>
            <Route
              path="/obras-sociales"
              element={
                <Layout title={"obras-sociales"}>
                  <ObrasSociales />
                </Layout>
              }
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

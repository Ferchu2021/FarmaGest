import React, { useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../imgs/logoNav.png";
import Section from "./Section";
import { Link } from "react-router-dom";
import { FaHandshake } from "react-icons/fa6";
import { LiaAddressCardSolid } from "react-icons/lia";
import { AiFillProduct } from "react-icons/ai";
import { IoBarChart } from "react-icons/io5";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { FaBell, FaShoppingCart, FaCalendarTimes } from "react-icons/fa";
import { ImUserTie } from "react-icons/im";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";
import { MdReportProblem } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import UsuarioLogout from "../components/Usuarios/UsuarioLogout";

const Layout = ({ children, title }) => {
  const [isOpen, setOpen] = useState(false);
  function capitalizeFirstLetter(value) {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }
  const logged = JSON.parse(sessionStorage.getItem("logged"));

  // Validar que logged y sesion existan antes de acceder a permisos
  // Si logged es null, usar un array vacío
  // Si logged.sesion no existe, usar un array vacío
  // Si permisos no existe o no es un array, convertir string a array
  let permisos = [];
  if (logged && logged.sesion) {
    if (logged.sesion.permisos) {
      if (Array.isArray(logged.sesion.permisos)) {
        permisos = logged.sesion.permisos;
      } else if (typeof logged.sesion.permisos === 'string') {
        // Convertir string separado por comas a array
        permisos = logged.sesion.permisos.split(',').map(p => p.trim()).filter(p => p.length > 0);
      } else {
        permisos = [logged.sesion.permisos];
      }
    }
  }
  
  // Debug: mostrar en consola si no hay permisos (solo en desarrollo)
  if (process.env.NODE_ENV === 'development' && permisos.length === 0 && logged) {
    console.warn('⚠️ No se encontraron permisos en sessionStorage:', logged);
    console.warn('⚠️ Permisos raw:', logged.sesion?.permisos);
  }

  return (
    <div className="containerGeneralAPP">
      <header>
        <div
          style={{
            backgroundColor: "#000",
            color: "#abd34e",

            padding: "12px",
          }}
        >
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <div className="headerContainer">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <img className="logo" src={logo} alt="logo" />
            </div>
            <div
              style={{
                fontSize: "2em",
                fontWeight: "bold",
                marginLeft: "20px",
                color: "#abd34e",
              }}
            >
              {title === undefined
                ? "productos"
                : (() => {
                    switch (title) {
                      case "obras-sociales":
                        return "Obras Sociales";
                      case "productos-por-vencer":
                        return "Productos por Vencer";
                      case "reporte-vencimientos":
                        return "Reporte de Pérdidas";
                      case "predicciones":
                        return "Predicciones IA";
                      default:
                        return capitalizeFirstLetter(title);
                    }
                  })()}
            </div>
          </div>
          <div>
            <UsuarioLogout />
          </div>
        </div>
      </header>
      <div className="bodyContainer">
        <nav className={!isOpen ? "smallActive" : "smallInactive"}>
          {/*    {permisos.includes(
            "gestion_pedidos" && logged.sesion.rol !== "admin"
          ) && (
            <Link to="/pedidos">
              <RiShoppingBag4Fill className="iconMenu" />
            </Link>
          )} */}
          {permisos.includes("gestion_proveedores") && (
            <Link to="/proveedores">
              <ImUserTie className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_ventas") && (
            <Link to="/ventas">
              <FaShoppingCart className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_clientes") && (
            <Link to="/clientes">
              <FaHandshake className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_obras_sociales") && (
            <Link to="/obras-sociales">
              <LiaAddressCardSolid className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_productos") && (
            <Link to="/">
              <AiFillProduct className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link to="/usuarios">
              <HiUsers className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link to="/reportes">
              <IoBarChart className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link to="/auditoria">
              <AiOutlineFileSearch className="iconMenu" />
            </Link>
          )}
          {permisos.includes("gestion_productos") && (
            <>
              <Link to="/lotes">
                <BiPackage className="iconMenu" />
              </Link>
              <Link to="/lotes/por-vencer">
                <FaCalendarTimes className="iconMenu" />
              </Link>
              <Link to="/lotes/reporte-perdidas">
                <MdReportProblem className="iconMenu" />
              </Link>
              <Link to="/predicciones">
                <FaChartLine className="iconMenu" />
              </Link>
            </>
          )}
        </nav>

        <nav className={isOpen ? "bigActive" : "bigInactive"}>
          {/*      {permisos.includes("gestion_pedidos") &&
            logged.sesion.rol !== "admin" && (
              <Link className="itemMenu" to="/pedidos">
                <RiShoppingBag4Fill className="iconMenu" />
                <span>Pedidos</span>
              </Link>
            )} */}
          {permisos.includes("gestion_proveedores") && (
            <Link className="itemMenu" to="/proveedores">
              <ImUserTie className="iconMenu" />
              <span>Proveedores</span>
            </Link>
          )}
          {permisos.includes("gestion_ventas") && (
            <Link className="itemMenu" to="/ventas">
              <FaShoppingCart className="iconMenu" />
              <span>Ventas</span>
            </Link>
          )}
          {permisos.includes("gestion_clientes") && (
            <Link className="itemMenu" to="/clientes">
              <FaHandshake className="iconMenu" />
              <span>Clientes</span>
            </Link>
          )}
          {permisos.includes("gestion_obras_sociales") && (
            <Link className="itemMenu" to="/obras-sociales">
              <LiaAddressCardSolid className="iconMenu" />
              <span>Obras Sociales</span>
            </Link>
          )}
          {permisos.includes("gestion_productos") && (
            <Link className="itemMenu" to="/">
              <AiFillProduct className="iconMenu" />
              <span>Productos</span>
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link className="itemMenu" to="/usuarios">
              <HiUsers className="iconMenu" />
              <span>Usuarios</span>
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link className="itemMenu" to="/reportes">
              <IoBarChart className="iconMenu" />
              <span>Reportes</span>
            </Link>
          )}
          {permisos.includes("gestion_usuarios") && (
            <Link className="itemMenu" to="/auditoria">
              <AiOutlineFileSearch className="iconMenu" />
              <span>Auditoría</span>
            </Link>
          )}
          {permisos.includes("gestion_productos") && (
            <>
              <Link className="itemMenu" to="/lotes">
                <BiPackage className="iconMenu" />
                <span>Lotes</span>
              </Link>
              <Link className="itemMenu" to="/lotes/por-vencer">
                <FaCalendarTimes className="iconMenu" />
                <span>Por Vencer</span>
              </Link>
              <Link className="itemMenu" to="/lotes/reporte-perdidas">
                <MdReportProblem className="iconMenu" />
                <span>Pérdidas</span>
              </Link>
              <Link className="itemMenu" to="/predicciones">
                <FaChartLine className="iconMenu" />
                <span>Predicciones IA</span>
              </Link>
            </>
          )}
        </nav>

        <section>
          <Section container={children} />
        </section>
      </div>
    </div>
  );
};

export default Layout;

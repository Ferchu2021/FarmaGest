import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addClienteAPI } from "../../redux/clientesSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const ClienteFormModal = ({ Ciudades, ObrasSociales, usuarioId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      DNI: "",
      obraSocialID: "",
      ciudadID: "",
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    try {
      dispatch(
        addClienteAPI({
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.DNI,
          obra_social_id:
            data.obraSocialID === "" ? null : parseInt(data.obraSocialID),
          obra_social:
            ObrasSociales.find(
              (o) => o.obra_social_id === Number(data.obraSocialID)
            )?.obra_social || "",
          ciudad_id: data.ciudadID === "" ? null : parseInt(data.ciudadID),
          Ciudad:
            Ciudades.find((c) => c.ciudad_id === Number(data.ciudadID))
              ?.ciudad || "",
          usuario_id: usuarioId,
        })
      );
      handleClose();
      // Limpiar campos después de agregar cliente
      setValue("nombre", "");
      setValue("apellido", "");
      setValue("DNI", "");
      setValue("obraSocialID", "");
      setValue("ciudadID", "");
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Agregar Cliente</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  {...register("nombre", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.nombre && (
                  <p className="text-danger">{errors.nombre.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  className="form-control"
                  {...register("apellido", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.apellido && (
                  <p className="text-danger">{errors.apellido.message}</p>
                )}
              </div>
              {/* <div className="form-group col-md-12">
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  className="form-control"
                  {...register("correo")}
                />
                {errors.correo && <p className="text-danger">{errors.correo.message}</p>}
              </div> */}
              <div className="form-group col-md-12">
                <label htmlFor="DNI">DNI:</label>
                <input
                  type="text"
                  id="DNI"
                  className="form-control"
                  {...register("DNI", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.DNI && (
                  <p className="text-danger">{errors.DNI.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="obraSocialID">Obra Social:</label>
                <select
                  id="obraSocialID"
                  className="form-select"
                  {...register("obraSocialID", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccionar obra social</option>
                  {ObrasSociales && Array.isArray(ObrasSociales) && ObrasSociales
                    .filter((obraSocial, index, self) => 
                      // Filtrar duplicados por nombre de obra social
                      index === self.findIndex((o) => o.obra_social === obraSocial.obra_social)
                    )
                    .map((obraSocial) => (
                      <option
                        key={obraSocial.obra_social_id}
                        value={obraSocial.obra_social_id}
                      >
                        {obraSocial.obra_social}
                      </option>
                    ))}
                </select>
                {errors.obraSocialID && (
                  <p className="text-danger">{errors.obraSocialID.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="ciudadID">Ciudad:</label>
                <select
                  id="ciudadID"
                  className="form-select"
                  {...register("ciudadID", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccionar ciudad</option>
                  {Ciudades?.map((ciudad) => (
                    <option key={ciudad.ciudad_id} value={ciudad.ciudad_id}>
                      {ciudad.ciudad}
                    </option>
                  ))}
                </select>
                {errors.ciudadID && (
                  <p className="text-danger">{errors.ciudadID.message}</p>
                )}
              </div>
            </div>
            <Modal.Footer>
              <Button className="buttonConfirm" type="submit">
                <FaSave className="iconConfirm" />
                Confirmar
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ClienteFormModal;

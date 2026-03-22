import prompts from "prompts";
import { GestorMultiversal } from "../gestor.js";
import { Invento } from "../inventos.js";

/**
 * Funcion que implementa los metodos de registro de Inventos
 * @param manager gestor del multiverso
 */
export async function mostrarMenuInvento(
  manager: GestorMultiversal,
): Promise<void> {
  let volver = false;
  while (!volver) {
    const respuesta = await prompts({
      type: "select",
      name: "accion",
      message: `Menu de Inventoes`,
      choices: [
        { title: "Anadir", value: "anadir" },
        { title: "Modificar", value: "modificar" },
        { title: "Eliminar", value: "eliminar" },
        { title: "Mostrar todo", value: "mostrar" },
        { title: "Volver", value: "volver" },
      ],
    });
    switch (respuesta.accion) {
      case "anadir":
        await addInventoMenu(manager);
        break;
      case "eliminar":
        await removeInventoMenu(manager);
        break;
      case "modificar":
        await modificarInventoMenu(manager);
        break;
      case "mostrar":
        const Invento = await manager.inventosRepo.getAll();
        console.log(Invento);
        break;
      case "volver":
        volver = true;
        break;
    }
  }
}

/**
 * Funcion que permite añadir Inventoes mediante prompts
 * @param manager el gestor del multiverso
 * @returns true si se ha creado la Invento de manera correcta
 */
async function addInventoMenu(manager: GestorMultiversal): Promise<boolean> {
  // Prompts para recopilar los datos del objeto
  const data = await prompts([
    {
      type: "text",
      name: "id",
      message: "Introduce el ID de la dimensión a añadir:",
      validate: (id) => (id.length > 0 ? true : "Debe de tener un ID"),
    },
    {
      type: "text",
      name: "nombre",
      message: "Nombre:",
      validate: (name) => (name.length > 0 ? true : "Debe de tener un nombre"),
    },
    {
      type: "select",
      name: "tipo",
      message: "Tipo de invento:",
      choices: [
        { title: "Arma", value: "Arma" },
        { title: "Dispositivo de viaje", value: "Dispositivo de viaje" },
        { title: "Biotecnologia", value: "Biotecnologia" },
        { title: "Objeto cotidiano absurdo", value: "Objeto cotidiano absurdo" },
      ],
    },
    {
      type: "text",
      name: "inventor",
      message: "Inventor:",
      validate: (inventor) => (inventor.length > 0 ? true : "Debe de tener un nombre"),
    },
    {
      type: "text",
      name: "nivelPeligro",
      message: "Nivel Peligro:",
      validate: (nivelPeligro) =>
        nivelPeligro >= 1 && nivelPeligro <= 10 ? true : "Debe ser entre 1-10",
    },
    {
      type: "text",
      name: "descripcion",
      message: "Descripción:",
      validate: (descripcion) =>
        descripcion.length > 0 ? true : "Debe de tener descripción",
    },
  ]);

  try {
    const newInvento = new Invento(
      data.id,
      data.nombre,
      data.inventor,
      data.tipo,
      Number(data.nivelPeligro),
      data.descripcion,
    );

    await manager.addInvento(newInvento);
    console.log(`La dimensión ${data.id} ha sido añadida correctamente`);
    return true;
  } catch (error: any) {
    console.log("Error", error.message);
    return false;
  }
}

/**
 * Funcion que permite eliminar una Invento del multiverso
 * @param manager el gestor del multiverso
 * @returns true si se ha eliminado la Invento de manera correcta
 * @throws Error si no existe el ID que se quiere eliminar
 */
async function removeInventoMenu(
  manager: GestorMultiversal,
): Promise<boolean> {
  // Prompt conseguir el id a eliminar
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "ID a eliminar:",
    validate: (id) => (id.length > 0 ? true : "Debe de tener un ID"),
  });

  try {
    await manager.removeInvento(id);
    console.log(`La Invento ${id} ha sido eliminada correctamente.`);
    return true;
  } catch (error: any) {
    console.log("Error", error.message);
    return false;
  }
}

/**
 * Funcion que permite modificar los elementos de una Invento en la base de datos
 * @param manager 
 * @throws Error si no se ha podido modificar la Invento o si no existe
 */
async function modificarInventoMenu(manager: GestorMultiversal) {
  // Prompts para recopilar los datos para modificar
  const data = await prompts([
    {
      type: "text",
      name: "id",
      message: "Introduce el ID de la dimensión a añadir:",
      validate: (id) => (id.length > 0 ? true : "Debe de tener un ID"),
    },
    {
      type: "text",
      name: "nombre",
      message: "Nombre: (vacio para no modificar)",
    },
    {
      type: "select",
      name: "tipo",
      message: "Tipo de invento:",
      choices: [
        { title: "Sin cambio", value: null },
        { title: "Arma", value: "Arma" },
        { title: "Dispositivo de viaje", value: "Dispositivo de viaje" },
        { title: "Biotecnologia", value: "Biotecnologia" },
        { title: "Objeto cotidiano absurdo", value: "Objeto cotidiano absurdo" },
      ],
    },
    {
      type: "text",
      name: "inventor",
      message: "Inventor:",
    },
    {
      type: "text",
      name: "nivelPeligro",
      message: "Nivel peligro: (vacio para no modificar)",
      validate: (nivelPeligro) =>
        (nivelPeligro >= 1 && nivelPeligro <= 10) || nivelPeligro.length === 0
          ? true
          : "Debe ser entre 1-10",
    },
    {
      type: "text",
      name: "descripcion",
      message: "Descripción: (vacio para no modificar)",
    },
  ]);
  try {
    const mod: any = {};
    if (data.nombre) mod.nombre = data.nombre;
    if (data.tipo !== null) mod.tipo = data.tipo;
    if (!isNaN(data.nivelPeligro)) mod.nivelPeligro = Number(data.nivelPeligro);
    if (data.inventor) mod.inventor = data.inventor;
    if (data.descripcion) mod.descripcion = data.descripcion;

    const result = await manager.updateInvento(data.id, mod);
    console.log(`La Invento ${data.id} ha sido modificada correctamente.`);
  } catch (error: any) {
    console.log("error", error.message);
  }
}

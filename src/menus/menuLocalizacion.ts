import prompts from "prompts";
import { GestorMultiversal } from "../gestor.js";
import { Localizacion } from "../localizaciones.js";
import { tipoLocalizacion } from "../types.js";

/**
 * Funcion que implementa los metodos de registro de Localizaciones
 * @param manager gestor del multiverso
 */
export async function mostrarMenuLocalizacion(
  manager: GestorMultiversal,
): Promise<void> {
  let volver = false;
  while (!volver) {
    const respuesta = await prompts({
      type: "select",
      name: "accion",
      message: `Menu de Localizaciones`,
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
        await addLocalizacionMenu(manager);
        break;
      case "eliminar":
        await removeLocalizacionMenu(manager);
        break;
      case "modificar":
        await modificarLocalizacionMenu(manager);
        break;
      case "mostrar":
        const Localizacion = await manager.localizacionesRepo.getAll();
        console.log(Localizacion);
        break;
      case "volver":
        volver = true;
        break;
    }
  }
}

/**
 * Funcion que permite añadir localizaciones mediante prompts
 * @param manager el gestor del multiverso
 * @returns true si se ha creado la localizaciones de manera correcta
 */
async function addLocalizacionMenu(manager:GestorMultiversal) {
  // Prompts para recopilar los datos del objeto
    const data = await prompts([
      {
        type: "text",
        name: "id",
        message: "Introduce el ID de la localizacion a añadir:",
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
        message: "Tipo de localizacion:",
        choices: [
          { title: "Planeta", value: "Planeta" },
          { title: "Estacion espacial", value: "Estacion espacial" },
          { title: "Dimension de bolsillo", value: "Dimension de bolsillo" },
          { title: "Simulacion virtual", value: "Simulacion virtual" },
        ],
      }, 
      {
        type: "text",
        name: "poblacionAproximada",
        message: "Poblacion aproximada:",
        validate: (poblacionAproximada) =>
          poblacionAproximada >= 0 ? true : "No puede ser negativo",
      },
      {
        type: "text",
        name: "dimension",
        message: "Dimension de origen:",
        validate: (dimension) =>
          dimension.length > 0 ? true : "Debe de tener una dimension de origen",
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
      const newDimension = new Localizacion(
        data.id,
        data.nombre,
        data.tipo,
        data.poblacionAproximada,
        data.dimension,
        data.descripcion,
      );
  
      await manager.addLocalizacion(newDimension);
      console.log(`La localizacion ${data.id} ha sido añadida correctamente`);
      return true;
    } catch (error: any) {
      console.log("Error", error.message);
      return false;
    }
}

/**
 * Funcion que permite eliminar una localizacion del multiverso
 * @param manager el gestor del multiverso
 * @returns true si se ha eliminado la localizacion de manera correcta
 * @throws Error si no existe el ID que se quiere eliminar
 */
async function removeLocalizacionMenu(
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
    await manager.removeLocalizacion(id);
    console.log(`La localizacion ${id} ha sido eliminada correctamente.`);
    return true;
  } catch (error: any) {
    console.log("Error", error.message);
    return false;
  }
}

/**
 * Funcion que permite modificar los elementos de una localizacion en la base de datos
 * @param manager 
 * @throws Error si no se ha podido modificar la localizacion o si no existe
 */
async function modificarLocalizacionMenu(manager: GestorMultiversal) {
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
        message: "Tipo de localizacion:",
        choices: [
          { title: "Sin modificad", value: null},
          { title: "Planeta", value: "Planeta" },
          { title: "Estacion espacial", value: "Estacion espacial" },
          { title: "Dimension de bolsillo", value: "Dimension de bolsillo" },
          { title: "Simulacion virtual", value: "Simulacion virtual" },
        ],
      }, 
    {
        type: "text",
        name: "poblacionAproximada",
        message: "Poblacion aproximada: (vacio para no modificar)",
        validate: (poblacionAproximada) =>
          poblacionAproximada >= 0 || poblacionAproximada.length === 0 ? true : "No puede ser negativo",
      },
      {
        type: "text",
        name: "dimension",
        message: "Dimension de origen: (vacio para no modificar)",
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
    if (!isNaN(data.poblacionAproximada)) mod.poblacionAproximada = Number(data.poblacionAproximada);
    if (data.dimension) mod.dimension = data.dimension;
    if (data.descripcion) mod.descripcion = data.descripcion;

    const result = await manager.updateLocalizacion(data.id, mod);
    console.log(`La localizacion ${data.id} ha sido modificada correctamente.`);
  } catch (error: any) {
    console.log("error", error.message);
  }
}
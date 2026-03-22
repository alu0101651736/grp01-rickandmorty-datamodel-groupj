import prompts from "prompts";
import { GestorMultiversal } from "../../gestor.js";
import { Localizacion } from "../../localizaciones.js";

export async function searchNombreLocalizacion(
  gestor: GestorMultiversal,
): Promise<Localizacion[]> {
  const input = await prompts({
    type: "text",
    name: "nombre",
    message: "Nombre de localizaicon",
    validate: (nombre) =>
      nombre.length > 0 ? true : "Debe de tener un nombre",
  });
  let busqueda = await gestor.filterLocalizacionesByNombre(input.nombre);
  return busqueda;
}

export async function searchTipoLocalizacion(
  gestor: GestorMultiversal,
): Promise<Localizacion[]> {
  const input = await prompts({
    type: "select",
    name: "tipo",
    message: "Tipo de localizacion:",
    choices: [
      { title: "Planeta", value: "Planeta" },
      { title: "Estacion espacial", value: "Estacion espacial" },
      { title: "Dimension de bolsillo", value: "Dimension de bolsillo" },
      { title: "Simulacion virtual", value: "Simulacion virtual" },
    ],
  });
  let busqueda = await gestor.filterLocalizacionesByTipo(input.tipo);
  return busqueda;
}

export async function searchDimensionLocalizacion(
  gestor: GestorMultiversal,
): Promise<Localizacion[]> {
  const input = await prompts({
    type: "text",
    name: "nombre",
    message: "Dimension origen de localizaicon",
    validate: (nombre) =>
      nombre.length > 0 ? true : "Debe de tener una dimension",
  });
  let busqueda = await gestor.filterLocalizacionesByDimension(input.nombre);
  return busqueda;
}

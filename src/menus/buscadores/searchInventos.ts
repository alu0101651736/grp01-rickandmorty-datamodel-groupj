import prompts from "prompts";
import { GestorMultiversal } from "../../gestor.js";
import { Invento } from "../../inventos.js";

export async function searchNombreInvento(
  gestor: GestorMultiversal,
): Promise<Invento[]> {
  const input = await prompts({
    type: "text",
    name: "nombre",
    message: "Nombre del invento",
    validate: (nombre) =>
      nombre.length > 0 ? true : "Debe de tener un nombre",
  });
  let busqueda = await gestor.filterInventosByNombre(input.nombre);
  return busqueda;
}

export async function searchInventorInvento(
  gestor: GestorMultiversal,
): Promise<Invento[]> {
  const input = await prompts({
    type: "text",
    name: "nombre",
    message: "Nombre del inventor",
    validate: (nombre) =>
      nombre.length > 0 ? true : "Debe de tener un nombre",
  });
  let busqueda = await gestor.filterInventosByInventor(input.nombre);
  return busqueda;
}

export async function searchTipoInvento(
  gestor: GestorMultiversal,
): Promise<Invento[]> {
  const input = await prompts({
    type: "select",
    name: "tipo",
    message: "Tipo de invento:",
    choices: [
      { title: "Arma", value: "Arma" },
      { title: "Dispositivo de viaje", value: "Dispositivo de viaje" },
      { title: "Biotecnologia", value: "Biotecnologia" },
      { title: "Objeto cotidiano absurdo", value: "Objeto cotidiano absurdo" },
    ],
  });
  let busqueda = await gestor.filterInventosByTipo(input.tipo);
  return busqueda;
}

export async function searchNivelInvento(
  gestor: GestorMultiversal,
): Promise<Invento[]> {
  const input = await prompts(
    {
      type: "text",
      name: "nivel",
      message: "Nivel de peligro",
      validate: (nivel) =>
        nivel > 0 && nivel < 11 ? true : "Debe estar entre 1 y 10",
    });
  let busqueda = await gestor.filterInventosByPeligrosidad(input.nivel);
  return busqueda;
}

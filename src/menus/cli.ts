import prompts from "prompts";
import { GestorMultiversal } from "../gestor.js";
import { db } from "../Database/db.js";
import { mostrarMenuDimension } from "./menuDimension.js";
import { mostrarMenuPersonaje } from "./menuPersonaje.js";
import { mostrarMenuEspecie } from "./menuEspecie.js";
import { mostrarMenuLocalizacion } from "./menuLocalizacion.js";
import { mostrarMenuInvento } from "./menuInventos.js";
import { mostrarMenuConsultas } from "./menuConsultas.js";
import { mostrarMenuEstadoGlobal } from "./menuEstadoGlobal.js";

type OpcionMenuPrincipal =
  | "dimensiones"
  | "personajes"
  | "especies"
  | "localizaciones"
  | "inventos"
  | "estadoGlobal"
  | "consultas"
  | "salir";

export async function mostrarMenuPrincipal(): Promise<OpcionMenuPrincipal> {
  const respuesta = await prompts({
    type: "select",
    name: "opcion",
    message: "Gestor Multiversal - Menu principal",
    choices: [
      { title: "Dimensiones", value: "dimensiones" },
      { title: "Personajes", value: "personajes" },
      { title: "Especies", value: "especies" },
      { title: "Localizaciones", value: "localizaciones" },
      { title: "Inventos", value: "inventos" },
      { title: "Estado global del multiverso", value: "estadoGlobal" },
      { title: "Consultas e informes", value: "consultas" },
      { title: "Salir", value: "salir" },
    ],
  });

  return respuesta.opcion as OpcionMenuPrincipal;
}

export async function main(): Promise<void> {
  await db.read();
  const gestor = new GestorMultiversal(db);
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenuPrincipal();

    switch (opcion) {
      case "dimensiones":
        await mostrarMenuDimension(gestor);
        break;
      case "personajes":
        await mostrarMenuPersonaje(gestor);
        break;
      case "especies":
        await mostrarMenuEspecie(gestor);
        break;
      case "localizaciones":
        await mostrarMenuLocalizacion(gestor);
        break;
      case "inventos":
        await mostrarMenuInvento(gestor);
        break;
      case "estadoGlobal":
        await mostrarMenuEstadoGlobal(gestor);
        break;
      case "consultas":
        await mostrarMenuConsultas(gestor);
        break;
      case "salir":
        salir = true;
        console.log("Saliendo del Gestor Multiversal...");
        break;
      default:
        console.log("Opcion no valida.");
    }
  }
}
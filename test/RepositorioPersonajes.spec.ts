import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { RepositorioPersonajes } from "../src/RepositorioPersonajes";
import { Personaje } from "../src/personajes";
import { Low } from "lowdb";
import { Data, DefaultData } from "../src/Database/db";
import { JSONFilePreset } from "lowdb/node";
import fs from "fs";
import path from "path";

let repo: RepositorioPersonajes;
let db: Low<Data>;
let testDbPath: string;

beforeEach(async () => {
  testDbPath = path.join(__dirname, `testDb_personajes_${Date.now()}.json`);
  db = await JSONFilePreset(testDbPath, DefaultData);
  db.data.personaje = [];
  await db.write();
  repo = new RepositorioPersonajes(db);
});

afterEach(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe("RepositorioPersonajes", () => {

  test("add correcto", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);
    const all = await repo.getAll();
    expect(all.length).toBe(1);
    await repo.remove("1");
  });

  test("add duplicado", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    const p2 = new Personaje("2", "rick", "E1", "D1", "vivo", "Independiente", 10, "desc");

    await repo.add(p1);
    await expect(repo.add(p2)).rejects.toThrow("Personaje duplicado");
    await repo.remove("1");
  });

  test("update correcto", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await repo.update("1", {
      nombre: "Morty",
      especie: "E2",
      dimension: "D2",
      estado: "muerto",
      afiliacion: "Familia Smith",
      nivelInteligencia: 5,
      descripcion: "nuevo"
    });

    const updated = await repo.findById("1");

    expect(updated?.nombre).toBe("Morty");
    expect(updated?.especie).toBe("E2");
    expect(updated?.dimension).toBe("D2");
    expect(updated?.estado).toBe("muerto");
    expect(updated?.afiliacion).toBe("Familia Smith");
    expect(updated?.nivelInteligencia).toBe(5);
    expect(updated?.descripcion).toBe("nuevo");
    await repo.remove("1");
  });

  test("update no existe", async () => {
    await expect(repo.update("X", {})).rejects.toThrow("El personaje no existe");
  });

  test("update nombre vacío", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await expect(repo.update("1", { nombre: "" })).rejects.toThrow("El nombre no puede estar vacío");
    await repo.remove("1");
  });

  test("update especie null", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await expect(repo.update("1", { especie: null })).rejects.toThrow("La especie no puede ser null");
    await repo.remove("1");
  });

  test("update dimension null", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await expect(repo.update("1", { dimension: null })).rejects.toThrow("La dimensión no puede ser null");
    await repo.remove("1");
  });

  test("update nivel inteligencia inválido (<1)", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await expect(repo.update("1", { nivelInteligencia: 0 })).rejects.toThrow("El nivel de inteligencia debe estar entre 1 y 10");
    await repo.remove("1");
  });

  test("update nivel inteligencia inválido (>10)", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await expect(repo.update("1", { nivelInteligencia: 11 })).rejects.toThrow("El nivel de inteligencia debe estar entre 1 y 10");
    await repo.remove("1");
  });

  test("update descripción vacía", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await expect(repo.update("1", { descripcion: "" })).rejects.toThrow("La descripción no puede estar vacía");
    await repo.remove("1");
  });

  test("update duplicado", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    const p2 = new Personaje("2", "Morty", "E2", "D2", "vivo", "Independiente", 5, "desc");

    await repo.add(p1);
    await repo.add(p2);

    await expect(repo.update("2", {
      nombre: "Rick",
      especie: "E1",
      dimension: "D1"
    })).rejects.toThrow("Personaje duplicado");
    await repo.remove("1");
    await repo.remove("2");
  });

  test("update sin cambios", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "desc");
    await repo.add(p);

    await repo.update("1", {});

    const result = await repo.findById("1");
    expect(result).toEqual(p);
    await repo.remove("1");
  });

  test("filterByNombre", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    const p2 = new Personaje("2", "Morty", "E2", "D2", "vivo", "Independiente", 5, "d");
    await repo.add(p1);
    await repo.add(p2);

    const result = await repo.filterByNombre("Rick");
    expect(result.length).toBe(1);
    await repo.remove("1");
    await repo.remove("2");
  });

  test("filterByEspecie", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    const p2 = new Personaje("2", "Morty", "E2", "D2", "vivo", "Independiente", 5, "d");
    await repo.add(p1);
    await repo.add(p2);

    const result = await repo.filterByEspecie("E1");
    expect(result.length).toBe(1);
    await repo.remove("1");
    await repo.remove("2");
  });

  test("filterByAfiliacion", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    const p2 = new Personaje("2", "Morty", "E2", "D2", "vivo", "Familia Smith", 5, "d");
    await repo.add(p1);
    await repo.add(p2);

    const result = await repo.filterByAfiliacion("Familia Smith");
    expect(result.length).toBe(1);
    await repo.remove("1");
    await repo.remove("2");
  });

  test("filterByEstado", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    const p2 = new Personaje("2", "Morty", "E2", "D2", "muerto", "Independiente", 5, "d");
    await repo.add(p1);
    await repo.add(p2);

    const result = await repo.filterByEstado("muerto");
    expect(result.length).toBe(1);
    await repo.remove("1");
    await repo.remove("2");
  });

  test("filterByDimension", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    const p2 = new Personaje("2", "Morty", "E2", "D2", "vivo", "Independiente", 5, "d");
    await repo.add(p1);
    await repo.add(p2);

    const result = await repo.filterByDimension("D1");
    expect(result.length).toBe(1);
    await repo.remove("1");
    await repo.remove("2");
  });

  test("setNullDimension", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    await repo.add(p);

    await repo.setNullDimension("D1");

    const updated = await repo.findById("1");
    expect(updated?.dimension).toBe(null);
    await repo.remove("1");
  });

  test("setNullEspecie", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    await repo.add(p);

    await repo.setNullEspecie("E1");

    const updated = await repo.findById("1");
    expect(updated?.especie).toBe(null);
    await repo.remove("1");
  });

  test("getNullDimension", async () => {
    const p = new Personaje("1", "Rick", "E1", null, "vivo", "Independiente", 10, "d");
    await repo.add(p);

    const result = await repo.getNullDimension();
    expect(result.length).toBe(1);
    await repo.remove("1");
  });

  test("isDuplicate true", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    const p2 = new Personaje("2", "rick", "E1", "D1", "vivo", "Independiente", 10, "d");

    await repo.add(p1);

    const result = await repo.isDuplicate(p2);
    expect(result).toBe(true);
    await repo.remove("1");
  });

  test("isDuplicate false", async () => {
    const p1 = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    const p2 = new Personaje("2", "Morty", "E2", "D2", "vivo", "Independiente", 5, "d");

    await repo.add(p1);

    const result = await repo.isDuplicate(p2);
    expect(result).toBe(false);
    await repo.remove("1");
  });

  test("setNullDimension no modifica si no coincide", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    await repo.add(p);

    await repo.setNullDimension("D2");

    const updated = await repo.findById("1");
    expect(updated?.dimension).toBe("D1");
    await repo.remove("1");
  });

  test("setNullEspecie no modifica si no coincide", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    await repo.add(p);

    await repo.setNullEspecie("E2");

    const updated = await repo.findById("1");
    expect(updated?.especie).toBe("E1");
    await repo.remove("1");
  });

  test("getNullDimension vacío", async () => {
    const p = new Personaje("1", "Rick", "E1", "D1", "vivo", "Independiente", 10, "d");
    await repo.add(p);

    const result = await repo.getNullDimension();
    expect(result.length).toBe(0);
    await repo.remove("1");
  });

  test("remove lanza error si el elemento no existe", async () => {
    await expect(repo.remove("X")).rejects.toThrow("El elemento no existe");
  });

});
import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { RepositorioEspecies } from "../src/RepositorioEspecies";
import { Especie } from "../src/especies";
import { Low } from "lowdb";
import { Data, DefaultData } from "../src/Database/db";
import { JSONFilePreset } from "lowdb/node";
import fs from "fs";
import path from "path";

let repo: RepositorioEspecies;
let db: Low<Data>;
let testDbPath: string;

beforeEach(async () => {
  testDbPath = path.join(__dirname, `testDb_especies_${Date.now()}.json`);
  db = await JSONFilePreset(testDbPath, DefaultData);
  db.data.especie = [];
  await db.write();
  repo = new RepositorioEspecies(db);
});

afterEach(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe("RepositorioEspecies", () => {

  test("add correcto", async () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    await repo.add(e);
    const all = await repo.getAll();
    expect(all.length).toBe(1);
    await repo.remove("1");
  });

  test("add duplicada", async () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "humano", "D1", "humanoide", 80, "desc");

    await repo.add(e1);
    await expect(repo.add(e2)).rejects.toThrow("Especie duplicada");
    await repo.remove("1");
  });

  test("update correcto", async () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    await repo.add(e);

    await repo.update("1", {
      nombre: "Alien",
      origen: "D2",
      tipo: "amorfo",
      esperanzaVida: 100,
      descripcion: "nueva"
    });

    const updated = await repo.findById("1");

    expect(updated?.nombre).toBe("Alien");
    expect(updated?.origen).toBe("D2");
    expect(updated?.tipo).toBe("amorfo");
    expect(updated?.esperanzaVida).toBe(100);
    expect(updated?.descripcion).toBe("nueva");
    await repo.remove("1");
  });

  test("update no existe", async () => {
    await expect(repo.update("X", {})).rejects.toThrow("La especie no existe");
  });

  test("update nombre vacío", async () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    await repo.add(e);

    await expect(repo.update("1", { nombre: "" })).rejects.toThrow("El nombre no puede estar vacío");
    await repo.remove("1");
  });

  test("update origen null", async () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    await repo.add(e);

    await expect(repo.update("1", { origen: null })).rejects.toThrow("La especie debe tener un origen");
    await repo.remove("1");
  });

  test("update esperanza de vida inválida", async () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    await repo.add(e);

    await expect(repo.update("1", { esperanzaVida: 0 })).rejects.toThrow("Esperanza de vida inválida");
    await repo.remove("1");
  });

  test("update descripción vacía", async () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    await repo.add(e);

    await expect(repo.update("1", { descripcion: "" })).rejects.toThrow("La descripción no puede estar vacía");
    await repo.remove("1");
  });

  test("update duplicado", async () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "Alien", "D2", "humanoide", 80, "desc");

    await repo.add(e1);
    await repo.add(e2);

    await expect(repo.update("2", {
      nombre: "Humano",
      origen: "D1"
    })).rejects.toThrow("Especie duplicada");
    await repo.remove("1");
    await repo.remove("2");
  });

  test("update sin cambios", async () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    await repo.add(e);

    await repo.update("1", {});

    const result = await repo.findById("1");
    expect(result).toEqual(e);
    await repo.remove("1");
  });

  test("setNullOrigen funciona", async () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "Alien", "D2", "amorfo", 80, "desc");

    await repo.add(e1);
    await repo.add(e2);

    await repo.setNullOrigen("D1");

    const updated1 = await repo.findById("1");
    const updated2 = await repo.findById("2");

    expect(updated1?.origen).toBe(null);
    expect(updated2?.origen).toBe("D2");
    await repo.remove("1");
    await repo.remove("2");
  });

  test("isDuplicate true", async () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "humano", "D1", "humanoide", 80, "desc");

    await repo.add(e1);

    const result = await repo.isDuplicate(e2);
    expect(result).toBe(true);
    await repo.remove("1");
  });

  test("isDuplicate false", async () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "Alien", "D2", "amorfo", 80, "desc");

    await repo.add(e1);

    const result = await repo.isDuplicate(e2);
    expect(result).toBe(false);
    await repo.remove("1");
  });

  test("remove lanza error si el elemento no existe", async () => {
    await expect(repo.remove("X")).rejects.toThrow("El elemento no existe");
  });

});
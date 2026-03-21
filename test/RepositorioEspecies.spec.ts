import { describe, expect, test, beforeEach } from "vitest";
import { RepositorioEspecies } from "../src/RepositorioEspecies";
import { Especie } from "../src/especies";

let repo: RepositorioEspecies;

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

beforeEach(() => {
  repo = new RepositorioEspecies(normalize);
});

describe("RepositorioEspecies", () => {

  test("add correcto", () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    repo.add(e);

    expect(repo.getAll().length).toBe(1);
  });

  test("add duplicada", () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "humano", "D1", "humanoide", 80, "desc");

    repo.add(e1);

    expect(() => repo.add(e2)).toThrow("Especie duplicada");
  });

  test("update correcto", () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    repo.add(e);

    repo.update("1", {
      nombre: "Alien",
      origen: "D2",
      tipo: "amorfo",
      esperanzaVida: 100,
      descripcion: "nueva"
    });

    const updated = repo.findById("1");

    expect(updated?.nombre).toBe("Alien");
    expect(updated?.origen).toBe("D2");
    expect(updated?.tipo).toBe("amorfo");
    expect(updated?.esperanzaVida).toBe(100);
    expect(updated?.descripcion).toBe("nueva");
  });

  test("update no existe", () => {
    expect(() => repo.update("X", {}))
      .toThrow("La especie no existe");
  });

  test("update nombre vacío", () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    repo.add(e);

    expect(() => repo.update("1", { nombre: "" }))
      .toThrow("El nombre no puede estar vacío");
  });

  test("update origen null", () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    repo.add(e);

    expect(() => repo.update("1", { origen: null }))
      .toThrow("La especie debe tener un origen");
  });

  test("update esperanza de vida inválida", () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    repo.add(e);

    expect(() => repo.update("1", { esperanzaVida: 0 }))
      .toThrow("Esperanza de vida inválida");
  });

  test("update descripción vacía", () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    repo.add(e);

    expect(() => repo.update("1", { descripcion: "" }))
      .toThrow("La descripción no puede estar vacía");
  });

  test("update duplicado", () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "Alien", "D2", "humanoide", 80, "desc");

    repo.add(e1);
    repo.add(e2);

    expect(() => repo.update("2", {
      nombre: "Humano",
      origen: "D1"
    })).toThrow("Especie duplicada");
  });

  test("update sin cambios", () => {
    const e = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    repo.add(e);

    repo.update("1", {});

    expect(repo.findById("1")).toEqual(e);
  });

  test("setNullOrigen funciona", () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "Alien", "D2", "amorfo", 80, "desc");

    repo.add(e1);
    repo.add(e2);

    repo.setNullOrigen("D1");

    expect(repo.findById("1")?.origen).toBe(null);
    expect(repo.findById("2")?.origen).toBe("D2");
  });

  test("isDuplicate true", () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "humano", "D1", "humanoide", 80, "desc");

    repo.add(e1);

    expect(repo.isDuplicate(e2)).toBe(true);
  });

  test("isDuplicate false", () => {
    const e1 = new Especie("1", "Humano", "D1", "humanoide", 80, "desc");
    const e2 = new Especie("2", "Alien", "D2", "amorfo", 80, "desc");

    repo.add(e1);

    expect(repo.isDuplicate(e2)).toBe(false);
  });

});
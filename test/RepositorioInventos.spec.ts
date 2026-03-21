import { describe, expect, test, beforeEach } from "vitest";
import { RepositorioInventos } from "../src/RepositorioInventos";
import { Invento } from "../src/inventos";

let repo: RepositorioInventos;

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

beforeEach(() => {
  repo = new RepositorioInventos(normalize);
});

describe("RepositorioInventos", () => {

  test("add correcto", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    expect(repo.getAll().length).toBe(1);
  });

  test("add duplicado", () => {
    const i1 = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    const i2 = new Invento("2", "pistola", "P1", "Arma", 5, "desc");

    repo.add(i1);

    expect(() => repo.add(i2)).toThrow("Invento duplicado");
  });

  test("update correcto", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    repo.update("1", {
      nombre: "Laser",
      inventor: "P2",
      tipo: "Biotecnologia",
      nivelPeligro: 8,
      descripcion: "nuevo"
    });

    const updated = repo.findById("1");

    expect(updated?.nombre).toBe("Laser");
    expect(updated?.inventor).toBe("P2");
    expect(updated?.tipo).toBe("Biotecnologia");
    expect(updated?.nivelPeligro).toBe(8);
    expect(updated?.descripcion).toBe("nuevo");
  });

  test("update no existe", () => {
    expect(() => repo.update("X", {}))
      .toThrow("El invento no existe");
  });

  test("update nombre vacío", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    expect(() => repo.update("1", { nombre: "" }))
      .toThrow("El nombre no puede estar vacío");
  });

  test("update inventor null", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    expect(() => repo.update("1", { inventor: null }))
      .toThrow("El invento debe tener un inventor");
  });

  test("update nivelPeligro inválido (<1)", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    expect(() => repo.update("1", { nivelPeligro: 0 }))
      .toThrow("El nivel de peligro debe estar entre 1 y 10");
  });

  test("update nivelPeligro inválido (>10)", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    expect(() => repo.update("1", { nivelPeligro: 11 }))
      .toThrow("El nivel de peligro debe estar entre 1 y 10");
  });

  test("update descripción vacía", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    expect(() => repo.update("1", { descripcion: "" }))
      .toThrow("La descripción no puede estar vacía");
  });

  test("update duplicado", () => {
    const i1 = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    const i2 = new Invento("2", "Laser", "P2", "Arma", 5, "desc");

    repo.add(i1);
    repo.add(i2);

    expect(() => repo.update("2", {
      nombre: "Pistola",
      inventor: "P1"
    })).toThrow("Invento duplicado");
  });

  test("update sin cambios", () => {
    const i = new Invento("1", "Pistola", "P1", "Arma", 5, "desc");
    repo.add(i);

    repo.update("1", {});

    expect(repo.findById("1")).toEqual(i);
  });

  // -------- FILTERS --------

  test("filterByNombre", () => {
    repo.add(new Invento("1", "A", "P1", "Arma", 5, "d"));
    repo.add(new Invento("2", "B", "P2", "Arma", 5, "d"));

    const result = repo.filterByNombre("A");

    expect(result.length).toBe(1);
  });

  test("filterByTipo", () => {
    repo.add(new Invento("1", "A", "P1", "Arma", 5, "d"));
    repo.add(new Invento("2", "B", "P2", "Biotecnologia", 5, "d"));

    const result = repo.filterByTipo("Arma");

    expect(result.length).toBe(1);
  });

  test("filterByInventor", () => {
    repo.add(new Invento("1", "A", "P1", "Arma", 5, "d"));
    repo.add(new Invento("2", "B", "P2", "Arma", 5, "d"));

    const result = repo.filterByInventor("P1");

    expect(result.length).toBe(1);
  });

  test("filterByPeligrosidad", () => {
    repo.add(new Invento("1", "A", "P1", "Arma", 5, "d"));
    repo.add(new Invento("2", "B", "P2", "Arma", 9, "d"));

    const result = repo.filterByPeligrosidad(9);

    expect(result.length).toBe(1);
  });

  test("setNullInventor", () => {
    const i1 = new Invento("1", "A", "P1", "Arma", 5, "d");
    const i2 = new Invento("2", "B", "P2", "Arma", 5, "d");

    repo.add(i1);
    repo.add(i2);

    repo.setNullInventor("P1");

    expect(repo.findById("1")?.inventor).toBe(null);
    expect(repo.findById("2")?.inventor).toBe("P2");
  });

  test("isDuplicate true", () => {
    const i1 = new Invento("1", "Pistola", "P1", "Arma", 5, "d");
    const i2 = new Invento("2", "pistola", "P1", "Arma", 5, "d");

    repo.add(i1);

    expect(repo.isDuplicate(i2)).toBe(true);
  });

  test("isDuplicate false", () => {
    const i1 = new Invento("1", "Pistola", "P1", "Arma", 5, "d");
    const i2 = new Invento("2", "Laser", "P2", "Arma", 5, "d");

    repo.add(i1);

    expect(repo.isDuplicate(i2)).toBe(false);
  });

});
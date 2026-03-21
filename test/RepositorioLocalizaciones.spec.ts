import { describe, expect, test, beforeEach } from "vitest";
import { RepositorioLocalizaciones } from "../src/RepositorioLocalizaciones";
import { Localizacion } from "../src/localizaciones";

let repo: RepositorioLocalizaciones;

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

beforeEach(() => {
  repo = new RepositorioLocalizaciones(normalize);
});

describe("RepositorioLocalizaciones", () => {

  test("add correcto", () => {
    const l = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    repo.add(l);

    expect(repo.getAll().length).toBe(1);
  });

  test("add duplicado", () => {
    const l1 = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    const l2 = new Localizacion("2", "tierra", "Planeta", 2000, "D1", "desc");

    repo.add(l1);

    expect(() => repo.add(l2)).toThrow("Localizacion duplicada");
  });

  test("update correcto", () => {
    const l = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    repo.add(l);

    repo.update("1", {
      nombre: "Marte",
      tipo: "Planeta",
      poblacionAproximada: 500,
      dimension: "D2",
      descripcion: "nuevo"
    });

    const updated = repo.findById("1");

    expect(updated?.nombre).toBe("Marte");
    expect(updated?.dimension).toBe("D2");
    expect(updated?.poblacionAproximada).toBe(500);
    expect(updated?.descripcion).toBe("nuevo");
  });

  test("update no existe", () => {
    expect(() => repo.update("X", {}))
      .toThrow("La localización no existe");
  });

  test("update nombre vacío", () => {
    const l = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    repo.add(l);

    expect(() => repo.update("1", { nombre: "" }))
      .toThrow("El nombre no puede estar vacío");
  });

  test("update dimension null", () => {
    const l = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    repo.add(l);

    expect(() => repo.update("1", { dimension: null }))
      .toThrow("La localización debe tener una dimensión");
  });

  test("update poblacion negativa", () => {
    const l = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    repo.add(l);

    expect(() => repo.update("1", { poblacionAproximada: -1 }))
      .toThrow("La población no puede ser negativa");
  });

  test("update descripción vacía", () => {
    const l = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    repo.add(l);

    expect(() => repo.update("1", { descripcion: "" }))
      .toThrow("La descripción no puede estar vacía");
  });

  test("update duplicado", () => {
    const l1 = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    const l2 = new Localizacion("2", "Marte", "Planeta", 500, "D2", "desc");

    repo.add(l1);
    repo.add(l2);

    expect(() => repo.update("2", {
      nombre: "Tierra",
      dimension: "D1"
    })).toThrow("Localización duplicada");
  });

  test("update sin cambios", () => {
    const l = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    repo.add(l);

    repo.update("1", {});

    expect(repo.findById("1")).toEqual(l);
  });

  // -------- FILTERS --------

  test("filterByNombre", () => {
    repo.add(new Localizacion("1", "A", "Planeta", 1, "D1", "d"));
    repo.add(new Localizacion("2", "B", "Planeta", 1, "D1", "d"));

    const result = repo.filterByNombre("A");

    expect(result.length).toBe(1);
  });

  test("filterByTipo", () => {
    repo.add(new Localizacion("1", "A", "Planeta", 1, "D1", "d"));
    repo.add(new Localizacion("2", "B", "Estacion espacial", 1, "D1", "d"));

    const result = repo.filterByTipo("Planeta");

    expect(result.length).toBe(1);
  });

  test("filterByDimension", () => {
    repo.add(new Localizacion("1", "A", "Planeta", 1, "D1", "d"));
    repo.add(new Localizacion("2", "B", "Planeta", 1, "D2", "d"));

    const result = repo.filterByDimension("D1");

    expect(result.length).toBe(1);
  });

  test("isDuplicate true", () => {
    const l1 = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    const l2 = new Localizacion("2", "tierra", "Planeta", 2000, "D1", "desc");

    repo.add(l1);

    expect(repo.isDuplicate(l2)).toBe(true);
  });

  test("isDuplicate false", () => {
    const l1 = new Localizacion("1", "Tierra", "Planeta", 1000, "D1", "desc");
    const l2 = new Localizacion("2", "Marte", "Planeta", 2000, "D2", "desc");

    repo.add(l1);

    expect(repo.isDuplicate(l2)).toBe(false);
  });

});
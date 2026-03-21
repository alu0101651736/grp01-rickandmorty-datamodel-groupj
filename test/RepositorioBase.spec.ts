import { describe, expect, test, beforeEach } from "vitest";
import { RepositorioBase } from "../src/RepositorioBase";

// Clase dummy para poder instanciar
class RepoTest extends RepositorioBase<{ id: string; valor: number }> {}

let repo: RepoTest;

beforeEach(() => {
  repo = new RepoTest();
});

describe("RepositorioBase", () => {

  test("add inserta correctamente", () => {
    repo.add({ id: "1", valor: 10 });
    expect(repo.getAll().length).toBe(1);
  });

  test("add lanza error si el id está duplicado", () => {
    repo.add({ id: "1", valor: 10 });

    expect(() => {
      repo.add({ id: "1", valor: 20 });
    }).toThrow("ID duplicado");
  });

  test("remove elimina correctamente", () => {
    repo.add({ id: "1", valor: 10 });
    repo.remove("1");

    expect(repo.getAll().length).toBe(0);
  });

  test("remove lanza error si no existe", () => {
    expect(() => {
      repo.remove("no-existe");
    }).toThrow("El elemento no existe");
  });

  test("findById devuelve el elemento correcto", () => {
    repo.add({ id: "1", valor: 10 });

    const result = repo.findById("1");

    expect(result).toEqual({ id: "1", valor: 10 });
  });

  test("findById devuelve undefined si no existe", () => {
    const result = repo.findById("no-existe");

    expect(result).toBeUndefined();
  });

  test("getAll devuelve todos los elementos", () => {
    repo.add({ id: "1", valor: 10 });
    repo.add({ id: "2", valor: 20 });

    const all = repo.getAll();

    expect(all.length).toBe(2);
  });

});
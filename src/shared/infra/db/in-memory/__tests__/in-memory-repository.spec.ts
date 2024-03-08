import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../in-memory-repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price?: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test("should insert a new entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 100,
    });

    await repo.insert(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0]).toBe(entity);
  });

  test("should bulk insert entities", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 100,
    });

    const entity2 = new StubEntity({
      entity_id: new Uuid(),
      name: "Test2",
      price: 200,
    });

    const entityArr: StubEntity[] = [entity, entity2];

    await repo.bulkInsert(entityArr);
    expect(repo.items.length).toBe(2);
    expect(repo.items[0]).toBe(entity);
    expect(repo.items[1]).toBe(entity2);
  });

  it("should returns all entities", async () => {
    const entity = new StubEntity({ name: "Test", price: 5 });
    await repo.insert(entity);

    const entities = await repo.findAll();
    expect(entities.length).toBe(1);
    expect(entities).toStrictEqual([entity]);
  });

  it("should throws error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "Thales", price: 5 });
    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id.id, StubEntity)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "Test", price: 5 });
    await repo.insert(entity);

    entity.name = "NovoNome";
    entity.price = 10;

    await repo.update(entity);
    const updatedEntity = await repo.findById(entity.entity_id);
    expect(updatedEntity).toBe(entity);
  });

  it("should throw error on delete when entity not found", async () => {
    const entity = new StubEntity({ name: "Test", price: 5 });
    await expect(repo.delete(entity.entity_id)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ name: "Test", price: 5 });
    await repo.insert(entity);

    await repo.delete(entity.entity_id);
    expect(repo.items).toStrictEqual([]);
    expect(repo.items.length).toBe(0);
  });
});

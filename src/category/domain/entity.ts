import { ValueObject } from "../../shared/domain/value-objects";

export abstract class Entity {
  abstract get entity_id(): ValueObject;
  abstract toJSON(): any;
}

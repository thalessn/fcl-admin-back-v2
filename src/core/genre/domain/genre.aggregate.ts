import { Uuid } from '../../../core/shared/domain/value-objects/uuid.vo';
import { AggregateRoot } from '../../../core/shared/domain/aggregate-root';
import { CategoryId } from 'src/core/category/domain/category.aggregate';
import GenreValidatorFactory from './genre.validator';
import { GenreFakeBuilder } from './genrer-fake.builder';

export class GenreId extends Uuid {}

export type GenreConstructorProps = {
  genre_id?: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};

export type GenreCreateCommand = {
  name: string;
  categories_id: CategoryId[];
  is_active?: boolean;
};

export class Genre extends AggregateRoot {
  genre_id: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active: boolean;
  created_at: Date;

  constructor(props: GenreConstructorProps) {
    super();
    this.genre_id = props.genre_id ?? new GenreId();
    this.name = props.name;
    this.categories_id = props.categories_id;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: GenreCreateCommand): Genre {
    const genre = new Genre({
      ...props,
      categories_id: new Map(
        props.categories_id.map((category_id) => [category_id.id, category_id]),
      ),
    });
    genre.validate();
    return genre;
  }

  addCategoryId(category_id: CategoryId) {
    this.categories_id.set(category_id.id, category_id);
  }

  removeCategoryID(category_id: CategoryId) {
    this.categories_id.delete(category_id.id);
  }

  syncCategoriesId(categories_id: CategoryId[]) {
    if (!this.categories_id) {
      return;
    }

    this.categories_id = new Map(
      categories_id.map((category_id) => [category_id.id, category_id]),
    );
  }

  changeName(name: string) {
    this.name = name;
    this.validate(['name']);
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  validate(fields?: string[]) {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return GenreFakeBuilder;
  }

  get entity_id() {
    return this.genre_id;
  }

  toJSON() {
    return {
      genre_id: this.genre_id,
      name: this.name,
      categories_id: Array.from(this.categories_id.values()).map(
        (category_id) => category_id.id,
      ),
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}

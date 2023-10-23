import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  describe("constructor", () => {
    test("should create a category with default values", () => {
      const category = new Category({ name: "Test 1" });
      expect(category.category_id).toBeNull();
      expect(category.name).toBe("Test 1");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with all values", () => {
      const created_at = new Date();
      const category = new Category({
        name: "Test 1",
        description: "Test Description",
        is_active: false,
        created_at,
      });
      expect(category.category_id).toBeNull();
      expect(category.name).toBe("Test 1");
      expect(category.description).toBe("Test Description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });

    test("should create a category with name and description", () => {
      const category = new Category({
        name: "Test 1",
        description: "Test Description",
      });
      expect(category.category_id).toBeNull();
      expect(category.name).toBe("Test 1");
      expect(category.description).toBe("Test Description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    test("should create a category", () => {
      const category = Category.create({ name: "Test" });
      expect(category.category_id).toBeNull();
      expect(category.name).toBe("Test");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a categorywith description", () => {
      const category = Category.create({
        name: "Test",
        description: "Test Description",
      });
      expect(category.category_id).toBeNull();
      expect(category.name).toBe("Test");
      expect(category.description).toBe("Test Description");
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with is_active", () => {
      const category = Category.create({ name: "Test", is_active: true });
      expect(category.category_id).toBeNull();
      expect(category.name).toBe("Test");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  test("should change name", () => {
    const category = Category.create({ name: "Test" });
    category.changeName("Test 2");
    expect(category.name).toBe("Test 2");
  });

  test("should change description", () => {
    const category = Category.create({ name: "Test" });
    category.changeDescription("New Description");
    expect(category.description).toBe("New Description");
  });

  test("should active a category", () => {
    const category = Category.create({ name: "Test", is_active: false });
    category.activate();
    expect(category.is_active).toBe(true);
  });

  test("should deactive a category", () => {
    const category = Category.create({ name: "Test", is_active: true });
    category.deactivate();
    expect(category.is_active).toBe(false);
  });
});

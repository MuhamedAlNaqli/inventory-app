import * as SQLite from "expo-sqlite";

export type Inventory = {
  id: number;
  name: string;
  location: string | null;
  created_at: number;
};

export type Item = {
  id: number;
  inventory_id: number;
  name: string;
  sku: string;
  quantity: number;
  created_at: number;
};

const DB_NAME = "inventory.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS inventories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          location TEXT,
          created_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inventory_id INTEGER NOT NULL REFERENCES inventories(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          sku TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_items_inventory_id ON items(inventory_id);
      `);
      return db;
    });
  }
  return dbPromise;
}

export async function listInventories(): Promise<Inventory[]> {
  const db = await getDb();
  return db.getAllAsync<Inventory>(
    "SELECT * FROM inventories ORDER BY created_at DESC",
  );
}

export async function getInventory(id: number): Promise<Inventory | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Inventory>(
    "SELECT * FROM inventories WHERE id = ?",
    id,
  );
  return row ?? null;
}

export async function createInventory(
  name: string,
  location: string | null,
): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO inventories (name, location, created_at) VALUES (?, ?, ?)",
    name,
    location,
    Date.now(),
  );
  return result.lastInsertRowId;
}

export async function updateInventory(
  id: number,
  name: string,
  location: string | null,
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "UPDATE inventories SET name = ?, location = ? WHERE id = ?",
    name,
    location,
    id,
  );
}

export async function deleteInventory(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM inventories WHERE id = ?", id);
}

export async function listItems(inventoryId: number): Promise<Item[]> {
  const db = await getDb();
  return db.getAllAsync<Item>(
    "SELECT * FROM items WHERE inventory_id = ? ORDER BY created_at DESC",
    inventoryId,
  );
}

export async function getItem(id: number): Promise<Item | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Item>(
    "SELECT * FROM items WHERE id = ?",
    id,
  );
  return row ?? null;
}

export async function createItem(
  inventoryId: number,
  name: string,
  sku: string,
  quantity: number,
): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO items (inventory_id, name, sku, quantity, created_at) VALUES (?, ?, ?, ?, ?)",
    inventoryId,
    name,
    sku,
    quantity,
    Date.now(),
  );
  return result.lastInsertRowId;
}

export async function updateItem(
  id: number,
  name: string,
  sku: string,
  quantity: number,
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "UPDATE items SET name = ?, sku = ?, quantity = ? WHERE id = ?",
    name,
    sku,
    quantity,
    id,
  );
}

export async function deleteItem(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM items WHERE id = ?", id);
}

export async function countItems(inventoryId: number): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    "SELECT COUNT(*) as c FROM items WHERE inventory_id = ?",
    inventoryId,
  );
  return row?.c ?? 0;
}

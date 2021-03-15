import db from "./";

export interface Tag {
  id: number;
  name: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export function createTag(name: string, parentId?: number): Tag {
  const insertResult = db
    .prepare("INSERT INTO tags (name, parent_id) VALUES (?, ?)")
    .run(name, parentId);

  return db
    .prepare("SELECT * FROM tags WHERE id = ?")
    .get(insertResult.lastInsertRowid);
}

export function updateTag(id: number, name: string, parentId?: number): Tag {
  db.prepare("UPDATE tags SET name = ?, parent_id = ? WHERE id = ?").run(
    name,
    parentId,
    id
  );

  return db.prepare("SELECT * FROM tags WHERE id = ?").get(id);
}

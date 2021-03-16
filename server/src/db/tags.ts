import db from "./";
import { buildParams } from "./util";

export interface Tag {
  id: number;
  name: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export function find(id: number): Tag {
  return db.prepare("SELECT * FROM tags WHERE id = ?").get(id);
}

export function findByParent(parentId: number): Tag[] {
  return db.prepare("SELECT * from tags WHERE parent_id = ?").all(parentId);
}

export function createTag(name: string, parentId?: number): Tag {
  const insertResult = db
    .prepare("INSERT INTO tags (name, parent_id) VALUES (?, ?)")
    .run(name, parentId);

  return find(Number(insertResult.lastInsertRowid));
}

export function updateTag(id: number, name: string, parentId?: number): Tag {
  db.prepare("UPDATE tags SET name = ?, parent_id = ? WHERE id = ?").run(
    name,
    parentId,
    id
  );

  return find(id);
}

function deleteUnsafe(id: number): void {
  const tag = find(id);
  if (tag && tag.parent_id) {
    const children = findByParent(tag.parent_id);
    children.forEach((child) => {
      deleteUnsafe(child.id);
    });

    db.prepare("DELETE FROM tags WHERE ID = ?").run(id);
  }
}

export function deleteTag(id: number): Promise<void> {
  return new Promise<void>((resolve) => {
    db.transaction(() => {
      deleteUnsafe(id);
      resolve();
    });
  });
}

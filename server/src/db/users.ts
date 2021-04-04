import crypto from "crypto";
import { User } from "minature-wisdom-lib/models";

import db from "./";

export function findAdmin(): User | undefined {
  return db.prepare("SELECT * FROM users WHERE is_admin = 1").get();
}

export function upsertAdmin(username: string, password: string, id?: number) {
  if (id) {
    db.prepare("UPDATE users SET username = ?, password = ? WHERE id = ?").run(
      username,
      hashPassword(password),
      id
    );
  } else {
    db.prepare(
      "INSERT INTO users (username, password, is_admin) VALUES (?, ?, TRUE)"
    ).run(username, hashPassword(password));
  }

  return findAdmin();
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hashedPassword] = storedHash.split(":");
  return (
    hashedPassword === crypto.scryptSync(password, salt, 64).toString("hex")
  );
}

import crypto from "crypto";
import db from "./db";

export function findAdmin() {
  return db.prepare("SELECT rowid, * FROM users WHERE is_admin = 1").get();
}

export function upsertAdmin(
  username: string,
  password: string,
  rowid?: number
) {
  if (rowid) {
    db.prepare(
      "UPDATE users SET username = ?, password = ? WHERE rowid = ?"
    ).run(username, hashPassword(password), rowid);
  } else {
    db.prepare(
      "INSERT INTO users (username, password, is_admin) VALUES (?, ?, TRUE)"
    ).run(username, hashPassword(password));
  }
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, hashedPassword] = storedHash.split(":");
  return (
    hashedPassword === crypto.scryptSync(password, salt, 64).toString("hex")
  );
}

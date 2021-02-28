import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const db = new Database(path.join(__dirname, "..", "db.sqlite"), {
  verbose: process.env.NODE_ENV === "production" ? console.log : undefined,
});

const dbVersion = db.pragma("user_version", { simple: true });

const migrationFilenames = fs
  .readdirSync(path.join(__dirname, "migrations"))
  .sort()
  .slice(dbVersion);

if (migrationFilenames.length) {
  const migrate = db.transaction(() => {
    migrationFilenames.forEach((filename) => {
      db.exec(
        fs.readFileSync(path.join(__dirname, "migrations", filename), "utf8")
      );
    });

    db.pragma(`user_version = ${dbVersion + migrationFilenames.length}`);
  });

  migrate();
}

export default db;

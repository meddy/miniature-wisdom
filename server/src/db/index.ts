import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const db = new Database(path.resolve("./src/db/db.sqlite"), {
  verbose: process.env.NODE_ENV === "production" ? console.log : undefined,
});

const dbVersion = db.pragma("user_version", { simple: true });

const migrationFilenames = fs
  .readdirSync(path.resolve("./src/db/migrations"))
  .sort()
  .slice(dbVersion);

if (migrationFilenames.length) {
  const migrate = db.transaction(() => {
    migrationFilenames.forEach((filename) => {
      db.exec(
        fs.readFileSync(path.resolve(`./src/db/migrations/${filename}`), "utf8")
      );
    });

    db.pragma(`user_version = ${dbVersion + migrationFilenames.length}`);
  });

  migrate();
}

export default db;

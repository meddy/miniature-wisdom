/* ====== Users ====== */
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

CREATE TRIGGER users_updated
    AFTER UPDATE
    ON users
    WHEN new.updated_at <= old.updated_at
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;

/* ====== Tags ====== */
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    parent_id INTEGER,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    UNIQUE(name, parent_id),
    FOREIGN KEY(parent_id) REFERENCES tags(id)
);

CREATE INDEX tags_parent_index ON tags(parent_id);

CREATE TRIGGER tags_updated
    AFTER UPDATE
    ON tags
    WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE tags SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE VIRTUAL TABLE tags_search USING fts5(
    name,
    content='tags',
    content_rowid='id'
);

CREATE TRIGGER tags_search_inserted AFTER INSERT ON tags BEGIN
    INSERT INTO tags_search(rowid, name)
    VALUES (new.id, new.name);
END;

CREATE TRIGGER tags_search_deleted AFTER DELETE ON tags BEGIN
    INSERT INTO tags_search(tags_search, rowid, name)
    VALUES('delete', old.id, old.name);
END;

CREATE TRIGGER tags_search_updated AFTER UPDATE ON tags BEGIN
    INSERT INTO tags_search(tags_search, rowid, name)
    VALUES('delete', old.id, old.name);

    INSERT INTO tags_search(rowid, name)
    VALUES (new.id, new.name);
END;

/* ====== Documents ====== */
CREATE TABLE documents (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    content_structured TEXT,
    content_raw TEXT,
    user_id INTEGER NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX documents_user_index ON documents(user_id);

CREATE TRIGGER documents_updated
    AFTER UPDATE
    ON documents
    WHEN new.updated_at <= old.updated_at
BEGIN
    UPDATE documents SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;

CREATE VIRTUAL TABLE documents_search USING fts5(
    title,
    content_raw,
    content='documents',
    content_rowid='id'
);

CREATE TRIGGER documents_search_inserted AFTER INSERT ON documents BEGIN
    INSERT INTO documents_search(rowid, title, content_raw)
    VALUES (new.id, new.title, new.content_raw);
END;

CREATE TRIGGER documents_search_deleted AFTER DELETE ON documents BEGIN
    INSERT INTO documents_search(documents_search, rowid, title, content_raw)
    VALUES('delete', old.id, old.title, old.content_raw);
END;

CREATE TRIGGER documents_search_updated AFTER UPDATE ON documents BEGIN
    INSERT INTO documents_search(documents_search, rowid, title, content_raw)
    VALUES('delete', old.id, old.title, old.content_raw);

    INSERT INTO documents_search(rowid, title, content_raw)
    VALUES (new.id, new.title, new.content_raw);
END;

CREATE TABLE documents_tags (
    id INTEGER PRIMARY KEY,
    tag_id INTEGER NOT NULL,
    document_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tag_id, document_id),
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
);

/* ====== Files ====== */
CREATE TABLE files (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL UNIQUE,
    data BLOB NOT NULL,
    document_id INTEGER NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX files_document_index ON files(document_id);

CREATE VIRTUAL TABLE files_search USING fts5(
    filename,
    content='files',
    content_rowid='id'
);

CREATE TRIGGER files_search_inserted AFTER INSERT ON files BEGIN
    INSERT INTO files_search(rowid, filename)
    VALUES (new.id, new.filename);
END;

CREATE TRIGGER files_search_deleted AFTER DELETE ON files BEGIN
    INSERT INTO files_search(files_search, rowid, filename)
    VALUES('delete', old.id, old.filename);
END;

CREATE TRIGGER files_search_updated AFTER UPDATE ON files BEGIN
    INSERT INTO files_search(files_search, rowid, filename)
    VALUES('delete', old.id, old.filename);

    INSERT INTO files_search(rowid, filename)
    VALUES (new.id, new.filename);
END;

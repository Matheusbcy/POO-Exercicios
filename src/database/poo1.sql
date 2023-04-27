-- Active: 1682607272848@@127.0.0.1@3306

CREATE TABLE
    video (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        title TEXT NOT NULL,
        duration INTEGER UNIQUE NOT NULL,
        uploud_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    video (id, title, duration)
VALUES (
        "v001",
        "Geedix (Piseiro Do Luffy) - Estica e Vai",
        2.52
    ), (
        "v002",
        "Mc Sid, Spinardi - O Casamento",
        5.17
    );

SELECT * FROM video;

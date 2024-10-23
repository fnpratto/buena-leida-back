CREATE DATABASE buenaleida;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    username VARCHAR(100) NOT NULL,
    fullname VARCHAR(30) NOT NULL CHECK (CHAR_LENGTH(fullname) <= 30), 
    foto_perfil VARCHAR(255), 
    biografia TEXT,
    generos_favoritos VARCHAR(255) NOT NULL,
);

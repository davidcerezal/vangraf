-- Crear la tabla "clientes"
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20)
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    cantidad INTEGER
);

INSERT INTO clientes (nombre, email, telefono)
VALUES
    ('Juan Pérez', 'juan@example.com', '555-123-4567'),
    ('María López', 'maria@example.com', '555-987-6543'),
    ('Pedro Rodríguez', 'pedro@example.com', '555-555-5555');

INSERT INTO productos (nombre, categoria, cantidad)
VALUES
    ('papel', 'escuela', 100),
    ('boli', 'escuela', 65),
    ('lapiz', 'escuela', 81);

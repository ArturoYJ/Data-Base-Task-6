INSERT INTO autores (nombre, nacionalidad) VALUES
('Gabriel García Márquez', 'Colombiana'),
('J.K. Rowling', 'Británica'),
('George Orwell', 'Británica'),
('Isaac Asimov', 'Rusa'),
('Isabel Allende', 'Chilena');

INSERT INTO libros (titulo, genero, autor_id, anio_publicacion, stock) VALUES
('Cien años de soledad', 'Realismo Mágico', 1, 1967, 5),
('El amor en los tiempos del cólera', 'Romance', 1, 1985, 3),
('Harry Potter y la Piedra Filosofal', 'Fantasía', 2, 1997, 10),
('Harry Potter y la Cámara Secreta', 'Fantasía', 2, 1998, 8),
('1984', 'Ciencia Ficción', 3, 1949, 12),
('Rebelión en la granja', 'Sátira', 3, 1945, 6),
('Yo, Robot', 'Ciencia Ficción', 4, 1950, 4),
('Fundación', 'Ciencia Ficción', 4, 1951, 7),
('La casa de los espíritus', 'Realismo Mágico', 5, 1982, 5);

INSERT INTO usuarios (nombre, email) VALUES
('Juan Pérez', 'juan@email.com'),
('Maria Lopez', 'maria@email.com'),
('Carlos Ruiz', 'carlos@email.com'),
('Ana Torres', 'ana@email.com'),
('Luis Gomez', 'luis@email.com');

INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado, dias_retraso) VALUES
(1, 3, '2024-01-10', '2024-01-20', 'devuelto', 0),
(1, 5, '2024-02-01', '2024-02-15', 'devuelto', 2),
(2, 1, '2024-03-05', NULL, 'pendiente', 0),
(2, 7, '2024-03-10', NULL, 'pendiente', 0),
(3, 3, '2024-01-15', '2024-01-25', 'devuelto', 0),
(3, 4, '2024-02-20', '2024-03-05', 'devuelto', 5),
(4, 5, '2024-01-05', '2024-01-12', 'devuelto', 0),
(4, 6, '2024-01-20', NULL, 'retrasado', 10),
(5, 8, '2024-03-01', NULL, 'pendiente', 0),
(1, 4, '2024-03-15', NULL, 'pendiente', 0);
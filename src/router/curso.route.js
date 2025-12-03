import express from 'express';
import cursoController from '../controller/curso.controller.js';

const router = express.Router();

// Crear curso
router.post('/', cursoController.crearCurso);

// Listar cursos
router.get('/', cursoController.listarCursos);

// Buscar curso por nombre
router.get('/buscar/:nombre', cursoController.buscarCursoPorNombre);

// Obtener curso por ID
router.get('/:id', cursoController.obtenerCursoPorId);

export default router;
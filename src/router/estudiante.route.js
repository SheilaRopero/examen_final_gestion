import express from 'express';
import estudianteController from '../controller/estudiante.controller.js';

const router = express.Router();

// Crear estudiante
router.post('/', estudianteController.crearEstudiante);

// Listar todos los estudiantes
router.get('/', estudianteController.listarEstudiantes);

// Listar estudiantes por curso (por nombre)
router.get('/curso/:nombreCurso', estudianteController.listarEstudiantesPorCurso);

// Obtener curso de estudiante (por nombre)
router.get('/:nombreEstudiante/curso', estudianteController.obtenerCursoDeEstudiante);

// Obtener estudiante por ID
router.get('/:id', estudianteController.obtenerEstudiantePorId);

export default router;
import FirebaseService from '../services/firebase.service.js';

const cursoService = new FirebaseService('cursos');

const cursoController = {
  // 1. Crear un curso nuevo
  crearCurso: async (req, res) => {
    try {
      const { nombre, profesor } = req.body;
      
      console.log('Intentando crear curso:', { nombre, profesor });
      
      if (!nombre || !profesor) {
        return res.status(400).json({ 
          success: false,
          error: 'Nombre y profesor son requeridos' 
        });
      }

      const nuevoCurso = await cursoService.create({
        nombre,
        profesor,
        creado: new Date()
      });

      console.log('Curso creado en Firebase:', nuevoCurso);
      
      res.status(201).json({
        success: true,
        mensaje: 'Curso creado exitosamente',
        curso: nuevoCurso
      });
    } catch (error) {
      console.error('Error al crear curso:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al crear el curso',
        detalle: error.message 
      });
    }
  },

  //Listarcursos
  listarCursos: async (req, res) => {
    try {
      const cursos = await cursoService.getAll();
      res.json({
        success: true,
        data: cursos,
        total: cursos.length
      });
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener los cursos',
        detalle: error.message 
      });
    }
  },

  // Buscarnombre
  buscarCursoPorNombre: async (req, res) => {
    try {
      const { nombre } = req.params;
      const cursos = await cursoService.query('nombre', '==', nombre);
      
      res.json({
        success: true,
        data: cursos,
        total: cursos.length
      });
    } catch (error) {
      console.error('Error al buscar curso:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al buscar el curso',
        detalle: error.message 
      });
    }
  },

  // ObtenerID
  obtenerCursoPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const curso = await cursoService.getById(id);
      
      if (!curso) {
        return res.status(404).json({
          success: false,
          error: 'Curso no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: curso
      });
    } catch (error) {
      console.error('Error al obtener curso:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener el curso',
        detalle: error.message 
      });
    }
  }
};

export default cursoController;
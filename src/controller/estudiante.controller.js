import FirebaseService from '../services/firebase.service.js';

const estudianteService = new FirebaseService('estudiantes');
const cursoService = new FirebaseService('cursos');

const estudianteController = {
  // 2. Crear un estudiante asignado a un curso existente
  crearEstudiante: async (req, res) => {
    try {
      const { nombre, correo, cursoId } = req.body;
      
      console.log('📝 Intentando crear estudiante:', { nombre, correo, cursoId });
      
      if (!nombre || !correo || !cursoId) {
        return res.status(400).json({ 
          success: false,
          error: 'Nombre, correo y cursoId son requeridos' 
        });
      }

      // Verificar que el curso existe
      const curso = await cursoService.getById(cursoId);
      if (!curso) {
        return res.status(404).json({ 
          success: false,
          error: 'El curso especificado no existe' 
        });
      }

      const nuevoEstudiante = await estudianteService.create({
        nombre,
        correo,
        cursoId,
        inscrito: new Date()
      });

      console.log('✅ Estudiante creado en Firebase:', nuevoEstudiante);
      
      res.status(201).json({
        success: true,
        mensaje: 'Estudiante creado exitosamente',
        estudiante: nuevoEstudiante,
        curso: curso.nombre
      });
    } catch (error) {
      console.error('❌ Error al crear estudiante:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al crear el estudiante',
        detalle: error.message 
      });
    }
  },

  // 4. Listar todos los estudiantes de un curso específico (por nombre)
  listarEstudiantesPorCurso: async (req, res) => {
    try {
      const { nombreCurso } = req.params;
      
      console.log('🔍 Buscando estudiantes del curso:', nombreCurso);
      
      // Primero buscar el curso por nombre
      const cursos = await cursoService.query('nombre', '==', nombreCurso);
      if (cursos.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Curso no encontrado' 
        });
      }

      // Obtener estudiantes del primer curso encontrado
      const cursoId = cursos[0].id;
      const estudiantes = await estudianteService.query('cursoId', '==', cursoId);
      
      console.log(`✅ Encontrados ${estudiantes.length} estudiantes para el curso ${nombreCurso}`);
      
      res.json({
        success: true,
        curso: cursos[0],
        estudiantes: estudiantes,
        total: estudiantes.length
      });
    } catch (error) {
      console.error('❌ Error al obtener estudiantes del curso:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener estudiantes del curso',
        detalle: error.message 
      });
    }
  },

  // 5. Ver el curso al que pertenece un estudiante (por nombre)
  obtenerCursoDeEstudiante: async (req, res) => {
    try {
      const { nombreEstudiante } = req.params;
      
      console.log('🔍 Buscando curso del estudiante:', nombreEstudiante);
      
      // Buscar estudiante por nombre
      const estudiantes = await estudianteService.query('nombre', '==', nombreEstudiante);
      if (estudiantes.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Estudiante no encontrado' 
        });
      }

      const estudiante = estudiantes[0];
      
      // Obtener información del curso
      const curso = await cursoService.getById(estudiante.cursoId);
      
      console.log(`✅ Encontrado curso para estudiante ${nombreEstudiante}:`, curso?.nombre);
      
      res.json({
        success: true,
        estudiante: estudiante,
        curso: curso
      });
    } catch (error) {
      console.error('❌ Error al obtener información del estudiante:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener información del estudiante',
        detalle: error.message 
      });
    }
  },

  // Listar todos los estudiantes
  listarEstudiantes: async (req, res) => {
    try {
      const estudiantes = await estudianteService.getAll();
      res.json({
        success: true,
        data: estudiantes,
        total: estudiantes.length
      });
    } catch (error) {
      console.error('❌ Error al obtener estudiantes:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener los estudiantes',
        detalle: error.message 
      });
    }
  },

  // Obtener estudiante por ID
  obtenerEstudiantePorId: async (req, res) => {
    try {
      const { id } = req.params;
      const estudiante = await estudianteService.getById(id);
      
      if (!estudiante) {
        return res.status(404).json({
          success: false,
          error: 'Estudiante no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: estudiante
      });
    } catch (error) {
      console.error('❌ Error al obtener estudiante:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener el estudiante',
        detalle: error.message 
      });
    }
  }
};

export default estudianteController;
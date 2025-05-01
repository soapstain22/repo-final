import ExerciseType from '../models/ExerciseType';

export default class ExerciseTypeController {
  static async create(req, res) {
    try {
      const { name, description } = req.body;
      const exerciseType = await ExerciseType.create(name, description);
      res.status(201).json(exerciseType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async get(req, res) {
    try {
      const { id } = req.params;
      const exerciseType = await ExerciseType.get(id);
      if (!exerciseType) {
        return res.status(404).json({ error: 'ExerciseType not found' });
      }
      res.json(exerciseType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const exerciseTypes = await ExerciseType.getAll();
      res.json(exerciseTypes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const exerciseType = await ExerciseType.update(id, name, description);
      res.json(exerciseType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await ExerciseType.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

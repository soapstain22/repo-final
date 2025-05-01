import Activity from '../models/Activity';
import { canAccessActivity } from '../policies/policies';

export default class ActivityController {
  static async create(req, res) {
    try {
      const { userId, description, duration, date } = req.body;
      // Assuming req.user is populated by middleware with the authenticated user
      const user = req.user;

      if (user.id !== userId && user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const activity = await Activity.create(userId, description, duration, date);
      res.status(201).json(activity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async get(req, res) {
    try {
      const { id } = req.params;
      // Assuming req.user is populated by middleware with the authenticated user
      const user = req.user;
      const activity = await Activity.get(id);

      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      if (!canAccessActivity(user, activity)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(activity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { userId } = req.params;
      // Assuming req.user is populated by middleware with the authenticated user
      const user = req.user;

      if (user.id !== userId && user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const activities = await Activity.getAll(userId);
      res.json(activities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { description, duration, date } = req.body;
      // Assuming req.user is populated by middleware with the authenticated user
      const user = req.user;
      const activity = await Activity.get(id);

      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      if (!canAccessActivity(user, activity)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updatedActivity = await Activity.update(id, description, duration, date);
      res.json(updatedActivity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      // Assuming req.user is populated by middleware with the authenticated user
      const user = req.user;
      const activity = await Activity.get(id);

      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      if (!canAccessActivity(user, activity)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await Activity.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

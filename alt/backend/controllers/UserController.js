import User from '../models/User';
import { canManageUser } from '../policies/policies';

export default class UserController {
  static async get(req, res) {
    try {
      const { id } = req.params;
      const user = await User.get(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Assuming req.user is populated by middleware with the authenticated user
      const loggedInUser = req.user;
      if (!canManageUser(loggedInUser, user)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      // For simplicity, only admins can list all users
      const loggedInUser = req.user;
      if (loggedInUser.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, role } = req.body;

      // Assuming req.user is populated by middleware with the authenticated user
      const loggedInUser = req.user;
      const user = await User.get(id);

       if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!canManageUser(loggedInUser, user)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updatedUser = await User.update(id, firstName, lastName, role);
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Assuming req.user is populated by middleware with the authenticated user
      const loggedInUser = req.user;
      const user = await User.get(id);

       if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!canManageUser(loggedInUser, user)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await User.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

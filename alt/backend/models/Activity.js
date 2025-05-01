import { supabase } from '../../src/supabase';

export default class Activity {
  constructor(id, userId, description, duration, date) {
    this.id = id;
    this.userId = userId;
    this.description = description;
    this.duration = duration;
    this.date = date;
  }

  static async create(userId, description, duration, date) {
    const { data, error } = await supabase
      .from('activities')
      .insert([
        { user_id: userId, description, duration, date },
      ])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  static async get(id) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getAll(userId) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      throw error;
    }

    return data;
  }

  static async update(id, description, duration, date) {
    const { data, error } = await supabase
      .from('activities')
      .update({ description, duration, date })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}

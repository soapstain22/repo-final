import { supabase } from '../../src/supabase';

export default class ExerciseType {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async create(name, description) {
    const { data, error } = await supabase
      .from('exercise_types')
      .insert([
        { name, description },
      ])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  static async get(id) {
    const { data, error } = await supabase
      .from('exercise_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getAll() {
    const { data, error } = await supabase
      .from('exercise_types')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  }

  static async update(id, name, description) {
    const { data, error } = await supabase
      .from('exercise_types')
      .update({ name, description })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from('exercise_types')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}

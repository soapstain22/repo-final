import { supabase } from '../../src/supabase';

export default class User {
  constructor(id, email, firstName, lastName, role) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }

  static async get(id) {
    const { data, error } = await supabase
      .from('users')
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
      .from('users')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  }

  static async update(id, firstName, lastName, role) {
    const { data, error } = await supabase
      .from('users')
      .update({ firstName, lastName, role })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}
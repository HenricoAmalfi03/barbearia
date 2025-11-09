// Storage layer not needed - using Supabase directly in routes
export interface IStorage {}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();

const BASE_URL = 'http://localhost:3001';

export const api = {
  // Users
  getUsers: async () => {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  getUser: async (id: string) => {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
  createUser: async (user: any) => {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },
  updateUser: async (id: string, user: any) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },
  deleteUser: async (id: string) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  // Roles
  getRoles: async () => {
    const res = await fetch(`${BASE_URL}/roles`);
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  },
  createRole: async (role: any) => {
    const res = await fetch(`${BASE_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role)
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },
  updateRole: async (id: string, role: any) => {
    const res = await fetch(`${BASE_URL}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role)
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },
  deleteRole: async (id: string) => {
    const res = await fetch(`${BASE_URL}/roles/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete role');
    return res.json();
  },

  // Workspaces
  getWorkspaces: async () => {
    const res = await fetch(`${BASE_URL}/workspaces`);
    if (!res.ok) throw new Error('Failed to fetch workspaces');
    return res.json();
  },
  createWorkspace: async (workspace: any) => {
    const res = await fetch(`${BASE_URL}/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workspace)
    });
    if (!res.ok) throw new Error('Failed to create workspace');
    return res.json();
  },
  updateWorkspace: async (id: string, workspace: any) => {
    const res = await fetch(`${BASE_URL}/workspaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workspace)
    });
    if (!res.ok) throw new Error('Failed to update workspace');
    return res.json();
  },
  deleteWorkspace: async (id: string) => {
    const res = await fetch(`${BASE_URL}/workspaces/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete workspace');
    return res.json();
  }
};

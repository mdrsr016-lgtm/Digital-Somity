export interface MockUser {
  id: string;
  name: string;
  roleEn: string;
  roleBn: string;
  status: 'active' | 'inactive' | 'removed' | 'suspended' | 'disabled';
  lastLoginEn: string;
  lastLoginBn: string;
  initial: string;
  workspaceId: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'adm00',
    name: 'Rashid Shahriyar',
    roleEn: 'System Administrator',
    roleBn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
    status: 'active',
    lastLoginEn: 'Today, 10:30 AM',
    lastLoginBn: 'আজ, সকাল ১০:৩০',
    initial: 'R',
    workspaceId: '1',
    email: 'admin@dsbd.com',
    phone: '+880 1711-234567',
    password: 'adm00'
  }
];

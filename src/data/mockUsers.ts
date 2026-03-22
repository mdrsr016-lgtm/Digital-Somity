export interface MockUser {
  id: string;
  name: string;
  roleEn: string;
  roleBn: string;
  status: 'active' | 'inactive' | 'removed' | 'suspended' | 'disabled';
  lastLoginEn: string;
  lastLoginBn: string;
  initial: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Rafiqul Islam',
    roleEn: 'System Administrator',
    roleBn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
    status: 'active',
    lastLoginEn: 'Today, 10:30 AM',
    lastLoginBn: 'আজ, সকাল ১০:৩০',
    initial: 'R'
  },
  {
    id: '2',
    name: 'Nusrat Jahan',
    roleEn: 'Investment Manager',
    roleBn: 'বিনিয়োগ ব্যবস্থাপক',
    status: 'active',
    lastLoginEn: 'Yesterday, 4:15 PM',
    lastLoginBn: 'গতকাল, বিকাল ৪:১৫',
    initial: 'N'
  },
  {
    id: '3',
    name: 'Abdul Karim',
    roleEn: 'Society Member',
    roleBn: 'সমিতির সদস্য',
    status: 'inactive',
    lastLoginEn: 'Oct 12, 2023',
    lastLoginBn: '১২ অক্টো, ২০২৩',
    initial: 'A'
  }
];

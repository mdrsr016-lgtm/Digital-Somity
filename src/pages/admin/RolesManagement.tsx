import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Shield, Users, Check, Edit, CheckCircle, Plus, X, Trash2 } from "lucide-react";

interface Role {
  id: string;
  nameEn: string;
  nameBn: string;
  members: number;
  permissionsEn: string[];
  permissionsBn: string[];
}

const AVAILABLE_PERMISSIONS = [
  { en: 'All Access', bn: 'পূর্ণ অ্যাক্সেস' },
  { en: 'User Management', bn: 'ব্যবহারকারী ব্যবস্থাপনা' },
  { en: 'Settings', bn: 'সেটিংস' },
  { en: 'Investment Reports', bn: 'বিনিয়োগ রিপোর্ট' },
  { en: 'Member View', bn: 'সদস্য ভিউ' },
  { en: 'Transactions', bn: 'লেনদেন' },
  { en: 'Personal Profile', bn: 'নিজস্ব প্রোফাইল' },
  { en: 'Savings View', bn: 'সঞ্চয় ভিউ' },
  { en: 'Loan Status', bn: 'ঋণের অবস্থা' },
  { en: 'Daily Collections', bn: 'দৈনিক সংগ্রহ' },
  { en: 'Voucher Entry', bn: 'ভাউচার এন্ট্রি' },
  { en: 'Member Search', bn: 'সদস্য অনুসন্ধান' }
];

export const RolesManagement = () => {
  const { t, language } = useLanguage();
  const adminT = t.admin || {} as any;
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem("ds_roles");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved roles", e);
      }
    }
    return [
      {
        id: 'admin',
        nameEn: 'System Administrator',
        nameBn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
        members: 1,
        permissionsEn: ['All Access', 'User Management', 'Settings'],
        permissionsBn: ['পূর্ণ অ্যাক্সেস', 'ব্যবহারকারী ব্যবস্থাপনা', 'সেটিংস']
      },
      {
        id: 'manager',
        nameEn: 'Investment Manager',
        nameBn: 'বিনিয়োগ ব্যবস্থাপক',
        members: 2,
        permissionsEn: ['Investment Reports', 'Member View', 'Transactions'],
        permissionsBn: ['বিনিয়োগ রিপোর্ট', 'সদস্য ভিউ', 'লেনদেন']
      },
      {
        id: 'member',
        nameEn: 'Society Member',
        nameBn: 'সমিতির সদস্য',
        members: 145,
        permissionsEn: ['Personal Profile', 'Savings View', 'Loan Status'],
        permissionsBn: ['নিজস্ব প্রোফাইল', 'সঞ্চয় ভিউ', 'ঋণের অবস্থা']
      },
      {
        id: 'cashier',
        nameEn: 'Cashier',
        nameBn: 'ক্যাশিয়ার',
        members: 5,
        permissionsEn: ['Daily Collections', 'Voucher Entry', 'Member Search'],
        permissionsBn: ['দৈনিক সংগ্রহ', 'ভাউচার এন্ট্রি', 'সদস্য অনুসন্ধান']
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("ds_roles", JSON.stringify(roles));
  }, [roles]);

  const handleAction = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleEdit = (role: Role | null) => {
    setEditingRole(role ? { ...role } : {
      id: Math.random().toString(36).substr(2, 9),
      nameEn: '',
      nameBn: '',
      members: 0,
      permissionsEn: [],
      permissionsBn: []
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoleToDelete(id);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      setRoles(roles.filter(r => r.id !== roleToDelete));
      handleAction(language === 'bn' ? 'ভূমিকা মুছে ফেলা হয়েছে!' : 'Role Deleted!');
      setRoleToDelete(null);
    }
  };

  const togglePermission = (perm: { en: string; bn: string }) => {
    if (!editingRole) return;
    
    const hasPerm = editingRole.permissionsEn.includes(perm.en);
    const newEn = hasPerm 
      ? editingRole.permissionsEn.filter(p => p !== perm.en)
      : [...editingRole.permissionsEn, perm.en];
    const newBn = hasPerm
      ? editingRole.permissionsBn.filter(p => p !== perm.bn)
      : [...editingRole.permissionsBn, perm.bn];

    setEditingRole({
      ...editingRole,
      permissionsEn: newEn,
      permissionsBn: newBn
    });
  };

  const handleSave = () => {
    if (!editingRole) return;
    if (!editingRole.nameEn || !editingRole.nameBn) {
      alert(language === 'bn' ? 'দয়া করে নাম লিখুন' : 'Please provide names');
      return;
    }

    if (roles.find(r => r.id === editingRole.id)) {
      setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
      handleAction(language === 'bn' ? 'আপডেট করা হয়েছে!' : 'Updated Successfully!');
    } else {
      setRoles([...roles, editingRole]);
      handleAction(language === 'bn' ? 'যোগ করা হয়েছে!' : 'Added Successfully!');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>{adminT.rolesManagement || "Roles Management"}</h2>
          <p>{adminT.rolesMsg || "Configure system-wide user roles and their associated permission levels."}</p>
        </div>
        <button 
          className="admin-btn-primary" 
          onClick={() => handleEdit(null)}
          disabled={!!actionFeedback}
        >
          {actionFeedback ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              {actionFeedback}
            </div>
          ) : (
            <>
              <Plus size={18} style={{ marginRight: '8px' }} />
              {adminT.manageRoles || "Create Roles"}
            </>
          )}
        </button>
      </div>

      <div className="admin-card admin-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>{language === 'bn' ? 'ভূমিকা' : 'Role'}</th>
              <th>{language === 'bn' ? 'অনুমতি' : 'Permissions'}</th>
              <th>{language === 'bn' ? 'সদস্য সংখ্যা' : 'Members'}</th>
              <th>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small" style={{ background: 'var(--color-violet-soft)', color: 'var(--color-violet)' }}>
                      <Shield size={18} />
                    </div>
                    <span>{language === 'bn' ? role.nameBn : role.nameEn}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(language === 'bn' ? role.permissionsBn : role.permissionsEn).map((perm, idx) => (
                      <span key={idx} className="status-badge active" style={{ fontSize: '0.7rem', textTransform: 'none' }}>
                        <Check size={10} style={{ marginRight: '4px' }} />
                        {perm}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-sub)' }}>
                    <Users size={16} />
                    {role.members}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="admin-btn-text"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit size={16} />
                      <span style={{ marginLeft: '6px' }}>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                    </button>
                    <button 
                      className="admin-btn-text"
                      style={{ color: 'var(--color-danger, #ff4d4d)' }}
                      onClick={() => handleDelete(role.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingRole && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{language === 'bn' ? (roles.find(r => r.id === editingRole.id) ? 'ভূমিকা সম্পাদনা' : 'নতুন ভূমিকা') : (roles.find(r => r.id === editingRole.id) ? 'Edit Role' : 'New Role')}</h3>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="admin-modal-body">
              <div className="modal-input-group">
                <label>{language === 'bn' ? 'ভূমিকার নাম (ইংরেজি)' : 'Role Name (English)'}</label>
                <input 
                  type="text" 
                  value={editingRole.nameEn} 
                  onChange={e => setEditingRole({...editingRole, nameEn: e.target.value})}
                  className="admin-input" 
                />
              </div>
              <div className="modal-input-group">
                <label>{language === 'bn' ? 'ভূমিকার নাম (বাংলা)' : 'Role Name (বাংলা)'}</label>
                <input 
                  type="text" 
                  value={editingRole.nameBn} 
                  onChange={e => setEditingRole({...editingRole, nameBn: e.target.value})}
                  className="admin-input" 
                />
              </div>

              <div className="permissions-section">
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                  {language === 'bn' ? 'অনুমতি সমূহ' : 'Permissions'}
                </label>
                <div className="permissions-grid">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <div 
                      key={perm.en} 
                      className={`permission-item ${editingRole.permissionsEn.includes(perm.en) ? 'active' : ''}`}
                      onClick={() => togglePermission(perm)}
                    >
                      <div className="permission-checkbox">
                        {editingRole.permissionsEn.includes(perm.en) && <Check size={12} color="white" />}
                      </div>
                      {language === 'bn' ? perm.bn : perm.en}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-text" onClick={() => setIsModalOpen(false)}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button className="admin-btn-primary" onClick={handleSave} style={{ marginTop: 0 }}>
                {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {roleToDelete && (
        <div className="admin-modal-overlay" onClick={() => setRoleToDelete(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header" style={{ marginBottom: '16px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '20px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Trash2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>{language === 'bn' ? 'ভূমিকা মুছে ফেলুন' : 'Delete Role'}</h3>
              <p>{language === 'bn' ? 'আপনি কি নিশ্চিত যে আপনি এই ভূমিকাটি মুছে ফেলতে চান? এই কাজটি আর ফিরে পাওয়া যাবে না।' : 'Are you sure you want to delete this role? This action cannot be undone.'}</p>
            </div>

            <div className="admin-modal-footer" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <button className="admin-btn-secondary" onClick={() => setRoleToDelete(null)}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                className="admin-btn-primary" 
                onClick={confirmDelete}
                style={{ background: '#ef4444', marginTop: 0 }}
              >
                {language === 'bn' ? 'মুছে ফেলুন' : 'Delete Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Shield, Users, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";

interface Role {
  id: string;
  nameEn: string;
  nameBn: string;
  count: number;
  status: 'active' | 'archived';
}

export const RolesManagement = () => {
  const { t, language } = useLanguage();
  const adminT = t.admin || {} as any;
  const { roles, setRoles, updateRoleStatus, showToast } = useOutletContext<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const activeRoles = roles.filter((r: any) => r.status !== 'archived');

  const handleEdit = (role: Role | null) => {
    setEditingRole(role ? { ...role } : {
      id: Math.random().toString(36).substr(2, 9),
      nameEn: "",
      nameBn: "",
      count: 0,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      updateRoleStatus(roleToDelete.id, 'archived');
      showToast(language === 'bn' ? 'ভূমিকা ফ্রিজে পাঠানো হয়েছে!' : 'Role moved to Fridge!');
      setRoleToDelete(null);
    }
  };

  // Keyboard support for modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isModalOpen || roleToDelete)) {
        closeModal();
        setRoleToDelete(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isModalOpen, roleToDelete]);

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
        const modal = target.closest('.admin-modal-card');
        const allInputs = Array.from(modal?.querySelectorAll('input:not([readOnly]), select') || []) as HTMLElement[];
        const index = allInputs.indexOf(target);
        
        if (index > -1 && index < allInputs.length - 1) {
          e.preventDefault();
          allInputs[index + 1].focus();
        } else if (index === allInputs.length - 1) {
          e.preventDefault();
          handleSave();
        }
      }
    }
  };

  const handleSave = async () => {
    if (!editingRole) return;
    try {
      if (roles.find((r: any) => r.id === editingRole.id)) {
        await api.updateRole(editingRole.id, editingRole);
        setRoles(roles.map((r: any) => r.id === editingRole.id ? editingRole : r));
      } else {
        await api.createRole(editingRole);
        setRoles([...roles, editingRole]);
      }
      showToast(language === 'bn' ? 'সফলভাবে সংরক্ষিত হয়েছে!' : 'Saved Successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save role', error);
      showToast('Error saving role');
    }
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
        >
          <Plus size={18} style={{ marginRight: '8px' }} />
          {adminT.manageRoles || "Create Roles"}
        </button>
      </div>

      <div className="admin-card admin-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>{language === 'bn' ? 'ভূমিকা' : 'Role'}</th>
              <th>{language === 'bn' ? 'সদস্য সংখ্যা' : 'Members'}</th>
              <th>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {activeRoles.map((role: any) => (
              <tr key={role.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                      <Shield size={16} />
                    </div>
                    <span>{language === 'bn' ? role.nameBn : role.nameEn}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} style={{ opacity: 0.5 }} />
                    {role.count}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn-text" onClick={() => handleEdit(role)}>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</button>
                    <button className="admin-btn-text" style={{ color: '#ef4444' }} onClick={() => setRoleToDelete(role)}>
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
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()} onKeyDown={handleModalKeyDown}>
            <div className="admin-modal-header">
              <h3>{editingRole.id ? (language === 'bn' ? 'ভূমিকা সম্পাদনা' : 'Edit Role') : (language === 'bn' ? 'নতুন ভূমিকা' : 'New Role')}</h3>
              <button className="admin-modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <div className="settings-form">
                <div className="modal-input-group">
                  <label>{language === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'}</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingRole.nameEn} 
                    onChange={e => setEditingRole({ ...editingRole, nameEn: e.target.value })}
                  />
                </div>
                <div className="modal-input-group">
                  <label>{language === 'bn' ? 'নাম (বাংলা)' : 'Name (Bengali)'}</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editingRole.nameBn} 
                    onChange={e => setEditingRole({ ...editingRole, nameBn: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={closeModal}>{language === 'bn' ? 'বাতিল' : 'Cancel'}</button>
              <button className="admin-btn-primary" style={{ marginTop: 0 }} onClick={handleSave}>
                {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {roleToDelete && (
          <div className="admin-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="admin-modal-card" 
              style={{ maxWidth: '400px', textAlign: 'center' }}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmDelete(); }}
              tabIndex={0}
            >
              <div className="admin-modal-body" style={{ padding: '40px 32px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '20px', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto'
                }}>
                  <AlertTriangle size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>{language === 'bn' ? 'ফ্রিজে পাঠান?' : 'Move to Fridge?'}</h3>
                <p style={{ color: 'var(--text-sub)', marginBottom: '32px', lineHeight: 1.5 }}>
                  {language === 'bn' 
                    ? `আপনি কি নিশ্চিত যে আপনি ${roleToDelete.nameBn || roleToDelete.nameEn} কে ফ্রিজে পাঠাতে চান? এটি পরে পুনরুদ্ধার করা যাবে।` 
                    : `Are you sure you want to move ${roleToDelete.nameEn} to the Fridge? You can restore it later.`}
                </p>
              
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="admin-btn-secondary" onClick={() => setRoleToDelete(null)} style={{ flex: 1, marginTop: 0 }}>
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button 
                    className="admin-btn-primary" 
                    onClick={confirmDelete}
                    style={{ flex: 1, background: '#ef4444', marginTop: 0 }}
                  >
                    {language === 'bn' ? 'মুছে ফেলুন' : 'Delete Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

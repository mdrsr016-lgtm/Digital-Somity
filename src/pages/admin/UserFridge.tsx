import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { Snowflake, RefreshCw, Trash2, AlertTriangle, Users, Shield, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const UserFridge = () => {
  const { language } = useLanguage();
  const { 
    users, updateStatus, deleteUser, showToast,
    roles, updateRoleStatus, deleteRolePermanently,
    workspaces, updateWorkspaceStatus, deleteWorkspacePermanently
  } = useOutletContext<any>();
  
  const [activeCategory, setActiveCategory] = useState<'users' | 'roles' | 'workspaces'>('users');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'user' | 'role' | 'workspace' } | null>(null);

  // Filter archived items
  const fridgedUsers = users.filter((u: any) => ['removed', 'suspended', 'disabled'].includes(u.status));
  const fridgedRoles = roles?.filter((r: any) => r.status === 'archived') || [];
  const fridgedWorkspaces = workspaces?.filter((w: any) => w.status === 'archived') || [];

  const handleRestore = (id: string, name: string, type: 'user' | 'role' | 'workspace') => {
    if (type === 'user') updateStatus(id, 'active');
    else if (type === 'role') updateRoleStatus(id, 'active');
    else if (type === 'workspace') updateWorkspaceStatus(id, 'active');

    const msg = language === 'bn' 
      ? `${name} কে সফলভাবে পুনরুদ্ধার করা হয়েছে!` 
      : `${name} has been restored successfully!`;
    showToast(msg);
  };

  const handleDeleteClick = (id: string, name: string, type: 'user' | 'role' | 'workspace') => {
    setItemToDelete({ id, name, type });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'user') deleteUser(itemToDelete.id);
      else if (itemToDelete.type === 'role') deleteRolePermanently(itemToDelete.id);
      else if (itemToDelete.type === 'workspace') deleteWorkspacePermanently(itemToDelete.id);

      const msg = language === 'bn' 
        ? `${itemToDelete.name} কে স্থায়ীভাবে মুছে ফেলা হয়েছে` 
        : `${itemToDelete.name} has been permanently deleted.`;
      showToast(msg);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const categories = [
    { id: 'users', en: 'Users', bn: 'ব্যবহারকারী', icon: Users },
    { id: 'roles', en: 'Roles', bn: 'ভূমিকা', icon: Shield },
    { id: 'workspaces', en: 'Workspaces', bn: 'ওয়ার্কস্পেস', icon: Building2 }
  ];

  const statusOptions = [
    { id: 'removed', en: 'Removed', bn: 'অপসারিত' },
    { id: 'suspended', en: 'Suspended', bn: 'স্থগিত' },
    { id: 'disabled', en: 'Disabled', bn: 'নিষ্ক্রিয়' }
  ];

  const getDisplayData = () => {
    if (activeCategory === 'users') {
      return filterStatus ? fridgedUsers.filter((u: any) => u.status === filterStatus) : fridgedUsers;
    }
    if (activeCategory === 'roles') return fridgedRoles;
    if (activeCategory === 'workspaces') return fridgedWorkspaces;
    return [];
  };

  const displayData = getDisplayData();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <Snowflake size={24} />
            </div>
            <h2 style={{ margin: 0 }}>{language === 'bn' ? 'ফ্রিজ' : 'Fridge'}</h2>
          </div>
          <p>{language === 'bn' ? 'অপসারিত বা আর্কাইভ করা সকল আইটেম এখানে জমা থাকে।' : 'View and manage all items that have been archived or removed.'}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="admin-filter-bar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {categories.map(cat => (
          <button 
            key={cat.id}
            className={activeCategory === cat.id ? 'admin-btn-primary' : 'admin-btn-secondary'}
            onClick={() => { setActiveCategory(cat.id as any); setFilterStatus(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '14px' }}
          >
            <cat.icon size={18} />
            {language === 'bn' ? cat.bn : cat.en}
            <span style={{ 
              background: activeCategory === cat.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
              padding: '2px 8px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              marginLeft: '4px'
            }}>
              {cat.id === 'users' ? fridgedUsers.length : cat.id === 'roles' ? fridgedRoles.length : fridgedWorkspaces.length}
            </span>
          </button>
        ))}
      </div>

      {/* User Status Filter - Only shown for users */}
      {activeCategory === 'users' && (
        <div className="admin-filter-bar" style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', paddingLeft: '12px', borderLeft: '2px solid var(--border-color)' }}>
          <button 
            className={filterStatus === null ? 'admin-btn-text active' : 'admin-btn-text'} 
            onClick={() => setFilterStatus(null)}
            style={{ color: filterStatus === null ? 'var(--accent-color)' : 'var(--text-sub)' }}
          >
            {language === 'bn' ? 'সব' : 'All Status'}
          </button>
          {statusOptions.map((opt) => (
            <button 
              key={opt.id}
              className={filterStatus === opt.id ? 'admin-btn-text active' : 'admin-btn-text'}
              onClick={() => setFilterStatus(opt.id)}
              style={{ color: filterStatus === opt.id ? 'var(--accent-color)' : 'var(--text-sub)' }}
            >
              {language === 'bn' ? opt.bn : opt.en}
            </button>
          ))}
        </div>
      )}

      <div className="admin-card admin-table-card">
        {displayData.length > 0 ? (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>{language === 'bn' ? 'নাম' : 'Name'}</th>
                <th>{activeCategory === 'users' ? (language === 'bn' ? 'ভূমিকা' : 'Role') : (activeCategory === 'workspaces' ? (language === 'bn' ? 'সাবস্ক্রিপশন' : 'Subscription') : (language === 'bn' ? 'ধরন' : 'Type'))}</th>
                <th>{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                        {item.initial || (activeCategory === 'roles' ? <Shield size={16} /> : <Building2 size={16} />)}
                      </div>
                      <span>{item.name || (language === 'bn' ? item.nameBn : item.nameEn)}</span>
                    </div>
                  </td>
                  <td>
                    {activeCategory === 'users' 
                      ? (language === 'bn' ? item.roleBn : item.roleEn)
                      : (activeCategory === 'roles' ? (language === 'bn' ? 'সিস্টেম ভূমিকা' : 'System Role') : (language === 'bn' ? item.typebn : item.typeen))}
                  </td>
                  <td>
                    <span className={`status-badge ${item.status || 'archived'}`}>
                      {language === 'bn' 
                        ? (item.status === 'removed' ? 'অপসারিত' : item.status === 'suspended' ? 'স্থগিত' : item.status === 'disabled' ? 'নিষ্ক্রিয়' : 'আর্কাইভ করা') 
                        : (item.status || 'archived').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="admin-btn-text" 
                        onClick={() => handleRestore(item.id, item.name || (language === 'bn' ? item.nameBn : item.nameEn), activeCategory === 'users' ? 'user' : activeCategory === 'roles' ? 'role' : 'workspace')}
                        title={language === 'bn' ? 'পুনরুদ্ধার করুন' : 'Restore'}
                      >
                        <RefreshCw size={16} />
                        <span style={{ marginLeft: '6px' }}>{language === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                      </button>
                      <button 
                        className="admin-btn-text" 
                        style={{ color: '#ef4444' }}
                        onClick={() => handleDeleteClick(item.id, item.name || (language === 'bn' ? item.nameBn : item.nameEn), activeCategory === 'users' ? 'user' : activeCategory === 'roles' ? 'role' : 'workspace')}
                        title={language === 'bn' ? 'স্থায়ীভাবে মুছে ফেলুন' : 'Delete Permanently'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-sub)' }}>
            <Snowflake size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>{language === 'bn' ? 'কোন ডেটা পাওয়া যায়নি' : 'No archived items in this category'}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && itemToDelete && (
          <div className="admin-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="admin-modal-card"
              style={{ maxWidth: '400px', textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
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
                
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>
                  {language === 'bn' ? 'স্থায়ীভাবে মুছে ফেলুন?' : 'Delete Permanently?'}
                </h3>
                <p style={{ color: 'var(--text-sub)', marginBottom: '32px', lineHeight: 1.5 }}>
                  {language === 'bn' 
                    ? `আপনি কি নিশ্চিত যে আপনি ${itemToDelete.name} কে স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি আর ফিরে পাওয়া যাবে না।` 
                    : `Are you sure you want to delete ${itemToDelete.name}? This action cannot be undone.`}
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="admin-btn-secondary" 
                    onClick={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }}
                    style={{ flex: 1, marginTop: 0 }}
                  >
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

import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { X, Trash2, ShieldAlert, Power, UserPlus, AlertTriangle, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const UsersManagement = () => {
  const { t, language } = useLanguage();
  const adminT = t.admin || {} as any;
  const { users, workspaces, updateStatus: globalUpdateStatus, generateUserId, showToast, searchQuery, saveUser } = useOutletContext<any>();

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [modalName, setModalName] = useState("");
  const [modalRole, setModalRole] = useState<string>("");
  const [modalWorkspace, setModalWorkspace] = useState<string>("");
  const [modalUserId, setModalUserId] = useState<string>("");
  const [modalPassword, setModalPassword] = useState<string>("");
  const [workspaceError, setWorkspaceError] = useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isIdEditable, setIsIdEditable] = useState(false);
  const [userToArchive, setUserToArchive] = useState<MockUser | null>(null);

  const uniqueRoles = useMemo(() => {
    const rolesMap = new Map();
    const rolesList = JSON.parse(localStorage.getItem("ds_roles") || '[]');
    if (rolesList.length > 0) {
      rolesList.forEach((r: any) => rolesMap.set(r.nameEn, r.nameBn));
    } else {
      users.forEach((u: any) =>
 rolesMap.set(u.roleEn, u.roleBn));
      users.forEach((u: any) => rolesMap.set(u.roleEn, u.roleBn));
    }
    return Array.from(rolesMap.entries()).map(([en, bn]) => ({ en, bn }));
  }, [users]);

  const displayedUsers = (users || [])
    .filter((u: any) => {
      if (filterRole && u.roleEn !== filterRole) return false;
      return !['removed', 'suspended', 'disabled'].includes(u.status);
    })
    .filter((u: any) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.roleEn.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    });

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setModalName(user.name);
    setModalRole(user.roleEn);
    setModalWorkspace(user.workspaceId || "");
    setModalUserId(user.id);
    setModalPassword(user.password || '');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setModalName("");
    setModalRole("");
    setModalWorkspace("");
    setModalUserId("");
    setModalPassword("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setWorkspaceError(false);
    setSelectedUser(null);
    setIsIdEditable(false);
  };

  const updateStatus = async (status: MockUser['status']) => {
    if (!selectedUser) return;
    await globalUpdateStatus(selectedUser.id, status);
    
    let msg = "";
    if (status === 'removed') msg = language === 'bn' ? 'অপসারণ করা হয়েছে!' : 'User Removed!';
    else if (status === 'suspended') msg = language === 'bn' ? 'স্থগিত করা হয়েছে!' : 'Suspended!';
    else if (status === 'disabled') msg = language === 'bn' ? 'নিষ্ক্রিয় করা হয়েছে!' : 'Disabled!';
    
    if (msg) showToast(msg);
    closeModal();
  };

  const handleSave = async () => {
    if (!modalName.trim()) {
      showToast(language === 'bn' ? 'দয়া করে নাম লিখুন' : 'Please enter a name');
      return;
    }
    if (modalRole && !modalWorkspace) {
      setWorkspaceError(true);
      return;
    }

    const roleBn = uniqueRoles.find((r: any) => r.en === modalRole)?.bn || modalRole;
    
    const userData: MockUser = {
      id: modalUserId || (selectedUser?.id ?? Math.random().toString(36).substr(2, 9)),
      name: modalName,
      roleEn: modalRole,
      roleBn: roleBn,
      status: selectedUser?.status || 'active',
      workspaceId: modalWorkspace,
      password: modalPassword,
      initial: modalName.charAt(0).toUpperCase() || 'U',
      lastLoginEn: selectedUser?.lastLoginEn || 'Never',
      lastLoginBn: selectedUser?.lastLoginBn || 'কখনো না'
    };

    const success = await saveUser(userData, !selectedUser);
    
    if (success) {
      showToast(language === 'bn' 
        ? (selectedUser ? 'পরিবর্তনগুলো সফলভাবে সংরক্ষিত হয়েছে' : 'নতুন ব্যবহারকারী সফলভাবে তৈরি হয়েছে')
        : (selectedUser ? 'Changes saved successfully.' : 'New user created successfully.')
      );
      closeModal();
    } else {
      showToast(language === 'bn' ? 'ত্রুটি ঘটেছে!' : 'An error occurred!');
    }
  };

  // Keyboard support for modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isModalOpen || isArchiveModalOpen)) {
        closeModal();
        setIsArchiveModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isModalOpen, isArchiveModalOpen]);

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

  const handleArchiveClick = (user: any) => {
    setUserToArchive(user);
    setIsArchiveModalOpen(true);
  };

  const confirmArchive = async () => {
    if (userToArchive) {
      await globalUpdateStatus(userToArchive.id, 'removed');
      showToast(language === 'bn' ? 'ব্যবহারকারীকে ফ্রিজে পাঠানো হয়েছে!' : 'User moved to Fridge!');
      setIsArchiveModalOpen(false);
      setUserToArchive(null);
      if (selectedUser?.id === userToArchive.id) closeModal();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-header-text">
          <h2>{adminT.usersManagement || "Users Management"}</h2>
          <p>{adminT.manageUsersMsg || "Manage application users, roles, and permissions."}</p>
        </div>
        <button className="admin-btn-primary" onClick={handleAdd}>
          <UserPlus size={18} style={{ marginRight: '8px' }} />
          {adminT.addNewUser || "Add New User"}
        </button>
      </div>

      <div className="admin-filter-bar" style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button 
          className={filterRole === null ? 'admin-btn-primary' : 'admin-btn-secondary'} 
          onClick={() => setFilterRole(null)}
          style={{ padding: '8px 16px', borderRadius: '12px' }}
        >
          {language === 'bn' ? 'সব' : 'All Roles'}
        </button>
        {uniqueRoles.map((role: any) => (
          <button 
            key={role.en}
            className={filterRole === role.en ? 'admin-btn-primary' : 'admin-btn-secondary'}
            onClick={() => setFilterRole(role.en)}
            style={{ padding: '8px 16px', borderRadius: '12px' }}
          >
            {language === 'bn' ? role.bn : role.en}
          </button>
        ))}
      </div>

      <div className="admin-card admin-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>{language === 'bn' ? 'ব্যবহারকারী' : 'User'}</th>
              <th>{language === 'bn' ? 'ভূমিকা' : 'Role'}</th>
              <th>{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
              <th>{language === 'bn' ? 'শেষ লগইন' : 'Last Login'}</th>
              <th>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user: any) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">{user.initial}</div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{language === 'bn' ? user.roleBn : user.roleEn}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {language === 'bn' 
                      ? (user.status === 'active' ? 'সক্রিয়' : user.status === 'inactive' ? 'নিষ্ক্রিয়' : user.status === 'removed' ? 'অপসারিত' : user.status === 'suspended' ? 'স্থগিত' : 'নিষ্ক্রিয়') 
                      : user.status.toUpperCase()}
                  </span>
                </td>
                <td>{language === 'bn' ? user.lastLoginBn : user.lastLoginEn}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn-text" onClick={() => handleEdit(user)}>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</button>
                    <button 
                      className="admin-btn-text" 
                      style={{ color: '#ef4444' }} 
                      onClick={() => handleArchiveClick(user)}
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

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} onKeyDown={handleModalKeyDown}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ marginBottom: '4px' }}>
                  {selectedUser 
                    ? (language === 'bn' ? 'ব্যবহারকারী সম্পাদনা করুন' : 'Edit User')
                    : (language === 'bn' ? 'নতুন ব্যবহারকারী যোগ করুন' : 'Add New User')}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                  {language === 'bn' 
                    ? 'প্রোফাইল তথ্য আপডেট করুন' 
                    : 'Fill in the profile information below'}
                </p>
              </div>
              <button className="admin-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="settings-form">
                <div className="modal-input-group">
                  <label>{language === 'bn' ? 'নাম' : 'Full Name'}</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter name'}
                  />
                </div>
                <div className="modal-input-group">
                  <label>{language === 'bn' ? 'ভূমিকা' : 'Role'}</label>
                  <select 
                    className="admin-input" 
                    value={modalRole} 
                    onChange={e => {
                      const newRole = e.target.value;
                      setModalRole(newRole);
                      
                      if (newRole) {
                        setModalUserId(generateUserId(newRole));
                        setModalPassword(generateRandomPassword());
                      } else {
                        setModalUserId("");
                        setModalPassword("");
                      }
                    }}
                  >
                    <option value="">{language === 'bn' ? 'ভূমিকা নির্বাচন করুন' : 'Select Role'}</option>
                    {uniqueRoles.map((r: any) => (
                      <option key={r.en} value={r.en}>{language === 'bn' ? r.bn : r.en}</option>
                    ))}
                  </select>
                </div>
                {modalRole && (
                  <div className="modal-input-group" style={{ marginTop: '24px' }}>
                    <label>{language === 'bn' ? 'ওয়ার্কস্পেস' : 'Workspace'}</label>
                    <select 
                      className={`admin-input ${workspaceError ? 'error' : ''}`} 
                      value={modalWorkspace} 
                      onChange={e => {
                        setModalWorkspace(e.target.value);
                        if (e.target.value) setWorkspaceError(false);
                      }}
                      style={workspaceError ? { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' } : {}}
                    >
                      <option value="">{language === 'bn' ? `ওয়ার্কস্পেস নির্বাচন করুন (${workspaces.length})` : `Select Workspace (${workspaces.length})`}</option>
                      {workspaces.filter((w: any) => w.status !== 'archived').map((w: any) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                    {workspaceError && (
                      <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '8px', fontWeight: 600 }}>
                        {language === 'bn' ? 'দয়া করে একটি ওয়ার্কস্পেস নির্বাচন করুন' : 'Please select a workspace'}
                      </div>
                    )}
                  </div>
                )}
                {modalWorkspace && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                    <div className="modal-input-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ marginBottom: 0 }}>{language === 'bn' ? 'ব্যবহারকারী আইডি' : 'User ID'}</label>
                        <button 
                          type="button"
                          onClick={() => setIsIdEditable(!isIdEditable)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: isIdEditable ? 'var(--ws-lime)' : 'var(--text-sub)', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            padding: '4px'
                          }}
                        >
                          {isIdEditable ? <Unlock size={14} /> : <Lock size={14} />}
                          {isIdEditable 
                            ? (language === 'bn' ? 'লক করুন' : 'Lock') 
                            : (language === 'bn' ? 'আনলক করুন' : 'Unlock')}
                        </button>
                      </div>
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={modalUserId} 
                        onChange={(e) => setModalUserId(e.target.value)}
                        readOnly={!isIdEditable}
                        placeholder="e.g. adm123"
                        style={{ 
                          fontFamily: 'monospace', 
                          letterSpacing: '1px', 
                          opacity: isIdEditable ? 1 : 0.6, 
                          cursor: isIdEditable ? 'text' : 'not-allowed' 
                        }}
                      />
                    </div>
                    <div className="modal-input-group" style={{ marginBottom: 0 }}>
                      <label>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</label>
                      <input 
                        type="password" 
                        className="admin-input" 
                        value={modalPassword} 
                        onChange={e => setModalPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="admin-actions-group" style={{ marginTop: '32px' }}>
                  <h4 style={{ marginBottom: '16px', color: 'var(--text-main)', fontSize: '0.95rem' }}>{adminT.quickActions || "Quick Actions"}</h4>
                  <div className="admin-action-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      className="admin-btn-action danger" 
                      onClick={() => handleArchiveClick(selectedUser)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      <Trash2 size={16} />
                      {adminT.removeUser || "Remove User"}
                    </button>
                    <button className="admin-btn-action warning" onClick={() => updateStatus('suspended')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      <ShieldAlert size={16} />
                      {adminT.suspendUser || "Suspend"}
                    </button>
                    <button className="admin-btn-action subtle" onClick={() => updateStatus('disabled')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-sub)', cursor: 'pointer', fontWeight: 600 }}>
                      <Power size={16} />
                      {adminT.disableUser || "Disable"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={closeModal}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button className="admin-btn-primary" onClick={handleSave} style={{ marginTop: 0 }}>
                {selectedUser 
                  ? (language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes')
                  : (language === 'bn' ? 'ব্যবহারকারী যুক্ত করুন' : 'Add User')}
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isArchiveModalOpen && userToArchive && (
          <div className="admin-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="admin-modal-card" 
              style={{ maxWidth: '400px', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmArchive(); }}
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
                
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>
                  {language === 'bn' ? 'ফ্রিজে পাঠান?' : 'Move to Fridge?'}
                </h3>
                <p style={{ color: 'var(--text-sub)', marginBottom: '32px', lineHeight: 1.5 }}>
                  {language === 'bn' 
                    ? `আপনি কি নিশ্চিত যে আপনি ${userToArchive.name} কে ফ্রিজে পাঠাতে চান? আপনি একে পরে পুনরুদ্ধার করতে পারবেন।` 
                    : `Are you sure you want to move ${userToArchive.name} to the Fridge? You can restore it later.`}
                </p>
 
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="admin-btn-secondary" 
                    onClick={() => { setIsArchiveModalOpen(false); setUserToArchive(null); }}
                    style={{ flex: 1, marginTop: 0 }}
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button 
                    className="admin-btn-primary" 
                    onClick={confirmArchive}
                    style={{ flex: 1, background: '#ef4444', marginTop: 0 }}
                  >
                    {language === 'bn' ? 'ফ্রিজে পাঠান' : 'Move to Fridge'}
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

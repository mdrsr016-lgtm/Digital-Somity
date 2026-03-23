import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Plus, Building2, Trash2, AlertTriangle, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface MockWorkspace {
  id: string;
  name: string;
  typeen: string;
  typebn: string;
  createdEn: string;
  createdBn: string;
  members: number;
  status: 'active' | 'archived';
}

export const WorkspaceList = () => {
  const { t, language } = useLanguage();
  const adminT: any = t.admin || {};
  const { workspaces, updateWorkspaceStatus, showToast, saveWorkspace } = useOutletContext<any>();
  const [selectedWs, setSelectedWs] = useState<MockWorkspace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wsToDelete, setWsToDelete] = useState<MockWorkspace | null>(null);

  // States for modal inputs
  const [modalName, setModalName] = useState("");
  const [modalType, setModalType] = useState("Monthly");
  const [modalMembers, setModalMembers] = useState(0);
  const [nameError, setNameError] = useState(false);

  const activeWorkspaces = workspaces.filter((w: any) => w.status !== 'archived');

  const handleEdit = (ws: MockWorkspace | null) => {
    setNameError(false);
    if (ws) {
      setSelectedWs(ws);
      setModalName(ws.name);
      setModalType(ws.typeen);
      setModalMembers(ws.members);
    } else {
      setSelectedWs(null);
      setModalName("");
      setModalType("Monthly");
      setModalMembers(0);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWs(null);
    setNameError(false);
  };

  // Keyboard support for modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isModalOpen || isDeleteModalOpen)) {
        closeModal();
        setIsDeleteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isModalOpen, isDeleteModalOpen]);

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

  const handleDeleteClick = (ws: MockWorkspace) => {
    setWsToDelete(ws);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (wsToDelete) {
      updateWorkspaceStatus(wsToDelete.id, 'archived');
      showToast(language === 'bn' ? 'ওয়ার্কস্পেস ফ্রিজে পাঠানো হয়েছে!' : 'Workspace moved to Fridge!');
      setIsDeleteModalOpen(false);
      setWsToDelete(null);
    }
  };

  const handleSave = async () => {
    if (!modalName.trim()) {
      setNameError(true);
      showToast(language === 'bn' ? 'দয়া করে নাম দিন' : 'Please enter a name');
      return;
    }

    const typeBn = modalType === 'Monthly' ? 'মাসিক' : modalType === 'Yearly' ? 'বার্ষিক' : 'আজীবনের';
    
    const wsData = {
      id: selectedWs?.id,
      name: modalName,
      typeen: modalType,
      typebn: typeBn,
      members: modalMembers,
      status: selectedWs?.status || 'active'
    };

    const success = await saveWorkspace(wsData, !selectedWs);

    if (success) {
      showToast(language === 'bn' ? 'সফলভাবে সংরক্ষিত হয়েছে!' : 'Saved Successfully!');
      closeModal();
    } else {
      showToast(language === 'bn' ? 'ত্রুটি ঘটেছে!' : 'An error occurred!');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>{adminT.workspaceManagement || "Workspace Management"}</h2>
          <p>{adminT.workspaceMsg || "Organize your business into branches, departments, or regional offices."}</p>
        </div>
        <button className="admin-btn-primary" onClick={() => handleEdit(null)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {adminT.addWorkspace || "Add Workspace"}
        </button>
      </div>

      <div className="admin-card admin-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>{language === 'bn' ? 'ওয়ার্কস্পেস' : 'Workspace'}</th>
              <th>{language === 'bn' ? 'সাবস্ক্রিপশন' : 'Subscription'}</th>
              <th>{language === 'bn' ? 'তৈরি করা হয়েছে' : 'Created'}</th>
              <th>{language === 'bn' ? 'সদস্য সংখ্যা (ক্যাশিয়ার বাদে)' : 'Members (without cashier)'}</th>
              <th>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {activeWorkspaces.map((ws: any) => (
              <tr key={ws.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small" style={{ background: 'rgba(163, 230, 53, 0.1)', color: '#a3e635' }}>
                      <Building2 size={16} />
                    </div>
                    <span>{ws.name}</span>
                  </div>
                </td>
                <td>
                  <span className="status-badge" style={{ background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                    {language === 'bn' ? ws.typebn : ws.typeen}
                  </span>
                </td>
                <td>{language === 'bn' ? ws.createdBn : ws.createdEn}</td>
                <td>{ws.members}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="admin-btn-text"
                      onClick={() => handleEdit(ws)}
                    >
                      {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
                    </button>
                    <button 
                      className="admin-btn-text" 
                      style={{ color: '#ef4444' }}
                      onClick={() => handleDeleteClick(ws)}
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
          <div className="admin-modal-card" onClick={e => e.stopPropagation()} onKeyDown={handleModalKeyDown}>
            <div className="admin-modal-header">
              <h3>{selectedWs ? (language === 'bn' ? 'সম্পাদনা করুন' : 'Edit Workspace') : (language === 'bn' ? 'নতুন ওয়ার্কস্পেস' : 'New Workspace')}</h3>
              <button className="admin-modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="admin-modal-body">
              <div className="settings-form">
                <div className="modal-input-group">
                  <label>{language === 'bn' ? 'নাম' : 'Workspace Name'}</label>
                  <input 
                    type="text" 
                    className={`admin-input ${nameError ? 'error' : ''}`} 
                    value={modalName}
                    onChange={(e) => {
                      setModalName(e.target.value);
                      if (e.target.value.trim()) setNameError(false);
                    }}
                    placeholder={language === 'bn' ? 'ওয়ার্কস্পেসের নাম দিন' : 'Enter workspace name'}
                    style={nameError ? { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' } : {}}
                  />
                  {nameError && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                      {language === 'bn' ? 'নাম আবশ্যক' : 'Name is required'}
                    </div>
                  )}
                </div>
                <div className="modal-input-group">
                  <label>{language === 'bn' ? 'সাবস্ক্রিপশন ধরন' : 'Subscription Type'}</label>
                  <select 
                    className="admin-input" 
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value)}
                  >
                    <option value="Monthly">{language === 'bn' ? 'মাসিক' : 'Monthly'}</option>
                    <option value="Yearly">{language === 'bn' ? 'বার্ষিক' : 'Yearly'}</option>
                    <option value="Lifetime">{language === 'bn' ? 'আজীবনের' : 'Lifetime'}</option>
                  </select>
                </div>
                <div className="modal-input-group">
                  <label>{language === 'bn' ? 'সদস্য সংখ্যা (ক্যাশিয়ার বাদে)' : 'Members Amount (without cashier)'}</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={modalMembers}
                    onChange={(e) => setModalMembers(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={closeModal}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                className="admin-btn-primary" 
                style={{ marginTop: 0 }} 
                onClick={handleSave}
              >
                {selectedWs 
                  ? (language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes')
                  : (language === 'bn' ? 'ওয়ার্কস্পেস যুক্ত করুন' : 'Add Workspace')}
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isDeleteModalOpen && wsToDelete && (
          <div className="admin-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="admin-modal-card" 
              style={{ maxWidth: '400px', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
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
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>
                  {language === 'bn' ? 'ফ্রিজে পাঠান?' : 'Move to Fridge?'}
                </h3>
                <p style={{ color: 'var(--text-sub)', marginBottom: '32px', lineHeight: 1.5 }}>
                  {language === 'bn' 
                    ? `আপনি কি নিশ্চিত যে আপনি ${wsToDelete.name} কে ফ্রিজে পাঠাতে চান? এটি পরে পুনরুদ্ধার করা যাবে।` 
                    : `Are you sure you want to move ${wsToDelete.name} to the Fridge? You can restore it later.`}
                </p>
              
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="admin-btn-secondary" onClick={() => setIsDeleteModalOpen(false)} style={{ flex: 1, marginTop: 0 }}>
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

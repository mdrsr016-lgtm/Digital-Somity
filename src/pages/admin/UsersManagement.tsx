import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { mockUsers, MockUser } from "../../data/mockUsers";
import { X, Trash2, UserMinus, EyeOff, UserPlus, CheckCircle } from "lucide-react";

export const UsersManagement = () => {
  const { t, language } = useLanguage();
  const adminT = t.admin || {} as any;
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleEdit = (user: MockUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setActionFeedback(null);
  };

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(null);
      closeModal();
    }, 1500);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{adminT.usersManagement || "Users Management"}</h2>
        <p>{adminT.manageUsersMsg || "Manage application users, roles, and permissions."}</p>
        <button className="admin-btn-primary" onClick={handleAdd}>
          <UserPlus size={18} style={{ marginRight: '8px' }} />
          {adminT.addNewUser || "Add New User"}
        </button>
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
            {mockUsers.map((user) => (
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
                      ? (user.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়') 
                      : (user.status === 'active' ? 'Active' : 'Inactive')}
                  </span>
                </td>
                <td>{language === 'bn' ? user.lastLoginBn : user.lastLoginEn}</td>
                <td>
                  <button 
                    className="admin-btn-text"
                    onClick={() => handleEdit(user)}
                  >
                    {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal}>
              <X size={20} />
            </button>
            <div className="admin-modal-header">
              <h3>
                {selectedUser 
                  ? (language === 'bn' ? 'ব্যবহারকারী সম্পাদনা করুন' : 'Edit User')
                  : (language === 'bn' ? 'নতুন ব্যবহারকারী যোগ করুন' : 'Add New User')}
              </h3>
              <p>
                {language === 'bn' 
                  ? 'প্রোফাইল তথ্য আপডেট করুন' 
                  : 'Fill in the profile information below'}
              </p>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label>{language === 'bn' ? 'নাম' : 'Full Name'}</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  defaultValue={selectedUser?.name || ""}
                  placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter name'}
                />
              </div>
              <div className="form-group">
                <label>{language === 'bn' ? 'ভূমিকা' : 'Role'}</label>
                <select className="admin-input" defaultValue={selectedUser ? (language === 'bn' ? selectedUser.roleBn : selectedUser.roleEn) : ""}>
                  <option value="">{language === 'bn' ? 'ভূমিকা নির্বাচন করুন' : 'Select Role'}</option>
                  <option>{language === 'bn' ? 'সিস্টেম অ্যাডমিনিস্ট্রেটর' : 'System Administrator'}</option>
                  <option>{language === 'bn' ? 'বিনিয়োগ ব্যবস্থাপক' : 'Investment Manager'}</option>
                  <option>{language === 'bn' ? 'সমিতির সদস্য' : 'Society Member'}</option>
                  <option>{language === 'bn' ? 'ক্যাশিয়ার' : 'Cashier'}</option>
                </select>
              </div>
            </div>

            {selectedUser && (
              <div className="admin-actions-group">
                <h4>{adminT.quickActions || "Quick Actions"}</h4>
                <div className="admin-action-buttons">
                  <button className="admin-btn-action danger" onClick={() => triggerFeedback(language === 'bn' ? 'মুছে ফেলা হয়েছে!' : 'User Removed!')}>
                    <Trash2 size={16} />
                    {adminT.removeUser || "Remove User"}
                  </button>
                  <button className="admin-btn-action warning" onClick={() => triggerFeedback(language === 'bn' ? 'নিষ্ক্রিয় করা হয়েছে!' : 'Account Disabled!')}>
                    <UserMinus size={16} />
                    {adminT.disableAccount || "Disable Account"}
                  </button>
                  <button className="admin-btn-action info" onClick={() => triggerFeedback(language === 'bn' ? 'লুকানো হয়েছে!' : 'Account Hidden!')}>
                    <EyeOff size={16} />
                    {adminT.hideAccount || "Hide Account"}
                  </button>
                </div>
              </div>
            )}

            <div className="admin-modal-footer">
              {actionFeedback ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600 }}>
                  <CheckCircle size={20} />
                  {actionFeedback}
                </div>
              ) : (
                <>
                  <button className="admin-btn-secondary" onClick={closeModal}>
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button 
                    className="admin-btn-primary" 
                    style={{ marginTop: 0 }} 
                    onClick={() => triggerFeedback(language === 'bn' ? 'সংরক্ষণ করা হয়েছে!' : 'Success!')}
                  >
                    {selectedUser 
                      ? (language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes')
                      : (language === 'bn' ? 'ব্যবহারকারী যুক্ত করুন' : 'Add User')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

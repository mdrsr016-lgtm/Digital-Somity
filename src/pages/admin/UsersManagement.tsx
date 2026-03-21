import { useLanguage } from "../../contexts/LanguageContext";

export const UsersManagement = () => {
  const { t } = useLanguage();
  const adminT = t.admin || {} as any;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{adminT.usersManagement || "Users Management"}</h2>
        <p>{adminT.manageUsersMsg || "Manage application users, roles, and permissions."}</p>
        <button className="admin-btn-primary">{adminT.addNewUser || "Add New User"}</button>
      </div>

      <div className="admin-card admin-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>{t.lang === 'bn' ? 'ব্যবহারকারী' : 'User'}</th>
              <th>{t.lang === 'bn' ? 'ভূমিকা' : 'Role'}</th>
              <th>{t.lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
              <th>{t.lang === 'bn' ? 'শেষ লগইন' : 'Last Login'}</th>
              <th>{t.lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">R</div>
                  <span>Rafiqul Islam</span>
                </div>
              </td>
              <td>{t.help?.adminsRole || "System Administrator"}</td>
              <td><span className="status-badge active">{t.lang === 'bn' ? 'সক্রিয়' : 'Active'}</span></td>
              <td>{t.lang === 'bn' ? 'আজ, সকাল ১০:৩০' : 'Today, 10:30 AM'}</td>
              <td>
                <button className="admin-btn-text">{t.lang === 'bn' ? 'সম্পাদনা' : 'Edit'}</button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">N</div>
                  <span>Nusrat Jahan</span>
                </div>
              </td>
              <td>{t.help?.investorsRole || "Investment Manager"}</td>
              <td><span className="status-badge active">{t.lang === 'bn' ? 'সক্রিয়' : 'Active'}</span></td>
              <td>{t.lang === 'bn' ? 'গতকাল, বিকাল ৪:১৫' : 'Yesterday, 4:15 PM'}</td>
              <td>
                <button className="admin-btn-text">{t.lang === 'bn' ? 'সম্পাদনা' : 'Edit'}</button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">A</div>
                  <span>Abdul Karim</span>
                </div>
              </td>
              <td>{t.help?.membersRole || "Society Member"}</td>
              <td><span className="status-badge inactive">{t.lang === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}</span></td>
              <td>{t.lang === 'bn' ? '১২ অক্টো, ২০২৩' : 'Oct 12, 2023'}</td>
              <td>
                <button className="admin-btn-text">{t.lang === 'bn' ? 'সম্পাদনা' : 'Edit'}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

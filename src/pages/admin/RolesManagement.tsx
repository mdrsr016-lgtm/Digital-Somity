import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Shield, Users, Check, Edit, CheckCircle, Plus } from "lucide-react";

export const RolesManagement = () => {
  const { t, language } = useLanguage();
  const adminT = t.admin || {} as any;
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const roles = [
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

  const handleAction = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{adminT.rolesManagement || "Roles Management"}</h2>
        <p>{adminT.rolesMsg || "Configure system-wide user roles and their associated permission levels."}</p>
        <button 
          className="admin-btn-primary" 
          onClick={() => handleAction(language === 'bn' ? 'সফল হয়েছে!' : 'Success!')}
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
              {adminT.manageRoles || "Manage Roles"}
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
                    <div className="user-avatar-small" style={{ background: 'rgba(125, 57, 235, 0.1)', color: 'var(--color-violet)' }}>
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
                  <button 
                    className="admin-btn-text"
                    onClick={() => handleAction(language === 'bn' ? 'অনুমতি আপডেট করা হয়েছে!' : 'Permissions Updated!')}
                  >
                    <Edit size={16} />
                    <span style={{ marginLeft: '6px' }}>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

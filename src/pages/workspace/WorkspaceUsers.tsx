import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Search, User, Mail, Phone, Shield, Filter, MoreVertical } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useMemo } from "react";

export const WorkspaceUsers = () => {
  const { activeUser, users } = useOutletContext<any>();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users by workspace and search term
  const workspaceMembers = useMemo(() => {
    return (users || []).filter((u: any) => {
      const isInWorkspace = u.workspaceId === activeUser?.workspaceId;
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           u.id.toLowerCase().includes(searchTerm.toLowerCase());
      return isInWorkspace && matchesSearch && u.status !== 'removed';
    });
  }, [users, activeUser?.workspaceId, searchTerm]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="ws-overview">
      <div className="ws-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <div>
            <h1>{language === 'bn' ? 'সদস্য ডেটাবেস' : 'Member Database'}</h1>
            <p>{language === 'bn' ? 'আপনার বর্তমান ওয়ার্কস্পেসের সকল সদস্যদের তালিকা।' : 'Full list of members registered in your current workspace.'}</p>
          </div>
          <div className="ws-badge" style={{ marginBottom: '10px' }}>
            {workspaceMembers.length} {language === 'bn' ? 'সদস্য পাওয়া গেছে' : 'Members Found'}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="ws-stat-card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-muted)' }} />
            <input 
              type="text" 
              placeholder={language === 'bn' ? 'সদস্যের নাম বা আইডি দিয়ে খুঁজুন...' : 'Search by name or member ID...'}
              className="admin-input-dark"
              style={{ paddingLeft: '40px', width: '100%', background: 'rgba(255,255,255,0.03)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="ws-badge" style={{ height: '44px', padding: '0 16px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'cursor' }}>
            <Filter size={16} />
            <span>{language === 'bn' ? 'ফিল্টার' : 'Filter'}</span>
          </button>
        </div>
      </div>

      {/* Members Grid/List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
      >
        {workspaceMembers.map((member: any) => (
          <motion.div 
            key={member.id} 
            variants={item}
            className="ws-stat-card"
            style={{ padding: '1.5rem', position: 'relative' }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="ws-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem', flexShrink: 0 }}>
                {member.initial}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{member.name}</h3>
                  <button style={{ background: 'none', border: 'none', color: 'var(--ws-text-muted)', cursor: 'pointer' }}>
                    <MoreVertical size={18} />
                  </button>
                </div>
                <p style={{ margin: '0 0 12px 0', color: 'var(--ws-violet)', fontWeight: '600', fontSize: '0.85rem' }}>
                  {language === 'bn' ? member.roleBn : member.roleEn}
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>
                    <Shield size={14} />
                    <span>ID: {member.id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>
                    <Mail size={14} />
                    <span>{member.email || (member.name.toLowerCase().replace(/\s+/g, '.') + "@somiti.com")}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>
                    <Phone size={14} />
                    <span>{member.phone || "+880 1XXX-XXXXXX"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className={`ws-stat-trend ${member.status?.toLowerCase() === 'active' ? 'up' : 'neutral'}`} style={{ margin: 0 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: member.status?.toLowerCase() === 'active' ? 'var(--ws-lime)' : '#666', marginRight: '6px' }}></span>
                {member.status ? (member.status.charAt(0).toUpperCase() + member.status.slice(1)) : 'Unknown'}
              </div>
              <button className="admin-btn-text" style={{ fontSize: '0.8rem', color: 'var(--ws-lime)' }}>
                {language === 'bn' ? 'বিস্তারিত' : 'View Details'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {workspaceMembers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ws-text-muted)' }}>
          <User size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>{language === 'bn' ? 'কোন সদস্য খুঁজে পাওয়া যায়নি।' : 'No members found matching your search.'}</p>
        </div>
      )}
    </div>
  );
};

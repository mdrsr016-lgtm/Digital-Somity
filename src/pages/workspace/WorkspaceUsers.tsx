import { useState, useEffect } from "react";
import { useOutletContext, NavLink } from "react-router-dom";
import { Search, Filter, ArrowUpDown, SortAsc, SortDesc, UserPlus, Phone, Calendar } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const WorkspaceUsers = () => {
  const { activeUser, isExiting } = useOutletContext<any>();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'name-asc' | 'name-desc' | 'newest' | 'oldest'>('name-asc');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const workspaceId = activeUser?.workspaceId;

  // ... (rest of the component logic)

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceMembers();

      // Real-time: Subscribe to member changes for this workspace
      const membersSubscription = supabase
        .channel(`members-realtime-${workspaceId}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public',
            table: 'users'
          }, 
          (payload) => {
            console.log('Real-time Members RECEIVED:', payload);
            fetchWorkspaceMembers();
          }
        )
        .subscribe((status, err) => {
          console.log('Members subscription status:', status);
          if (err) console.error('Members subscription error:', err);
        });

      return () => {
        supabase.removeChannel(membersSubscription);
      };
    }
  }, [workspaceId]);

  const fetchWorkspaceMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('workspace_id', workspaceId);
      
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const filteredUsers = users
    .filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sortOption === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (sortOption === 'newest') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      if (sortOption === 'oldest') return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      return 0;
    });

  const ROLE_MAP: Record<string, string> = {
    'a1a1aa00-0000-0000-0000-000000000000': 'Member',
    'f59e0b00-0000-0000-0000-000000000000': 'Cashier',
    'd946ef00-0000-0000-0000-000000000000': 'Investor',
    '8b5cf600-0000-0000-0000-000000000000': 'System Admin',
  };

  return (
    <div className={`ws-page-width ws-users-page ${isExiting ? 'is-exiting' : ''}`}>

      <div className="ws-controls-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
        <div className="ws-member-badge-wrapper">
          {!loading && (
            <div 
              className="ws-status-badge active" 
              style={{ 
                fontSize: 'var(--fs-small)', 
                padding: '6px 14px', 
                borderRadius: '20px',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--ws-violet)'
              }}
            >
              <span style={{ fontWeight: 800 }}>{users.length}</span>
              <span style={{ opacity: 0.7 }}>Members</span>
            </div>
          )}
        </div>

        <NavLink
          to="/workspace/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid var(--ws-border)',
            color: 'var(--ws-text-muted)',
            fontSize: 'var(--fs-small)',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          <UserPlus size={13} />
          <span>Add User</span>
        </NavLink>

        <div className="ws-sort-container" style={{ position: 'relative' }}>
          <button 
            className={`ws-filter-btn ${isSortMenuOpen ? 'active' : ''}`}
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid var(--ws-border)',
              background: 'none',
              color: 'var(--ws-text-muted)',
              fontSize: 'var(--fs-small)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Sort Members"
          >
            <Filter size={13} strokeWidth={2.5} />
            <span>Filter</span>
          </button>

          {isSortMenuOpen && (
            <>
              <div 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                onClick={() => setIsSortMenuOpen(false)} 
              />
              <div className="ws-sort-dropdown">
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Sort By
                </div>
                {[
                  { id: 'name-asc', label: 'Name (A to Z)', icon: <SortAsc size={16} /> },
                  { id: 'name-desc', label: 'Name (Z to A)', icon: <SortDesc size={16} /> },
                  { id: 'newest', label: 'Newest Joined', icon: <ArrowUpDown size={16} /> },
                  { id: 'oldest', label: 'Oldest Joined', icon: <ArrowUpDown size={16} /> },
                ].map((option) => (
                  <button
                    key={option.id}
                    className="ws-sort-option"
                    onClick={() => {
                      setSortOption(option.id as any);
                      setIsSortMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: sortOption === option.id ? 'var(--ws-input-bg)' : 'none',
                      border: 'none',
                      borderRadius: '10px',
                      color: sortOption === option.id ? 'var(--ws-violet)' : 'var(--ws-text)',
                      fontSize: 'var(--fs-small)',
                      fontWeight: sortOption === option.id ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="ws-search-bar-row" style={{ marginBottom: '2.5rem', width: '100%' }}>
        <div className="ws-search-bar">
          <input 
            type="text" 
            placeholder="Find members by name, phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="ws-search-icon" />
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--ws-text-muted)', paddingTop: '4rem', textAlign: 'center' }}>
          <div className="ws-spinner-small" style={{ margin: '0 auto 1rem' }}></div>
          Loading workspace members...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ color: 'var(--ws-text-muted)', paddingTop: '4rem', textAlign: 'center' }}>
          No members found in this workspace.
        </div>
      ) : (
        <div className="ws-member-cards-grid">
          {filteredUsers.map((user) => {
            const displayRole = user.role_id ? ROLE_MAP[user.role_id] || 'Member' : (user.role || 'Member');
            
            return (
              <div key={user.id} className="ws-member-card-v2">
                {/* Top Section */}
                <div className="ws-member-top">
                  <div className="ws-member-avatar-v2">
                    {user.initial || user.name?.charAt(0) || '?'}
                  </div>
                  
                  <div className="ws-member-info-col">
                    <div className="ws-member-name-row">
                      <div className="ws-member-name-v2">{user.name}</div>
                      <div className="ws-status-indicator" title="Online" />
                    </div>
                    <div className="ws-member-role-row">
                      <div className="ws-member-role-v2">{displayRole}</div>
                      <div className="ws-member-handle-v2">@{user.login_id || user.id?.slice(0, 8)}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="ws-member-bottom">
                  <div className="ws-member-details-col">
                    <div className="ws-detail-line">
                      <span className="ws-detail-icon"><Phone size={14} /></span>
                      <span>{user.phone || 'No phone'}</span>
                    </div>
                    <div className="ws-detail-line">
                      <span className="ws-detail-icon"><Calendar size={14} /></span>
                      <span>Join Date</span>
                    </div>
                  </div>

                  <div className="ws-member-actions-col">
                    <button className="ws-action-btn-main">Edit Member</button>
                    <button className="ws-action-btn-sub">Call</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Mail, Phone, ShieldAlert, BadgeCheck } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const WorkspaceUsers = () => {
  const { activeUser } = useOutletContext<any>();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeUser?.workspaceId) {
      fetchWorkspaceMembers();
    }
  }, [activeUser]);

  const fetchWorkspaceMembers = async () => {
    setLoading(true);
    // Assuming 'workspaceId' column exists based on the standard generic naming
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('workspaceId', activeUser.workspaceId);
      
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ws-page-width">
      <div className="ws-header" style={{ marginBottom: '1rem', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'left', alignItems: 'flex-start' }}>
          <h1>Members Database</h1>
          <p>Manage and view all members in your workspace.</p>
        </div>
      </div>

      <div className="ws-search-container">
        <div className="ws-search-bar">
          <Search size={20} className="ws-search-icon" />
          <input 
            type="text" 
            placeholder="Search members by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ws-member-count">
          {loading ? 'Loading...' : `${filteredUsers.length} members`}
        </div>
      </div>

      <div className="ws-members-grid">
        {loading ? (
          <div style={{ color: 'var(--ws-text-muted)', paddingTop: '2rem' }}>Loading workspace members...</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ color: 'var(--ws-text-muted)', paddingTop: '2rem' }}>No members found.</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="ws-member-card">
              <div className="ws-member-header">
                <div className="ws-member-avatar">
                  {user.initial || user.name?.charAt(0) || '?'}
                </div>
                <div className="ws-member-info">
                  <h3>{user.name}</h3>
                  <span className={`ws-role-badge ${user.role === 'admin' ? 'admin' : ''}`}>
                    {user.role === 'admin' ? <ShieldAlert size={14} /> : <BadgeCheck size={14} />}
                    {user.role || 'Member'}
                  </span>
                </div>
              </div>
              <div className="ws-member-body">
                {user.email && (
                  <div className="ws-member-contact">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="ws-member-contact">
                    <Phone size={16} />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

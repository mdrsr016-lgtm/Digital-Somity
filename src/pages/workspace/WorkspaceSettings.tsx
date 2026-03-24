import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { UserPlus, Phone, Shield, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff, Info, Lock, ChevronDown, Copy, Download, Share2 } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const WorkspaceSettings = () => {
  const { activeUser, workspaces } = useOutletContext<any>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeWorkspaceName = workspaces?.find((w: any) => w.id === activeUser?.workspaceId)?.name || 'General Workspace';

  const [formData, setFormData] = useState({
    login_id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Member",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const roleInfo: Record<string, string> = {
    'Member': 'Standard user with access to workspace tools and their own records.',
    'Cashier': 'Handles daily financial tasks, transactions, and basic reporting.',
    'Investor': 'Stakeholder with view-only access to high-level financial metrics.',
    'System Admin / Owner': 'Full control over workspace, including user roles and permissions.',
  };

  const allRoles = [
    { id: 'a1a1aa00-0000-0000-0000-000000000000', name: 'Member', prefix: 'mem' },
    { id: 'f59e0b00-0000-0000-0000-000000000000', name: 'Cashier', prefix: 'csh' },
    { id: 'd946ef00-0000-0000-0000-000000000000', name: 'Investor', prefix: 'inv' },
    { id: '8b5cf600-0000-0000-0000-000000000000', name: 'System Admin / Owner', prefix: 'adm' },
  ];

  // Restrict the dropdown based on user permission
  const isOwner = activeUser?.role === 'System Admin / Owner' || activeUser?.role_id === '8b5cf600-0000-0000-0000-000000000000';
  const roles = isOwner ? allRoles : allRoles.filter(r => r.name === 'Member' || r.name === 'Investor');

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  // Auto-generate User ID and Password based on Role
  useEffect(() => {
    const generateCreds = async () => {
      const selectedRole = allRoles.find(r => r.name === formData.role);
      if (!selectedRole) return;

      try {
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role_id', selectedRole.id);

        if (countError) throw countError;

        const nextNum = (count || 0) + 1;
        const formattedId = `${selectedRole.prefix}${nextNum.toString().padStart(3, '0')}`;
        
        setFormData(prev => ({ 
          ...prev, 
          login_id: formattedId,
          password: prev.password || generateRandomPassword() // Only gen if empty
        }));
      } catch (err) {
        console.error("Error generating credentials:", err);
      }
    };

    generateCreds();
  }, [formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedRole = roles.find(r => r.name === formData.role);

    try {
      // Validate all fields are filled
      if (!formData.name || !formData.phone || !formData.login_id || !formData.password) {
        throw new Error("Please fill in all required fields.");
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          login_id: formData.login_id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password_hash: formData.password,
          role_id: selectedRole?.id,
          workspace_id: activeUser?.workspaceId,
          initial: formData.name.charAt(0).toUpperCase(),
          status: 'active'
        }]);

      if (insertError) throw insertError;

      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err: any) {
      console.error("Error adding member:", err);
      setError(err.message || "Failed to add member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    const toast = document.getElementById(id);
    if (toast) {
      toast.style.opacity = '1';
      setTimeout(() => toast.style.opacity = '0', 2000);
    }
  };

  const downloadCredentials = () => {
    const content = `Workspace: ${activeWorkspaceName}\nMember: ${formData.name}\nID: ${formData.login_id}\nTemporary Password: ${formData.password}\n\nPlease change your password after your first login.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name.replace(/\s+/g, '_')}_credentials.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCredentials = async () => {
    const text = `Member ID: ${formData.login_id}\nPassword: ${formData.password}\nWorkspace: ${activeWorkspaceName}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Member Credentials',
          text: text,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyToClipboard(text, 'share-toast');
    }
  };

  if (success) {
    return (
      <div className="ws-page-width ws-users-page ws-animate-slide-down" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', padding: '1rem' }}>
        <div className="ws-form-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '4rem 2.5rem', position: 'relative' }}>
          
          <div className="ws-brand-tag" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="ws-workspace-badge">
              <span className="ws-workspace-name" style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                <span className="ws-name-first" style={{ color: '#10b981' }}>{activeWorkspaceName.split(' ')[0]}</span>
                {activeWorkspaceName.includes(' ') && ( activeWorkspaceName.split(' ').slice(1).join(' ') !== '' && (
                  <span className="ws-name-rest" style={{ color: '#fff' }}>{' ' + activeWorkspaceName.split(' ').slice(1).join(' ')}</span>
                ))}
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: '#fff', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            User Created!
            <CheckCircle2 size={22} color="var(--ws-violet)" strokeWidth={2.5} />
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '2rem', fontWeight: 500 }}>
            <strong style={{ color: 'var(--ws-violet)' }}>{formData.name}</strong> is now a member of <strong style={{ color: '#fff' }}>{activeWorkspaceName}</strong>.
          </p>

          <div className="ws-credentials-box" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--ws-border)', borderRadius: '28px', padding: '1.75rem', marginBottom: '1.5rem', textAlign: 'left', position: 'relative' }}>
            <div className="ws-cred-item" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ws-violet)', letterSpacing: '0.1em', opacity: 0.8 }}>Member ID</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#0a0a0a', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input readOnly value={formData.login_id} style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', fontWeight: 800, padding: 0, fontFamily: 'monospace' }} />
              </div>
            </div>

            <div className="ws-cred-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ws-violet)', letterSpacing: '0.1em', opacity: 0.8 }}>Temporary Password</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#0a0a0a', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input readOnly value={formData.password} style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', fontWeight: 800, padding: 0, fontFamily: 'monospace' }} />
              </div>
            </div>
          </div>
        </div>

        {/* New Action Bar Card from Diagram */}
        <div className="ws-action-bar-card ws-animate-slide-up" style={{ 
          marginTop: '1.5rem', 
          width: '100%', 
          maxWidth: '480px', 
          background: 'rgba(20, 20, 25, 0.4)', 
          backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          borderRadius: '24px', 
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button 
            onClick={() => navigate('/workspace/members')}
            style={{ 
              flex: '1.5',
              height: '50px',
              background: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '16px',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back
          </button>

          <button 
            onClick={() => copyToClipboard(`ID: ${formData.login_id}\nPassword: ${formData.password}`, 'card-copy-toast')}
            style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ws-border)', borderRadius: '16px', color: 'var(--ws-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
          >
            <Copy size={20} />
            <span id="card-copy-toast" style={{ position: 'absolute', bottom: '110%', fontSize: '0.6rem', background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '4px', opacity: 0, transition: '0.3s', whiteSpace: 'nowrap' }}>Copied!</span>
          </button>

          <button 
            onClick={downloadCredentials}
            style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ws-border)', borderRadius: '16px', color: 'var(--ws-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Download size={20} />
          </button>

          <button 
            onClick={shareCredentials}
            style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ws-border)', borderRadius: '16px', color: 'var(--ws-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
          >
            <Share2 size={20} />
            <span id="share-toast" style={{ position: 'absolute', bottom: '110%', fontSize: '0.6rem', background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '4px', opacity: 0, transition: '0.3s', whiteSpace: 'nowrap' }}>Link Copied!</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ws-page-width ws-users-page ws-overview-page ws-animate-slide-down">
      {/* Header Section: Perfectly Symmetrical 3-Col Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(42px, 1fr) auto minmax(42px, 1fr)', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingTop: '0.5rem',
        width: '100%',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={() => navigate('/workspace/members')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: 'var(--ws-text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: '8px'
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--ws-violet)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(-2px)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--ws-text-muted)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(0)';
            }}
            title="Back to Database"
          >
            <ArrowLeft size={18} style={{ color: 'var(--ws-violet)' }} />
          </button>
        </div>

        <h1 style={{ 
          fontWeight: 900, 
          fontSize: 'var(--fs-h2)', 
          margin: 0, 
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}>
          Add New User
        </h1>

        <div aria-hidden="true" /> {/* Balancing Spacer */}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ 
          color: 'var(--ws-text-muted)', 
          fontSize: 'var(--fs-body)', 
          maxWidth: '540px', 
          margin: '0 auto',
          lineHeight: '1.6',
          opacity: 0.8
        }}>
          Completely fill out the details below to securely register a new member or investor into your workspace database.
        </p>
      </div>

      {/* Form — flat, no card */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Asymmetrical 2-col grid (3fr / 2fr) */}
        <div className="ws-form-row">

          {/* Full Name */}
          <div className="ws-input-group">
            <label style={{ 
              fontWeight: 700, 
              fontSize: '11px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              marginBottom: '10px', 
              display: 'block'
            }}>
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="ws-input-wrapper">
              <UserPlus size={17} style={{ color: 'var(--ws-violet)' }} />
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="ws-input-group">
            <label style={{ 
              fontWeight: 700, 
              fontSize: '11px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              marginBottom: '10px', 
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Role <span style={{ color: '#ef4444' }}>*</span>
              <div 
                style={{ display: 'flex', alignItems: 'center', cursor: 'help', position: 'relative' }}
                onMouseEnter={() => setShowRoleInfo(true)}
                onMouseLeave={() => setShowRoleInfo(false)}
                onClick={() => setShowRoleInfo(!showRoleInfo)}
              >
                <Info size={13} style={{ opacity: 0.6 }} />

                {/* Tooltip - Anchored to icon */}
                {showRoleInfo && (
                  <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 12px)',
                    right: '-10px',
                    width: '240px',
                    background: 'rgba(20, 20, 25, 0.98)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    borderRadius: '10px',
                    padding: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    zIndex: 100,
                    fontSize: '11px',
                    color: '#fff',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                    lineHeight: '1.5',
                    pointerEvents: 'none',
                    animation: 'ws-fade-in 0.2s ease-out'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--ws-violet)' }}>{formData.role} Info</strong>
                    {roleInfo[formData.role] || 'No description available for this role.'}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: '12px',
                      width: '0',
                      height: '0',
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid rgba(124, 58, 237, 0.2)'
                    }} />
                  </div>
                )}
              </div>
            </label>
            <div className="ws-input-wrapper">
              <Shield size={17} style={{ color: 'var(--ws-violet)' }} />
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                style={{ cursor: 'pointer', paddingRight: '32px', colorScheme: 'dark' }}
              >
                {roles.map(role => (
                  <option 
                    key={role.id} 
                    value={role.name}
                    style={{ background: '#0a0a0a', color: '#fff' }}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  right: '14px', 
                  color: 'var(--ws-text-muted)',
                  pointerEvents: 'none' 
                }} 
              />
            </div>
          </div>

          {/* Phone */}
          <div className="ws-input-group">
            <label style={{ 
              fontWeight: 700, 
              fontSize: '11px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              marginBottom: '10px', 
              display: 'block'
            }}>
              Phone <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="ws-input-wrapper">
              <Phone size={17} style={{ color: 'var(--ws-violet)' }} />
              <input
                type="tel"
                name="phone"
                placeholder="+880 1XXX-XXXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* User ID */}
          <div className="ws-input-group" style={{ opacity: isOwner ? 1 : 0.7 }}>
            <label style={{ 
              fontWeight: 700, 
              fontSize: '11px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              marginBottom: '10px', 
              display: 'block'
            }}>
              User ID <span style={{ color: '#ef4444' }}>*</span> {!isOwner && <span style={{ fontSize: '9px', textTransform: 'none', marginLeft: '4px', background: 'rgba(124,58,237,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Locked</span>}
            </label>
            <div className="ws-input-wrapper">
              <Shield size={17} style={{ color: 'var(--ws-violet)' }} />
              <input
                type="text"
                name="login_id"
                placeholder="e.g. user01"
                value={formData.login_id}
                onChange={handleChange}
                required
                readOnly={!isOwner}
                style={{ cursor: isOwner ? 'text' : 'not-allowed', background: isOwner ? '' : 'rgba(0,0,0,0.15)' }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="ws-input-group">
            <label style={{ 
              fontWeight: 700, 
              fontSize: '11px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              marginBottom: '10px', 
              display: 'block'
            }}>
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="ws-input-wrapper">
              <Lock size={17} style={{ color: 'var(--ws-violet)' }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--ws-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  zIndex: 2
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#ef4444',
            fontSize: 'var(--fs-small)',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <div style={{ marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: 800,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'rgba(124,58,237,0.4)'
                : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              letterSpacing: '-0.01em',
              boxShadow: loading ? 'none' : '0 10px 30px rgba(124,58,237,0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 15px 40px rgba(124,58,237,0.5)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 10px 30px rgba(124,58,237,0.4)';
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="ws-spinner" />
                <span>Adding Member…</span>
              </>
            ) : (
              <>
                <UserPlus size={20} strokeWidth={2.5} />
                <span>Add Member to Workspace</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

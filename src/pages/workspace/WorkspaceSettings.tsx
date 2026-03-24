import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { UserPlus, Phone, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff, Info, Lock, Copy, Download, Share2 } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import html2canvas from "html2canvas";

export const WorkspaceSettings = () => {
  const { activeUser, workspaces } = useOutletContext<any>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Click away for custom dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          email: formData.email || null,
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

  const downloadCredentials = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0e0e12',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const fileName = `${formData.name.replace(/\s+/g, '_') || 'credentials'}.png`;
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  const shareCredentials = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0e0e12',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const fileName = `${formData.name.replace(/\s+/g, '_') || 'credentials'}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Member Credentials',
              files: [file],
            });
          } catch (err) {
            console.error('Error sharing:', err);
          }
        } else {
          // Fallback: trigger download if share-with-files not supported
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  if (success) {
    return (
      <div className="ws-page-width ws-users-page ws-animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', padding: '1.5rem 1rem' }}>
        <div ref={cardRef} className="ws-form-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem 2.5rem', position: 'relative' }}>
          
          <div className="ws-brand-tag" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="ws-workspace-badge">
              <span className="ws-workspace-name" style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
                <span className="ws-name-first" style={{ color: '#10b981' }}>{activeWorkspaceName.split(' ')[0]}</span>
                {activeWorkspaceName.includes(' ') && ( activeWorkspaceName.split(' ').slice(1).join(' ') !== '' && (
                  <span className="ws-name-rest" style={{ color: '#fff' }}>{' ' + activeWorkspaceName.split(' ').slice(1).join(' ')}</span>
                ))}
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.35rem', color: '#fff', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            User Created!
            <CheckCircle2 size={24} color="var(--ws-violet)" strokeWidth={2.5} />
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', marginBottom: '1.75rem', fontWeight: 500, lineHeight: '1.5' }}>
            <strong style={{ color: 'var(--ws-violet)' }}>{formData.name}</strong> is now a <strong style={{ color: 'var(--ws-violet)' }}>{formData.role}</strong> of <strong style={{ color: '#fff' }}>{activeWorkspaceName}</strong>.
          </p>

          <div className="ws-credentials-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ws-border)', borderRadius: '20px', padding: '1.5rem 1.75rem', marginBottom: '1.25rem', textAlign: 'left', position: 'relative' }}>
            <div className="ws-cred-item" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ws-violet)', letterSpacing: '0.12em', opacity: 0.7 }}>User ID</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#0a0a0a', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input readOnly tabIndex={-1} value={formData.login_id} style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', fontWeight: 900, padding: 0, fontFamily: 'monospace', letterSpacing: '0.05em', userSelect: 'none', pointerEvents: 'none', outline: 'none' }} />
              </div>
            </div>

            <div className="ws-cred-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ws-violet)', letterSpacing: '0.12em', opacity: 0.7 }}>User Password</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#0a0a0a', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input readOnly tabIndex={-1} value={formData.password} style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', fontWeight: 900, padding: 0, fontFamily: 'monospace', letterSpacing: '0.04em', userSelect: 'none', pointerEvents: 'none', outline: 'none' }} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: '0.1rem', opacity: 0.4, fontSize: '0.75rem', fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>
            Thank you for being with us!
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
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
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
            onClick={() => copyToClipboard(`User Id       : ${formData.login_id}\nUser Password : ${formData.password}`, 'card-copy-toast')}
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
    <div className="ws-page-width ws-users-page ws-overview-page ws-animate-slide-up" style={{ marginTop: '-0.75rem' }}>
      {/* Header Section: Perfectly Symmetrical 3-Col Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(42px, 1fr) auto minmax(42px, 1fr)', 
        alignItems: 'center', 
        marginBottom: '0.75rem',
        paddingTop: '0rem',
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
          fontSize: '1.6rem', 
          margin: 0, 
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}>
          Add New User
        </h1>

        <div aria-hidden="true" /> {/* Balancing Spacer */}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ 
          color: 'var(--ws-text-muted)', 
          fontSize: '0.88rem', 
          maxWidth: '480px', 
          margin: '0 auto',
          lineHeight: '1.65',
          opacity: 0.9
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
              fontSize: '10.5px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              marginBottom: '2px', 
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
              fontSize: '10.5px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              marginBottom: '2px', 
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
                    border: '1px solid rgba(139, 92, 246, 0.2)',
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
                      borderTop: '6px solid rgba(139, 92, 246, 0.2)'
                    }} />
                  </div>
                )}
              </div>
            </label>
            <div className="ws-input-wrapper" ref={roleDropdownRef}>
              <svg 
                width="26" 
                height="26" 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--ws-violet)', zIndex: 1, marginLeft: '-4px' }}
              >
                <path fill="currentColor" d="M64.9 47.4c-8.2 0-15 6.7-15 15 0 8.2 6.7 15 15 15s15-6.7 15-15-6.8-15-15-15m7.3 13.1-2.8 2.8c-.3.3-.4.6-.4.8l.7 4.2c.2 1.2-.9.5-.9.5L65.4 67c-.5-.3-1 0-1 0l-3.5 1.8c-.9.5-.9 0-.9-.4l.7-3.9c.1-.8-.3-1.1-.3-1.2l-2.5-2.4-.3-.3c-.3-.3-.5-.8.6-1l3.5-.5c.5-.1.8-.3.9-.5l1.9-3.9c.1-.3.5-.6.9.2l1.9 3.8c.1.2.4.3.6.4h.3l3.7.5h.1c.2.1.9.3.2.9"/>
                <path fill="currentColor" d="M48.9 77.2c1 0 1.6-1.2 1-2-3.2-3.6-5-8.2-5-13 0-3.4 1.1-7.2 2.9-10.2 2.1-3.6 4.5-5.1 6.4-7.9 3.1-4.6 3.7-11.2 1.7-16.2-2-5.1-6.7-8.1-12.2-8s-10 3.5-11.7 8.6c-2 5.6-1.1 12.4 3.4 16.6 1.9 1.7 3.5 4.4 2.6 7-.2.5-.8 1.3-2.2 1.9-5.7 2.5-11.5 5.5-14.1 9.7-.5.8-1.5 2.8-1.6 5.6 0 .7 0 1.3.1 2.2 0 .4 0 .4.1.8.3 1.7 1.3 3.2 2.8 4.1.6.3 2 .8 4.7.8z"/>
              </svg>
              <div 
                className={`ws-custom-select ${showRoleDropdown ? 'active' : ''}`}
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                style={{ paddingRight: '14px' }}
              >
                {formData.role}
              </div>

              {/* Custom Dropdown Menu */}
              {showRoleDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '100%',
                  background: 'rgba(15,15,20,0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '8px',
                  zIndex: 200,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  animation: 'ws-fade-in 0.15s ease-out',
                  overflow: 'hidden'
                }}>
                  {roles.map(role => (
                    <div
                      key={role.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, role: role.name }));
                        setShowRoleDropdown(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: formData.role === role.name ? 'var(--ws-violet)' : '#fff',
                        background: formData.role === role.name ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: formData.role === role.name ? 700 : 500
                      }}
                      onMouseOver={(e) => {
                        if (formData.role !== role.name) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (formData.role !== role.name) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {role.name}
                      {formData.role === role.name && <CheckCircle2 size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="ws-input-group">
            <label style={{ 
              fontWeight: 700, 
              fontSize: '10.5px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              marginBottom: '2px', 
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
              fontSize: '10.5px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              marginBottom: '2px', 
              display: 'block'
            }}>
              User ID <span style={{ color: '#ef4444' }}>*</span> {!isOwner && <span style={{ fontSize: '9px', textTransform: 'none', marginLeft: '4px', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Locked</span>}
            </label>
            <div className="ws-input-wrapper">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 16 16" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'var(--ws-violet)', zIndex: 1, marginLeft: '-1px' }}
              >
                <path fill="none" d="M0 0h16v16H0z"/>
                <path fill="currentColor" d="M0 14.462h2.518V4.963H0zM0 3.83h2.518V1.538H0zm15.756 1.769a5.7 5.7 0 0 0-.916-2.074 4.24 4.24 0 0 0-2.189-1.629q-.794-.261-1.988-.279H5.124v12.845h5.538q2.913 0 4.308-2.396Q16 10.288 16 7.725q0-1.01-.244-2.126m-2.894 4.758q-.75 1.874-2.653 1.874H7.73V3.847h2.479q1.833 0 2.448 1.05t.615 3.011q0 1.422-.41 2.449"/>
              </svg>
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
              fontSize: '10.5px', 
              color: 'var(--ws-text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              marginBottom: '2px', 
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
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyItems: 'center', justifyContent: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '50%',
              height: '52px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              border: '1px solid var(--ws-violet)',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.06)',
              backdropFilter: 'blur(10px)',
              color: 'var(--ws-violet)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              letterSpacing: '0.01em',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.15)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.06)';
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="ws-spinner" />
                <span>Adding User...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} strokeWidth={2.5} />
                <span>Add User</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

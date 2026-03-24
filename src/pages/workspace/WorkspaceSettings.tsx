import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { UserPlus, Phone, Shield, User, Loader2, CheckCircle2, ArrowLeft, ChevronDown } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

export const WorkspaceSettings = () => {
  const { activeUser } = useOutletContext<any>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    login_id: "",
    name: "",
    email: "",
    phone: "",
    role: "Member",
  });

  const allRoles = [
    { id: 'a1a1aa00-0000-0000-0000-000000000000', name: 'Member' },
    { id: 'f59e0b00-0000-0000-0000-000000000000', name: 'Cashier' },
    { id: 'd946ef00-0000-0000-0000-000000000000', name: 'Investor' },
    { id: '8b5cf600-0000-0000-0000-000000000000', name: 'System Admin / Owner' },
  ];

  // Restrict the dropdown based on user permission (Cashiers can only create Members & Investors)
  const isOwner = activeUser?.role === 'System Admin / Owner' || activeUser?.role_id === '8b5cf600-0000-0000-0000-000000000000';
  const roles = isOwner ? allRoles : allRoles.filter(r => r.name === 'Member' || r.name === 'Investor');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedRole = roles.find(r => r.name === formData.role);

    try {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          login_id: formData.login_id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role_id: selectedRole?.id,
          workspace_id: activeUser?.workspaceId,
          initial: formData.name.charAt(0).toUpperCase(),
          status: 'active'
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        navigate("/workspace/members");
      }, 2000);
    } catch (err: any) {
      console.error("Error adding member:", err);
      setError(err.message || "Failed to add member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="ws-page-width ws-overview-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="ws-report-success" style={{ textAlign: 'center' }}>
          <div className="ws-success-icon" style={{ margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={52} />
          </div>
          <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Member Added!</h2>
          <p style={{ color: 'var(--ws-text-muted)' }}>Redirecting to the members database…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ws-page-width ws-users-page ws-overview-page">
      {/* Header Row: Back + Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '0.4rem' }}>
          <button
            onClick={() => navigate('/workspace/members')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--ws-text-muted)',
              fontSize: 'var(--fs-small)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 0',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1 style={{ fontWeight: 800, fontSize: 'var(--fs-h2)', margin: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', color: 'var(--ws-violet)' }}>Add New User</h1>
        </div>
        <p style={{ color: 'var(--ws-text-muted)', fontSize: 'var(--fs-body)', maxWidth: '400px', margin: 0 }}>
          Fill out the details below to add someone to your workspace.
        </p>
      </div>

      {/* Form — flat, no card */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>

          {/* Full Name */}
          <div className="ws-input-group">
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="ws-input-wrapper">
              <UserPlus size={17} />
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
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              Role
            </label>
            <div className="ws-input-wrapper">
              <Shield size={17} />
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                style={{ cursor: 'pointer', paddingRight: '40px', colorScheme: 'dark' }}
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

          {/* User ID */}
          <div className="ws-input-group">
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              User ID <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="ws-input-wrapper">
              <User size={17} />
              <input
                type="text"
                name="login_id"
                placeholder="e.g. user01"
                value={formData.login_id}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="ws-input-group">
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              Phone
            </label>
            <div className="ws-input-wrapper">
              <Phone size={17} />
              <input
                type="tel"
                name="phone"
                placeholder="+880 1XXX-XXXXXX"
                value={formData.phone}
                onChange={handleChange}
              />
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
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            height: '54px',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: 700,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? 'rgba(124,58,237,0.4)'
              : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            letterSpacing: '-0.01em',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.35)',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(124,58,237,0.45)';
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 4px 20px rgba(124,58,237,0.35)';
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="ws-spinner" />
              <span>Adding Member…</span>
            </>
          ) : (
            <>
              <UserPlus size={18} strokeWidth={2.5} />
              <span>Add Member to Workspace</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

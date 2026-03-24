import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Phone, Shield, User, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
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

  const roles = [
    { id: 'a1a1aa00-0000-0000-0000-000000000000', name: 'Member' },
    { id: 'f59e0b00-0000-0000-0000-000000000000', name: 'Cashier' },
    { id: 'd946ef00-0000-0000-0000-000000000000', name: 'Investor' },
    { id: '8b5cf600-0000-0000-0000-000000000000', name: 'System Admin / Owner' },
  ];

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
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
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
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--ws-violet), #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 0 1.25rem',
          boxShadow: '0 8px 24px rgba(139,92,246,0.35)'
        }}>
          <UserPlus size={26} color="#fff" />
        </div>
        <h1 style={{ fontWeight: 800, fontSize: 'var(--fs-h2)', marginBottom: '0.4rem' }}>Add New Member</h1>
        <p style={{ color: 'var(--ws-text-muted)', fontSize: 'var(--fs-body)', maxWidth: '400px' }}>
          Fill out the details below to add someone to your workspace.
        </p>
      </div>

      {/* Form Card */}
      <div className="ws-form-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Login ID */}
          <div className="ws-input-group">
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              Login ID <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="ws-input-wrapper">
              <User size={17} />
              <input
                type="text"
                name="login_id"
                placeholder="e.g. user01, staff12"
                value={formData.login_id}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
                placeholder="Enter member's full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="ws-input-group">
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              Email Address
            </label>
            <div className="ws-input-wrapper">
              <Mail size={17} />
              <input
                type="email"
                name="email"
                placeholder="member@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="ws-input-group">
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              Phone Number
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

          {/* Role */}
          <div className="ws-input-group">
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-small)', color: 'var(--ws-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>
              Workspace Role
            </label>
            <div className="ws-input-wrapper">
              <Shield size={17} />
              <select name="role" value={formData.role} onChange={handleChange}>
                {roles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
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
              fontSize: 'var(--fs-small)'
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="ws-btn-primary"
            disabled={loading}
            style={{ width: '100%', height: '52px', borderRadius: '14px', fontSize: 'var(--fs-body)', fontWeight: 700, marginTop: '0.25rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="ws-spinner" />
                <span>Adding Member…</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Add Member to Workspace</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

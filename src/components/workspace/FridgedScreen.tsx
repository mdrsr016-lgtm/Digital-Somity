import { Snowflake, LogOut, MessageCircle, AlertCircle } from "lucide-react";

interface FridgedScreenProps {
  onLogout: () => void;
  type: 'user' | 'workspace' | 'role';
}

export const FridgedScreen = ({ onLogout, type }: FridgedScreenProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#000',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(139, 92, 246, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'rgba(59, 130, 246, 0.1)',
        filter: 'blur(80px)',
        borderRadius: '50%',
      }} />

      <div className="ws-animate-slide-up" style={{
        maxWidth: '450px',
        width: '100%',
        background: 'rgba(15, 15, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '24px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: 'var(--ws-violet)',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <Snowflake size={36} strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          marginBottom: '12px',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          Access Frozen
        </h1>

        <p style={{
          color: 'var(--ws-text-muted)',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Your {type} has been moved to the <span style={{ color: 'var(--ws-violet)', fontWeight: 700 }}>Fridge</span>. 
          Please contact your system administrator to restore access to this workspace.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={() => window.location.href = 'mailto:admin@example.com'}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--ws-violet)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <MessageCircle size={18} />
            Contact Admin
          </button>

          <button 
            onClick={onLogout}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--ws-text-muted)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.5 }}>
          <AlertCircle size={12} />
          <span style={{ fontSize: '11px', fontWeight: 500 }}>System ID: {localStorage.getItem('ds_logged_in_user')}</span>
        </div>
      </div>
    </div>
  );
};

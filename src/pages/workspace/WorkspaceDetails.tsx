import { Briefcase } from "lucide-react";

export const WorkspaceDetails = () => {
  return (
    <div className="ws-page-width">
      <div className="ws-header">
        <h1>Workspace Details</h1>
        <p>Manage your workspace credentials and core settings here.</p>
      </div>
      
      <div style={{ width: '100%', height: '400px', border: '2px dashed var(--ws-border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--ws-text-muted)', padding: '0 2rem', gap: '1rem' }}>
        <div className="ws-stat-icon-wrapper" style={{ background: 'rgba(125,57,235,0.08)', color: 'var(--ws-violet)', marginBottom: 0 }}>
          <Briefcase size={28} />
        </div>
        <p>Workspace Details Module coming soon.</p>
      </div>
    </div>
  );
};

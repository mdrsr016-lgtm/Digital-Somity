import { useOutletContext } from "react-router-dom";

export const WorkspaceOverview = () => {
  return (
    <div className="ws-page-width">
      <div className="ws-header">
        <h1>Workspace Overview</h1>
        <p>Welcome to your newly reconstructed workspace.</p>
      </div>
      <div style={{ height: '400px', border: '2px dashed var(--ws-border)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ws-text-muted)' }}>
        Rebuilding Content...
      </div>
    </div>
  );
};

export const AdminSettings = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Settings</h2>
        <p>Configure overall application settings.</p>
      </div>

      <div className="settings-grid">
        <div className="admin-card settings-card">
          <h3>General Information</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>Application Name</label>
              <input type="text" defaultValue="Digital Somiti" className="admin-input" />
            </div>
            <div className="form-group">
              <label>Support Email</label>
              <input type="email" defaultValue="support@digitalsomiti.com" className="admin-input" />
            </div>
            <button className="admin-btn-primary">Save Changes</button>
          </div>
        </div>

        <div className="admin-card settings-card">
          <h3>Security Rules</h3>
          <div className="settings-form">
            <div className="settings-toggle-row">
              <label>Require Two-Factor Authentication</label>
              <input type="checkbox" className="admin-toggle" />
            </div>
            <div className="settings-toggle-row">
              <label>Enforce Strong Passwords</label>
              <input type="checkbox" defaultChecked className="admin-toggle" />
            </div>
            <div className="settings-toggle-row">
              <label>Session Timeout (mins)</label>
              <input type="number" defaultValue="30" className="admin-input-small" />
            </div>
            <button className="admin-btn-primary">Update Security Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UsersManagement = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Users Management</h2>
        <p>Manage application users, roles, and permissions.</p>
        <button className="admin-btn-primary">Add New User</button>
      </div>

      <div className="admin-card admin-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">A</div>
                  <span>Alice Smith</span>
                </div>
              </td>
              <td>Admin</td>
              <td><span className="status-badge active">Active</span></td>
              <td>Today, 10:30 AM</td>
              <td>
                <button className="admin-btn-text">Edit</button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">B</div>
                  <span>Bob Jones</span>
                </div>
              </td>
              <td>User</td>
              <td><span className="status-badge active">Active</span></td>
              <td>Yesterday, 4:15 PM</td>
              <td>
                <button className="admin-btn-text">Edit</button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">C</div>
                  <span>Charlie Brown</span>
                </div>
              </td>
              <td>User</td>
              <td><span className="status-badge inactive">Inactive</span></td>
              <td>Oct 12, 2023</td>
              <td>
                <button className="admin-btn-text">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

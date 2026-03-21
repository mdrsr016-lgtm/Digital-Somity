import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, User, CreditCard, Users, ShieldCheck } from 'lucide-react';
import '../styles/Modal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const demoUsers = [
    { id: 'inv123', label: 'Investors', role: 'Investment Manager', icon: <CreditCard size={20} />, description: 'Use this ID to see investment records and profit reports.' },
    { id: 'cas123', label: 'Cashiers', role: 'Cash Manager', icon: <User size={20} />, description: 'Use this ID to manage daily transactions and member collections.' },
    { id: 'mem123', label: 'Members', role: 'Society Member', icon: <Users size={20} />, description: 'Use this ID to see your own savings, loans, and profile.' },
    { id: 'adm123', label: 'Admins', role: 'System Administrator', icon: <ShieldCheck size={20} />, description: 'Use this ID to access full system control and management tools.' }
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-backdrop"
          />
          
          <div className="modal-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content help-modal"
            >
              <button className="modal-close" onClick={onClose}>
                <X size={20} />
              </button>

              <div className="modal-header">
                <div className="icon-badge">
                  <HelpCircle className="badge-icon" />
                </div>
                <h2>How to Log In?</h2>
                <p>Welcome! Please follow these simple steps to enter the system.</p>
              </div>

              <div className="help-steps">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-text">Look at the list below to find your <b>User ID</b>.</div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-text">Type that ID into the <b>User Id</b> box on the login screen.</div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-text">Type your <b>Password</b> and click <b>Get Started</b>.</div>
                </div>
              </div>

              <div className="demo-grid">
                {demoUsers.map((user) => (
                  <div key={user.id} className="demo-card">
                    <div className="demo-icon-row">
                      <div className="demo-role-icon">{user.icon}</div>
                      <span className="demo-label">{user.label}</span>
                    </div>
                    <div className="demo-id-box">
                      <span className="id-label">User ID:</span>
                      <code className="id-code">{user.id}</code>
                    </div>
                    <p className="demo-desc">{user.description}</p>
                  </div>
                ))}
              </div>

              <div className="modal-footer-info">
                <p>Need more help? Please contact your branch supervisor.</p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

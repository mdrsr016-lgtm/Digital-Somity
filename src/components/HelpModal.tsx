import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, User, CreditCard, Users, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Modal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const demoUsers = [
    { id: 'inv123', label: t.help.investorsLabel, role: t.help.investorsRole, icon: <CreditCard size={20} />, description: t.help.investorsDesc },
    { id: 'cas123', label: t.help.cashiersLabel, role: t.help.cashiersRole, icon: <User size={20} />, description: t.help.cashiersDesc },
    { id: 'mem123', label: t.help.membersLabel, role: t.help.membersRole, icon: <Users size={20} />, description: t.help.membersDesc },
    { id: 'adm123', label: t.help.adminsLabel, role: t.help.adminsRole, icon: <ShieldCheck size={20} />, description: t.help.adminsDesc }
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
                <h2>{t.help.title}</h2>
                <p>{t.help.subtitle}</p>
              </div>

              <div className="help-steps">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-text">{t.help.step1Start} <b>{t.help.step1UserId}</b> {t.help.step1End}</div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-text">{t.help.step2Start} <b>{t.help.step2Box}</b> {t.help.step2End}</div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-text">{t.help.step3Start} <b>{t.help.step3Password}</b> {t.help.step3Mid} <b>{t.help.step3GetStarted}</b> {t.help.step3End}</div>
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
                      <span className="id-label">{t.help.userIdLabel}</span>
                      <code className="id-code">{user.id}</code>
                    </div>
                    <p className="demo-desc">{user.description}</p>
                  </div>
                ))}
              </div>

              <div className="modal-footer-info">
                <p>{t.help.footerInfo}</p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

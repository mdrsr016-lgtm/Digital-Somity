import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Modal.css';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

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
              className="modal-content"
            >
              <button className="modal-close" onClick={onClose}>
                <X size={20} />
              </button>

              <div className="modal-header">
                <div className="icon-badge">
                  <Shield className="badge-icon" />
                </div>
                <h2>{t.login.privacyPolicyHeader}</h2>
                <p style={{ textAlign: 'left', lineHeight: 1.6, fontSize: '0.95rem' }}>{t.login.privacyPolicyBody}</p>
              </div>

              <div className="modal-body" style={{ alignItems: 'center' }}>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="primary-button"
                  onClick={onClose}
                  style={{ marginTop: '0', width: 'auto', padding: '14px 32px' }}
                >
                  {t.login.understoodButton}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

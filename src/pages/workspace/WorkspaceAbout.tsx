import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Github, Globe, ShieldCheck, FileText } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import logo from "../../assets/images/logo.svg";

export const WorkspaceAbout = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 350);
  };

  return (
    <div className={`ws-menu-page-container ${isClosing ? 'ws-slide-out-right' : 'ws-slide-in-right'}`}>
      <div className="ws-menu-header-center">
        <button className="ws-menu-back-plain" onClick={handleBack}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="ws-menu-title">
          {language === 'bn' ? 'সম্পর্কে' : 'About'}
        </h1>
        <div style={{ width: '44px' }}></div>
      </div>

      <div className="ws-menu-scroll-content">
        <div className="ws-menu-page-width">
          <div className="ws-about-hero">
            <div className="ws-about-logo-circle">
              <img src={logo} alt="Digital Somiti Logo" style={{ width: '60px', height: '60px' }} />
            </div>
            <h2>Digital Somiti</h2>
            <p className="ws-version-badge">Version 2.4.0 (Stable)</p>
          </div>

          <div className="ws-about-section">
            <p className="ws-about-description">
              {language === 'bn' 
                ? 'ডিজিটাল সমিতি একটি আধুনিক প্ল্যাটফর্ম যা সমিতির কার্যক্রম পরিচালনা সহজ করে তোলে। আমাদের লক্ষ্য হলো স্বচ্ছতা এবং দক্ষতার সাথে আপনার আর্থিক ব্যবস্থাপনা নিশ্চিত করা।' 
                : 'Digital Somiti is a modern platform designed to simplify association management. Our mission is to ensure transparency and efficiency in your financial management.'}
            </p>
          </div>

          <div className="ws-about-links-grid">
            <a href="#" className="ws-about-link-card">
              <Globe size={24} />
              <span>{language === 'bn' ? 'ওয়েবসাইট' : 'Website'}</span>
            </a>
            <a href="#" className="ws-about-link-card">
              <Github size={24} />
              <span>GitHub</span>
            </a>
            <a href="#" className="ws-about-link-card">
              <ShieldCheck size={24} />
              <span>{language === 'bn' ? 'প্রাইভেসি' : 'Privacy Policy'}</span>
            </a>
            <a href="#" className="ws-about-link-card">
              <FileText size={24} />
              <span>{language === 'bn' ? 'শর্তাবলী' : 'Terms of Service'}</span>
            </a>
          </div>

          <div className="ws-about-footer">
            <p>© 2026 Digital Somiti Team</p>
            <p>{language === 'bn' ? 'সকল অধিকার সংরক্ষিত' : 'All rights reserved'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

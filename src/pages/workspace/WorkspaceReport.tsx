import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Send, HelpCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const WorkspaceReport = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        handleBack();
      }, 2000);
    }, 1500);
  };

  return (
    <div className={`ws-menu-page-container ${isClosing ? 'ws-slide-out-right' : 'ws-slide-in-right'}`}>
      <div className="ws-menu-header-center">
        <button className="ws-menu-back-plain" onClick={handleBack}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="ws-menu-title">
          {language === 'bn' ? 'সমস্যা রিপোর্ট' : 'Report Problem'}
        </h1>
        <div style={{ width: '44px' }}></div>
      </div>

      <div className="ws-menu-scroll-content">
        <div className="ws-menu-page-width">
          {isSuccess ? (
            <div className="ws-report-success">
              <CheckCircle2 size={64} className="ws-success-icon" />
              <h2>{language === 'bn' ? 'ধন্যবাদ!' : 'Thank You!'}</h2>
              <p>
                {language === 'bn' 
                  ? 'আপনার রিপোর্ট সফলভাবে জমা হয়েছে। আমরা শীঘ্রই এটি দেখব।' 
                  : 'Your report has been submitted successfully. We will look into it soon.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ws-report-form">
              <div className="ws-report-info-card">
                <HelpCircle size={24} />
                <p>
                  {language === 'bn' 
                    ? 'আপনার সমস্যার বিবরণ দিন। আমাদের টিম আপনাকে সাহায্য করবে।' 
                    : 'Please describe the issue you are facing. Our team will help you.'}
                </p>
              </div>

              <div className="ws-input-group">
                <label>{language === 'bn' ? 'বিষয়' : 'Subject'}</label>
                <input 
                  type="text" 
                  placeholder={language === 'bn' ? 'কি বিষয়ে রিপোর্ট করছেন?' : 'What is this regarding?'}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="ws-input-group">
                <label>{language === 'bn' ? 'বিবরণ' : 'Description'}</label>
                <textarea 
                  placeholder={language === 'bn' ? 'বিস্তারিত লিখুন...' : 'Give us more details...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`ws-report-submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="ws-spinner-small"></div>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{language === 'bn' ? 'জমা দিন' : 'Submit Report'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

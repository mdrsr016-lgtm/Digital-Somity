import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Inbox, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'resolved' | 'in-progress';
  date: string;
  lastMessage: string;
}

export const WorkspaceSupport = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);

  const [tickets] = useState<Ticket[]>([
    {
      id: "TK-1024",
      subject: language === 'bn' ? 'অ্যাকাউন্ট লগইন সমস্যা' : 'Account Login Issue',
      status: 'resolved',
      date: '24 Mar 2026',
      lastMessage: language === 'bn' ? 'আপনার পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে।' : 'Your password has been reset successfully.'
    },
    {
      id: "TK-1025",
      subject: language === 'bn' ? 'পেমেন্ট গেটওয়ে এরর' : 'Payment Gateway Error',
      status: 'pending',
      date: '25 Mar 2026',
      lastMessage: language === 'bn' ? 'আমরা আপনার সমস্যাটি দেখছি।' : 'We are looking into your issue.'
    },
    {
      id: "TK-1026",
      subject: language === 'bn' ? 'নতুন ইউজার যোগ করতে পারছি না' : 'Cannot add new user',
      status: 'in-progress',
      date: '26 Mar 2026',
      lastMessage: language === 'bn' ? 'আমাদের টেকনিক্যাল টিম কাজ করছে।' : 'Our technical team is working on it.'
    }
  ]);

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 350);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'in-progress': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'bn') {
      switch (status) {
        case 'resolved': return 'সমাধান হয়েছে';
        case 'pending': return 'অপেক্ষমান';
        case 'in-progress': return 'চলমান';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className={`ws-menu-page-container ${isClosing ? 'ws-slide-out-right' : 'ws-slide-in-right'}`}>
      <div className="ws-menu-header-center">
        <button className="ws-menu-back-plain" onClick={handleBack}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="ws-menu-title">
          {language === 'bn' ? 'সাপোর্ট ইনবক্স' : 'Support Inbox'}
        </h1>
        <div style={{ width: '44px' }}></div>
      </div>

      <div className="ws-menu-scroll-content">
        <div className="ws-menu-page-width">
          {tickets.length === 0 ? (
            <div className="ws-report-success">
              <Inbox size={64} className="ws-success-icon" style={{ opacity: 0.3 }} />
              <h2>{language === 'bn' ? 'কোনো মেসেজ নেই' : 'No Messages'}</h2>
              <p>
                {language === 'bn' 
                  ? 'আপনার কোনো সাপোর্ট রিকোয়েস্ট বা ইনবক্স মেসেজ নেই।' 
                  : 'You have no open support requests or inbox messages.'}
              </p>
            </div>
          ) : (
            <div className="ws-support-list">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="ws-support-card">
                  <div className="ws-support-card-header">
                    <span className="ws-ticket-id">{ticket.id}</span>
                    <span className={`ws-status-badge ${ticket.status}`}>
                      {getStatusIcon(ticket.status)}
                      <span>{getStatusLabel(ticket.status)}</span>
                    </span>
                  </div>
                  <h3 className="ws-ticket-subject">{ticket.subject}</h3>
                  <p className="ws-ticket-message">{ticket.lastMessage}</p>
                  <div className="ws-support-card-footer">
                    <div className="ws-ticket-date">
                      <Clock size={14} />
                      <span>{ticket.date}</span>
                    </div>
                    <button className="ws-ticket-view-btn">
                      <MessageSquare size={16} />
                      <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatboxCV.module.css';
import { filterCandidatesByPrompt } from './mockCandidate';

const PaperPlaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.sendIcon}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ExcelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ScreeningCV = ({ candidates = [], prompt: initialPrompt, setPrompt }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: 'Hello! I am your IntelliHire AI Assistant. I can help you find candidates based on specific skills, experience levels, and diversity goals. How can I help today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState(initialPrompt);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue('');
    setPrompt(userText);

    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const topCandidates = filterCandidatesByPrompt(candidates, userText);
    
    let summary = '';
    if (topCandidates.length > 0) {
      summary = `${topCandidates.length} candidates were identified. The top match, ${topCandidates[0].name}, excels in ${topCandidates[0].skills.slice(0, 2).join(', ')} and GPA 3.65. The second candidate provides a strong technical match but is missing some specific framework experience. The third candidate meets the requirement but uses a different backend stack.`;
    } else {
      summary = "I couldn't find any candidates matching those specific criteria. Would you like to try searching with different keywords?";
    }

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'assistant',
      text: summary,
      candidates: topCandidates,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setIsTyping(false);
  };

  return (
    <div className={styles.screeningCVContainer}>
      <div className={styles.chatHeader}>
        <h2>AI Recruitment Agent</h2>
        <p>Welcome back, HireTab. Here is what is happening today.</p>
      </div>

      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.type === 'user' ? styles.userMessage : styles.assistantMessage}`}>
            <div className={styles.messageBubble}>
              <div className={styles.messageText}>{msg.text}</div>
              
              {msg.candidates && msg.candidates.length > 0 && (
                <>
                  <div className={styles.matchesHeader}>
                    <div className={styles.rankedTitleRow}>
                      <span className={styles.rankedTitle}>RANKED MATCHES</span>
                      <span className={styles.countPill}>{msg.candidates.length} candidates</span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.exportBtn}><ExcelIcon /> Export to Excel</button>
                      <button className={styles.rerankBtn}><SparklesIcon /> AI RE-RANKING</button>
                    </div>
                  </div>

                  {msg.candidates.map((c, idx) => (
                    <div key={c.id} className={styles.detailedCard}>
                      <div className={styles.cardTop}>
                        <div className={styles.rankBox}>{idx + 1}</div>
                        <div className={styles.cardInfo}>
                          <div>
                            <span className={styles.candName}>{c.name}</span>
                            <span className={styles.candEmail}>{c.email}</span>
                          </div>
                          <div className={styles.candMeta}>
                            <span>📍 {c.location || 'Hanoi, VN'}</span>
                            <span>💼 {c.experience_years || '2.5'} years exp</span>
                          </div>
                          <div className={styles.candSkills}>
                            {(c.skills || []).slice(0, 4).map(s => <span key={s} className={styles.skillPill}>{s}</span>)}
                            {(c.skills || []).length > 4 && <span className={styles.skillPill}>+{(c.skills || []).length - 4} more</span>}
                          </div>
                        </div>
                        <div className={styles.scoreWrapper}>
                          <span className={styles.scoreLabel}>MATCH SCORE</span>
                          <div className={styles.matchBar}>
                            <div className={styles.matchFill} style={{ width: `${c.matchScore}%` }} />
                          </div>
                          <span className={styles.scoreValue}>{c.matchScore}%</span>
                        </div>
                      </div>

                      <div className={styles.candBio}>
                        This candidate is an exceptionally strong {c.skills[0]} Engineer with {c.experience_years} years of experience and excellent academic performance (GPA {c.gpa || '3.65'}).
                      </div>

                      <div className={styles.feedbackGrid}>
                        <div className={styles.pointsRow}>
                          <div className={styles.pointsIcon}><CheckIcon /></div>
                          <div className={`${styles.pointsContent} ${styles.strengths}`}>
                            <b>STRENGTHS</b>
                            <p>{c.strengths || `Robust experience with ${c.skills.slice(0,3).join(', ')}. Directly meets the requirements with ${c.experience_years} years of relevant experience.`}</p>
                          </div>
                        </div>
                        <div className={styles.pointsRow}>
                          <div className={styles.pointsIcon}><AlertIcon /></div>
                          <div className={`${styles.pointsContent} ${styles.gaps}`}>
                            <b>GAPS</b>
                            <p>{c.gaps || `Lacks extensive experience in some secondary tools mentioned in the prompt.`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.messageRow} ${styles.assistantMessage}`}>
            <div className={styles.messageBubble}>
              <div className={styles.typing}><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInputWrapper}>
        <form className={styles.chatInputContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder="Search candidates: 3+ years React, GPA > 3.5, in Hanoi..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className={styles.sendButton} disabled={isTyping || !inputValue.trim()}>
            <PaperPlaneIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScreeningCV;

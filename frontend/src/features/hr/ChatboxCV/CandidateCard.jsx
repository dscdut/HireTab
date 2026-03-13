import React from 'react';
import styles from './CandidateCard.module.css';

const CandidateCard = ({ candidate }) => {
  // Remove .pdf from name
  const displayName = candidate.name.replace(/\.pdf$/i, '').trim();

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.rank}>{candidate.rank}</div>
        <div className={styles.nameEmailWrap}>
          <div className={styles.name}>{displayName}</div>
          <div className={styles.email}>{candidate.email}</div>
        </div>
        <div className={styles.infoWrap}>
          <span className={styles.location}>{candidate.location}</span>
          <span className={styles.exp}>{candidate.experience_years} years exp</span>
        </div>
        <div className={styles.matchScoreWrap}>
          <span className={styles.matchScoreLabel}>MATCH SCORE</span>
          <div className={styles.matchBar}><div className={styles.matchBarInner} style={{width: `${candidate.matchScore || 0}%`}} /></div>
          <span className={styles.matchScoreNum}>{candidate.matchScore || 0}%</span>
        </div>
      </div>
      <div className={styles.tagsWrap}>
        {(candidate.skills || []).slice(0,5).map((skill, idx) => (
          <span key={idx} className={styles.tag}>{skill}</span>
        ))}
        {candidate.skills && candidate.skills.length > 5 && <span className={styles.tag}>+{candidate.skills.length - 5} more</span>}
      </div>
      <div className={styles.summary}>{candidate.summary}</div>
      <div className={styles.sectionsWrap}>
        <div className={styles.sectionStrengths}>
          <span className={styles.sectionIcon}>✔️</span>
          <span className={styles.sectionTitle}>STRENGTHS</span>
          <span className={styles.sectionText}>{candidate.strengths}</span>
        </div>
        <div className={styles.sectionGaps}>
          <span className={styles.sectionIcon}>⚠️</span>
          <span className={styles.sectionTitle}>GAPS</span>
          <span className={styles.sectionText}>{candidate.gaps}</span>
        </div>
        <div className={styles.sectionRecommend}>
          <span className={styles.sectionIcon}>ℹ️</span>
          <span className={styles.sectionTitle}>RECOMMENDATION</span>
          <span className={styles.sectionText}>{candidate.recommendation || 'Recommended for interview. Strong technical match, but further screening is required.'}</span>
        </div>
      </div>
      <button className={styles.viewBtn}>View Full Resume</button>
    </div>
  );
};

export default CandidateCard;

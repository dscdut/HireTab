import React from 'react';
import styles from './UpdateCandidateStatusModal.module.css';

const UpdateCandidateStatusModal = ({ candidate, statusFrom, statusTo, onUpdate, onUpdateAndEmail, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatarIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
          </div>
        </div>
        <div className={styles.title}>Update Candidate Status</div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Candidate:</span>
          <span className={styles.value}>{candidate}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Status Change:</span>
          <span className={styles.statusChange}><span className={styles.statusFrom}>{statusFrom}</span> <span className={styles.arrow}>→</span> <span className={styles.statusTo}>{statusTo}</span></span>
        </div>
        <div className={styles.question}>How would you like to proceed?</div>
        <div className={styles.optionsWrap}>
          <button className={styles.optionBtn} onClick={onUpdate}>
            <span className={styles.optionIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </span>
            <div>
              <div className={styles.optionTitle}>Update Status Only</div>
              <div className={styles.optionDesc}>Just change the status without notification</div>
            </div>
          </button>
          <button className={styles.optionBtnBlue} onClick={onUpdateAndEmail}>
            <span className={styles.optionIconBlue}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>
            </span>
            <div>
              <div className={styles.optionTitleBlue}>Update Status & Send Email</div>
              <div className={styles.optionDescBlue}>Change status and compose notification email</div>
            </div>
          </button>
        </div>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateCandidateStatusModal;

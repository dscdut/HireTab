import React from 'react';
import styles from './ActionModal.module.css';

const ActionModal = ({ title, icon, infoRows = [], actions = [], onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.avatarWrap}>{icon}</div>
        <div className={styles.title}>{title}</div>
        {infoRows.map((row, idx) => (
          <div className={styles.infoRow} key={idx}>
            <span className={styles.label}>{row.label}</span>
            <span className={styles.value}>{row.value}</span>
          </div>
        ))}
        <div className={styles.optionsWrap}>
          {actions.map((action, idx) => (
            <button
              key={idx}
              className={action.primary ? styles.optionBtnBlue : styles.optionBtn}
              onClick={action.onClick}
            >
              <span className={action.primary ? styles.optionIconBlue : styles.optionIcon}>{action.icon}</span>
              <div>
                <div className={action.primary ? styles.optionTitleBlue : styles.optionTitle}>{action.title}</div>
                <div className={action.primary ? styles.optionDescBlue : styles.optionDesc}>{action.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ActionModal;

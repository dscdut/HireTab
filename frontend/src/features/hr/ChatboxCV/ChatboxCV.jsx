import React, { useState, useRef } from 'react';
import styles from './ChatboxCV.module.css';
import ScreeningCV from './ScreeningCV';
import { mockCandidateFromFile, filterCandidatesByPrompt } from './mockCandidate';

const MAX_FILES = 20;

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4f6ef7"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const ChatboxCV = () => {
  const [files, setFiles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [mockCandidates, setMockCandidates] = useState([]);
  const [prompt, setPrompt] = useState('Find Full Stack Developers candidates with 2+ years of experience in React and Node.js, GPA above 3.5, location Hà Nội');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showScreening, setShowScreening] = useState(false);
  const fileInputRef = useRef(null);

  const handleFilesAdd = (newFiles) => {
    let arr = Array.from(newFiles);
    if (files.length + arr.length > MAX_FILES) {
      arr = arr.slice(0, MAX_FILES - files.length);
    }
    const fileObjs = arr.map(f => ({ file: f, status: 'pending', candidate: null }));
    setFiles(prev => [...prev, ...fileObjs]);
  };

  const handleFileInput = (e) => {
    handleFilesAdd(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdd(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadAll = async () => {
    setLoading(true);
    const updatedFiles = [...files];
    const mocks = [];
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'pending') {
        updatedFiles[i].status = 'uploading';
        setFiles([...updatedFiles]);
        // MOCK LOGIC: generate mock candidate
        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 5s
        const mock = mockCandidateFromFile(updatedFiles[i].file);
        updatedFiles[i].status = 'done';
        updatedFiles[i].candidate = mock;
        mocks.push(mock);
        setFiles([...updatedFiles]);
      }
    }
    setMockCandidates(prev => [...mocks, ...prev]);
    setLoading(false);
    setResultText('Upload finished!');
  };

  const handleRemoveFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {/* Only show upload section if not screening */}
        {!showScreening && (
          <>
            {/* Card Header */}
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Bulk Candidate Upload</h2>
              <p className={styles.cardSubtitle}>
                Upload multiple CVs. Processing is now optimized for parallel extraction.
              </p>
            </div>
            {/* Dropzone */}
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
              <div className={styles.dropzoneIcon}>
                <UploadIcon />
              </div>
              <p className={styles.dropzoneText}>Click to upload or drag and drop</p>
              <p className={styles.dropzoneHint}>
                Parallel processing enabled. Max {MAX_FILES} files.
              </p>
            </div>
            {/* File List */}
            {files.length > 0 && (
              <div className={styles.fileList}>
                <div className={styles.fileListHeader}>
                  <span className={styles.fileListTitle}>Files ({files.length}/{MAX_FILES})</span>
                  <button
                    className={styles.uploadAllBtn}
                    onClick={handleUploadAll}
                    disabled={loading || files.every(f => f.status !== 'pending')}
                  >
                    {loading ? 'Processing...' : 'Upload All'}
                  </button>
                </div>
                {files.map((f, idx) => (
                  <div className={styles.fileItem} key={idx}>
                    <span className={styles.fileIcon}><FileIcon /></span>
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName}>{f.file.name}</span>
                      <span className={styles.fileSize}>{formatSize(f.file.size)}</span>
                    </div>
                    <span className={`${styles.fileStatus} ${styles[`status_${f.status}`]}`}>
                      {f.status === 'pending' && 'Ready'}
                      {f.status === 'uploading' && 'Uploading…'}
                      {f.status === 'done' && '✓ Done'}
                      {f.status === 'error' && '✗ Error'}
                    </span>
                    {f.candidate && (
                      <span className={styles.candidateName}>{f.candidate.name}</span>
                    )}
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }}
                      title="Remove"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {resultText && (
              <div className={styles.resultText}>{resultText}</div>
            )}
            {/* Candidate Results */}
            {candidates.length > 0 && (
              <div className={styles.resultsSection}>
                <h3 className={styles.resultsSectionTitle}>Extracted Candidates ({candidates.length})</h3>
                <div className={styles.candidateList}>
                  {candidates.map((c, idx) => (
                    <div className={styles.candidateCard} key={c.id || idx}>
                      <div className={styles.candidateRank}>{idx + 1}</div>
                      <div className={styles.candidateBody}>
                        <div className={styles.candidateHeader}>
                          <span className={styles.candidateName2}>{c.name}</span>
                          {c.email && <span className={styles.candidateEmail}>{c.email}</span>}
                          {c.phone && <span className={styles.candidateLocation}>📞 {c.phone}</span>}
                          <span className={styles.candidateExp}>
                            Score: {c.score || 0}/100
                          </span>
                        </div>
                        {c.summary && (
                          <div className={styles.strengths}>
                            <b>SUMMARY</b>
                            <div>{c.summary}</div>
                          </div>
                        )}
                        {c.skills && c.skills.length > 0 && (
                          <div className={styles.candidateTags}>
                            {c.skills.map((s, i) => (
                              <span className={styles.tag} key={i}>{s}</span>
                            ))}
                          </div>
                        )}
                        <div className={styles.matchRow}>
                          <span className={styles.matchLabel}>CV SCORE</span>
                          <div className={styles.matchBar}>
                            <div
                              className={styles.matchBarInner}
                              style={{ width: `${c.score || 0}%` }}
                            />
                          </div>
                          <span className={styles.matchScore}>{c.score || 0}%</span>
                        </div>
                        {c.resumeFile && (
                          <a
                            className={styles.viewCvLink}
                            href={`/v1/api/candidates/cv-file/${c.resumeFile.split('/').pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View CV →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {/* Tab Buttons Bottom Right */}
        <div className={styles.tabButtonGroup}>
          <button
            className={styles.tabButton + (showScreening ? '' : ' ' + styles.active)}
            onClick={() => setShowScreening(false)}
          >Upload CVs</button>
          <button
            className={styles.tabButton + (showScreening ? ' ' + styles.active : '')}
            onClick={() => setShowScreening(true)}
          >Screening CV</button>
        </div>
        {/* Main Content Switcher */}
        {showScreening ? (
          <ScreeningCV
            candidates={mockCandidates}
            prompt={prompt}
            setPrompt={setPrompt}
          />
        ) : (
          // ...existing code...
          <>
            {/* Candidate Results */}
            {candidates.length > 0 && (
              <div className={styles.resultsSection}>
                <h3 className={styles.resultsSectionTitle}>Extracted Candidates ({candidates.length})</h3>
                <div className={styles.candidateList}>
                  {candidates.map((c, idx) => (
                    <div className={styles.candidateCard} key={c.id || idx}>
                      <div className={styles.candidateRank}>{idx + 1}</div>
                      <div className={styles.candidateBody}>
                        <div className={styles.candidateHeader}>
                          <span className={styles.candidateName2}>{c.name}</span>
                          {c.email && <span className={styles.candidateEmail}>{c.email}</span>}
                          {c.phone && <span className={styles.candidateLocation}>📞 {c.phone}</span>}
                          <span className={styles.candidateExp}>
                            Score: {c.score || 0}/100
                          </span>
                        </div>
                        {c.summary && (
                          <div className={styles.strengths}>
                            <b>SUMMARY</b>
                            <div>{c.summary}</div>
                          </div>
                        )}
                        {c.skills && c.skills.length > 0 && (
                          <div className={styles.candidateTags}>
                            {c.skills.map((s, i) => (
                              <span className={styles.tag} key={i}>{s}</span>
                            ))}
                          </div>
                        )}
                        <div className={styles.matchRow}>
                          <span className={styles.matchLabel}>CV SCORE</span>
                          <div className={styles.matchBar}>
                            <div
                              className={styles.matchBarInner}
                              style={{ width: `${c.score || 0}%` }}
                            />
                          </div>
                          <span className={styles.matchScore}>{c.score || 0}%</span>
                        </div>
                        {c.resumeFile && (
                          <a
                            className={styles.viewCvLink}
                            href={`/v1/api/candidates/cv-file/${c.resumeFile.split('/').pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View CV →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatboxCV;

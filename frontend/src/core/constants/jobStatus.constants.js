// Centralized job status constants and alias groups
export const STATUS = {
  OPEN: ['open', 'active'],
  DONE: ['done'],
  TODO: ['todo'],
  IN_PROGRESS: ['in progress', 'inprogress', 'progress'],
  CLOSED: ['closed'],
  EXPIRED: ['expired'],
  PAUSED: ['paused'],
};

// Flattened helper to check membership
export const isStatusIn = (status, group) => {
  if (!status) return false;
  const s = String(status).toLowerCase().trim();
  return group.some(item => item === s);
};

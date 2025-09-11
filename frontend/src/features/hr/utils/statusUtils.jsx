import { Clock, CalendarCheck, CheckCircle, XCircle } from "lucide-react";

export const STATUS_COLORS = {
  'All': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    buttonBg: 'bg-gray-600',
    buttonHoverBg: 'hover:bg-gray-700',
  },
  'In-Review': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    buttonBg: 'bg-blue-600',
    buttonHoverBg: 'hover:bg-blue-700',
  },
  'Interview': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    buttonBg: 'bg-yellow-600',
    buttonHoverBg: 'hover:bg-yellow-700',
  },
  'Hired': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    buttonBg: 'bg-green-600',
    buttonHoverBg: 'hover:bg-green-700',
  },
  'Rejected': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    buttonBg: 'bg-red-600',
    buttonHoverBg: 'hover:bg-red-700',
  },
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'In-Review': return Clock;
    case 'Interview': return CalendarCheck;
    case 'Hired': return CheckCircle;
    case 'Rejected': return XCircle;
    default: return null;
  }
};

export const getStatusConfig = (status) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['All'];
  return {
    icon: getStatusIcon(status),
    bg: colors.bg,
    text: colors.text,
  };
};

export const getStatusButtonClass = (status) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['All'];
  return `${colors.buttonBg} ${colors.buttonHoverBg}`;
};

// Giả định các hàm khác như getNextStatus, getAvailableStatusTransitions tồn tại
export const getNextStatus = (currentStatus) => {
  const transitions = {
    'In-Review': 'Interview',
    'Interview': 'Hired',
    'Hired': null,
    'Rejected': null,
  };
  return transitions[currentStatus] || null;
};

export const getAvailableStatusTransitions = (selectedCandidates, candidates, activeTab) => {
  // Giả định logic hiện có, giữ nguyên
  return ['In-Review', 'Interview', 'Hired', 'Rejected'];
};
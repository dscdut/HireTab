import { getStatusConfig } from "@/core/shared/utils/statusUtils"

export default function StatusBadge({ status }) {
  const statusConfig = getStatusConfig(status)
  const StatusIcon = statusConfig.icon

  return (
    <span
      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
    >
      <StatusIcon className="w-3 h-3" />
      <span>{status}</span>
    </span>
  )
}

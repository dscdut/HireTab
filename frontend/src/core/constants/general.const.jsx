import { IconDashboard, IconCandidates, IconJobPosting, IconSettings, IconHelpCenter } from '@/assets/icons'
import IconHrDashboard from '@/assets/icons/icon-company-profile'
import { path } from '@/core/constants/path'

export const sidebarLinks = [
  {
    title: 'Dashboard',
    icon: <IconDashboard />,
    path: path.admin.dashboard
  }
]

export const candidateLinks = [
  {
    title: 'Candidates',
    path: path.hr.candidates_manage,
    icon: <IconCandidates />
  }
]

export const hrDashboard = [
  {
    title: 'Dashboard',
    path: path.hr.hr_dashboard,
    icon: <IconHrDashboard />
  }
]

export const hrLinks = [
  {
    title: 'Job Posting',
    path: [path.hr.job_posting, path.hr.job_detail, path.hr.dashboard],
    icon: <IconJobPosting />
  }
]

export const settingsBtn = [
  {
    title: 'Settings',
    path: path.hr.settings,
    icon: <IconSettings />
  }
]
export const helpCenterBtn = [
  {
    title: 'Help Center',
    path: path.hr.help_center,
    icon: <IconHelpCenter />
  }
]
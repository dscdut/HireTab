import { IconDashboard, IconCandidates , IconJobPosting, IconSettings, IconHelpCenter, IconTalentPool} from '@/assets/icons'
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
    title: 'Candicates',
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
    path: [path.hr.job_posting, path.hr.job_detail, path.hr.dashboard, path.hr.hr_talent_pool], 
    icon: <IconJobPosting />
  }
]

export const talentPoolLinks = [
  {
    title: 'Talent Pool',
    path: path.hr.hr_talent_pool,
    icon: <IconTalentPool />
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
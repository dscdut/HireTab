import { IconDashboard, IconJobs , IconJobPosting} from '@/assets/icons'

export const sidebarLinks = [
  {
    title: 'Dashboard',
    icon: <IconDashboard />,
    path: '/admin/dashboard'
  }
]

export const candidateLinks = [
  {
    title: 'Jobs',
    path: '/candidate/job', 
    icon: <IconJobs />
  },
]

export const hrLinks = [
  {
    title: 'Job Posting',
    path: '/hr/job-posting', 
    icon: <IconJobPosting />
  },
]
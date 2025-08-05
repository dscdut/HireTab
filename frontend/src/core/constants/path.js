export const path = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  blog: '/blog',
  admin: {
    dashboard: '/admin/dashboard'
  },
  candidate: {
    job: '/candidate/job',
    jobDetail: '/candidate/job/:id',
  },
  hr: {
    job_posting: '/hr/job-posting',
    job_detail: '/hr/job-detail/:id',
    dashboard: '/hr/job-dashboard/:jobId',
    candidates_manage: '/hr/manage-candidates',
    hr_dashboard: '/hr/dashboard',
    settings: '/hr/settings',
    help_center: '/hr/help-center',
  }
}

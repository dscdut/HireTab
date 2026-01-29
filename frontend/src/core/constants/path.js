export const path = {
  login: '/login',
  register: '/register',
  admin: {
    dashboard: '/admin/dashboard'
  },
  candidate: {
    home: '/',
    contact: '/contact-us',
    mission: '/mission-value',
    create_resume: '/create-resume',
    template_gallery: '/template-gallery',
    job: 'http://localhost:5173/dashboard',
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

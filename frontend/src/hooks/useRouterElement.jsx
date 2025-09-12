import { useLocation, useRoutes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { path } from '@/core/constants/path'
import JobOpeningPage from '@/features/candidate/job-opening/JobOpenningPage'
import CreateResume from '@/features/candidate/create-resume/pages/CreateResume'
import LayoutMain from '@/shared/layout/hr-layout/LayoutMain'
import ProtectedRoute from '@/guard/ProtectedRoute'
import HrDashboard from '@/features/hr/Dashboard/Hr_Dashboard'
import JobPostingDashboard from '@/features/hr/JobPostingDashboard'
import JobDetail from '@/features/hr/JobDetail'
import ManageCandidates from '@/features/hr/CandidateManage/ManageCandidates'
import HomePage from '@/features/candidate/home/HomePage'
import ContactPage from '@/features/candidate/contact/ContactPage'
import MissionValuePage from '@/features/candidate/mission-value/MissionValuePage'
import LoginPage from '@/features/hr/login/LoginPage'
import Register from '@/features/hr/register/RegisterPage'
import PageNotFound from '@/shared/layout/404/PageNotFound'
import JobOpeningDetailPage from '@/features/candidate/job-opening-details/JobOpeningDetail'
import JobPosting from '@/features/hr/JobPosting/JobPosting'
import TemplateGallery from '@/features/candidate/create-resume/pages/TemplateGallery'
export default function useRoutesElements() {
  const location = useLocation()

  const routes = [
    // Candidate routes
    { path: path.candidate.home, element: <HomePage /> },
    { path: path.candidate.contact, element: <ContactPage /> },
    { path: path.candidate.mission, element: <MissionValuePage /> },
    { path: path.candidate.job, element: <JobOpeningPage /> },
    { path: path.candidate.jobDetail, element: <JobOpeningDetailPage /> },
    { path: path.candidate.create_resume, element: <CreateResume /> },
    { path: path.candidate.template_gallery, element: <TemplateGallery /> },

    // Auth routes - HR
    { path: path.login, element: <LoginPage /> },
    { path: path.register, element: <Register /> },
    // HR routes
    {
      path: path.hr.hr_dashboard,
      element: (
        <LayoutMain>
          <ProtectedRoute allowedRoles={['HR']}>
            <HrDashboard />
          </ProtectedRoute>
        </LayoutMain>
      )
    },
    {
      path: path.hr.dashboard,
      element: (
        <LayoutMain>
          <ProtectedRoute allowedRoles={['HR']}>
            <JobPostingDashboard />
          </ProtectedRoute>
        </LayoutMain>
      )
    },
    {
      path: path.hr.job_posting,
      element: (
        <LayoutMain hasHeader={true}>
          <ProtectedRoute allowedRoles={['HR']}>
            <JobPosting />
          </ProtectedRoute>
        </LayoutMain>
      )
    },
    {
      path: path.hr.job_detail,
      element: (
        <LayoutMain>
          <ProtectedRoute allowedRoles={['HR']}>
            <JobDetail />
          </ProtectedRoute>
        </LayoutMain>
      )
    },
    {
      path: path.hr.candidates_manage,
      element: (
        <LayoutMain>
          <ProtectedRoute allowedRoles={['HR']}>
            <ManageCandidates />
          </ProtectedRoute>
        </LayoutMain>
      )
    },
    {
      path: path.hr.candidates_manage,
      element: (
        <LayoutMain>
          <ProtectedRoute allowedRoles={['HR']}>
            <ManageCandidates />
          </ProtectedRoute>
        </LayoutMain>

      )
    },
    { path: '*', element: <PageNotFound /> }
  ]

  const routeElements = useRoutes(routes, location)
  const isAuthPath = [path.login, path.register].includes(location.pathname)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.key}
        initial={{ opacity: 0, x: isAuthPath ? 20 : 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isAuthPath ? -20 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: isAuthPath ? 'absolute' : 'relative', width: '100%' }}
      >
        {routeElements}
      </motion.div>
    </AnimatePresence>
  )
}

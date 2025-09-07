import { useLocation, useRoutes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { path } from '@/core/constants/path'
import HomePage from '@/pages/home/HomePage'
import LoginPage from '@/pages/login/LoginPage'
import Register from '@/pages/register/RegisterPage'
import LayoutMain from '@/app/layout/LayoutMain'
import PageNotFound from '@/pages/404/PageNotFound'
import JobBoard from '@/pages/UV/JobBoard'
import JobDetail from '@/pages/UV/JobDetail'
import JobPostingDashboard from '@/pages/HR/JobPostingDashboard'
import JobPosting from '@/pages/HR/JobPosting/JobPosting'
import JobDetailHR from '@/pages/HR/JobDetail'
import ProtectedRoute from '@/guard/ProtectedRoute'
import ManageCandidates from '@/pages/HR/CandidateManage/ManageCandidates'
import HRDashboard from '@/pages/HR/Dashboard/Hr_Dashboard'
import CreateResume from '@/pages/UV/CreateResume'  
import ContactPage from '@/pages/contact/ContactPage'
import MissionValuePage from '@/pages/MissionValue/MissionValuePage'
export default function useRoutesElements() {
  const location = useLocation()

  const routes = [
    { path: path.home, element: <HomePage /> },
    { path: path.contact, element: <ContactPage /> },
    { path: path.mission, element: <MissionValuePage /> },
    { path: path.login, element: <LoginPage /> },
    { path: path.register, element: <Register /> },
    {
      path: path.candidate.job,
      element: (
        <JobBoard />
      )
    },
    {
      path: path.candidate.jobDetail,
      element: <JobDetail />
    },
    {
      path: path.create_resume,
      element: <CreateResume />
    },
    {
      path: path.hr.hr_dashboard,
      element: (
        <LayoutMain>
          <ProtectedRoute allowedRoles={['HR']}>
            <HRDashboard />
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
            <JobDetailHR />
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
          </ProtectedRoute >
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
  
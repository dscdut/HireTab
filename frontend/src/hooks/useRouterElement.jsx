import { useLocation, useRoutes } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { path } from '@/core/constants/path'
import HomePage from '@/pages/home/HomePage'
import Login from '@/pages/login/Login'
import Register from '@/pages/register/Register'
import Dashboard from '@/pages/dashboard/Dashboard'
import LayoutMain from '@/app/layout/LayoutMain'
import PageNotFound from '@/pages/404/PageNotFound'
import JobBoard from '@/UV/JobBoard'
import JobDetail from '@/UV/JobDetail'
import JobPostingDashboard from '@/pages/HR/JobPostingDashboard'
import JobBoardHR from '@/pages/HR/JobBoard'
import JobDetailHR from '@/pages/HR/JobDetail'
import ProtectedRoute from '@/components/landing/ProtectedRoute'

export default function useRoutesElements() {
  const location = useLocation()

  const routes = [
    { path: path.home, element: <HomePage /> },
    { path: path.login, element: <Login /> },
    { path: path.register, element: <Register /> },
    {
      path: path.admin.dashboard,
      element: (
        <LayoutMain>
          <Dashboard />
        </LayoutMain>
      )
    },
    {
      path: path.candidate.job,
      element: (

        <JobBoard />

    
      )
    },
    {
      path: path.candidate.jobDetail,
      element: (
        <JobDetail />
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
            <JobBoardHR />
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

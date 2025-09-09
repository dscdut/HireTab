import Sidebar from '@/shared/layout/hr-layout/side-bar'

const LayoutMain = ({ children, hasHeader = false }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className={`flex-1 overflow-auto bg-[#F4F4F4] ${hasHeader ? '' : 'px-2 py-2'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default LayoutMain
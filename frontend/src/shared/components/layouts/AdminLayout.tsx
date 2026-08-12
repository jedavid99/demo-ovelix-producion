import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopBar } from './AdminTopBar'
interface AdminLayoutProps {
  children: React.ReactNode
  orders?: any[]
}
export const AdminLayout = ({ children, orders = [] }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState) setSidebarCollapsed(JSON.parse(savedState))
  }, [])
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const toggleSidebar = () => setSidebarOpen((s) => !s)
  const closeSidebar = () => setSidebarOpen(false)
  const toggleSidebarCollapse = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }
  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-150">
      <AdminSidebar
        orders={orders}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        notificationsCount={3}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[240px]'}`}>
        <AdminTopBar
          onMenuClick={toggleSidebar}
          onToggleCollapse={toggleSidebarCollapse}
          sidebarCollapsed={sidebarCollapsed}
          sidebarOpen={sidebarOpen}
        />
        <main data-tour="content" className="flex-1 overflow-auto p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
export default AdminLayout

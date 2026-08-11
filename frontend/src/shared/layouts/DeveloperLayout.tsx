import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Settings,
  Users,
  Database,
  LogOut,
  Menu,
  X,
  TestTube,
  ChevronDown,
  User,
  ChevronRight,
  Shield,
  Activity,
  BarChart,
  HardDrive,
  FileText,
  Key,
  Bell,
  Lock,
  Clock,
  RefreshCw,
  Terminal,
  Globe,
  Mail,
  Send,
  MoreHorizontal,
  LayoutDashboard,
} from 'lucide-react';

interface DeveloperLayoutProps {
  children: React.ReactNode;
}

export default function DeveloperLayout({ children }: DeveloperLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Definimos las secciones principales (solo 4)
  const mainSections = [
    {
      id: 'panel',
      label: 'Panel',
      icon: LayoutDashboard,
      items: [
        { id: 'dashboard', label: 'Panel del Desarrollador', icon: LayoutDashboard, path: '/developer/dashboard' },
      ],
    },
    {
      id: 'companies',
      label: 'Empresas',
      icon: Building2,
      items: [
        { id: 'companies', label: 'Gestionar Empresas', icon: Building2, path: '/developer/companies' },
        { id: 'users', label: 'Usuarios', icon: Users, path: '/developer/users' },
        { id: 'tests', label: 'Pruebas del Sistema', icon: TestTube, path: '/developer/tests' },
      ],
    },
    {
      id: 'security',
      label: 'Seguridad',
      icon: Shield,
      items: [
        { id: 'roles', label: 'Roles y Permisos', icon: Lock, path: '/developer/security/roles' },
        { id: 'audit', label: 'Auditoría de Acceso', icon: Clock, path: '/developer/security/audit' },
      ],
    },
    {
      id: 'monitoring',
      label: 'Monitoreo',
      icon: Activity,
      items: [
        { id: 'health', label: 'Estado del Sistema', icon: Activity, path: '/developer/monitoring/health' },
        { id: 'cron', label: 'Tareas Programadas', icon: Clock, path: '/developer/monitoring/cron' },
        { id: 'logs', label: 'Logs del Servidor', icon: Terminal, path: '/developer/monitoring/logs' },
      ],
    },
    {
      id: 'tools',
      label: 'Herramientas',
      icon: MoreHorizontal,
      items: [
        { id: 'analytics', label: 'Analítica', icon: BarChart, path: '/developer/analytics/stats' },
        { id: 'backup', label: 'Backup', icon: HardDrive, path: '/developer/backup/backups' },
        { id: 'api', label: 'API Docs', icon: Globe, path: '/developer/api/docs' },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, path: '/developer/notifications/templates' },
        { id: 'database', label: 'Base de Datos', icon: Database, path: '/developer/database' },
        { id: 'settings', label: 'Configuración', icon: Settings, path: '/developer/settings' },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setOpenDropdown(null);
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ovelix</h1>
                  <p className="text-xs text-gray-500">Panel Desarrollador</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Solo 4 secciones */}
            <nav className="hidden lg:flex items-center space-x-4">
              {mainSections.map((section) => {
                const Icon = section.icon;
                const isOpen = openDropdown === section.id;
                return (
                  <div key={section.id} className="relative">
                    <button
                      onClick={() => toggleDropdown(section.id)}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isOpen
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{section.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                        role="menu"
                      >
                        {section.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                navigate(item.path);
                                closeAll();
                              }}
                              className={`flex items-center space-x-3 w-full px-4 py-2.5 text-sm transition-colors ${
                                isActive(item.path)
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              role="menuitem"
                            >
                              <ItemIcon className="w-4 h-4" />
                              <span>{item.label}</span>
                              {isActive(item.path) && (
                                <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Profile & Logout */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Desarrollador</p>
                      <p className="text-xs text-gray-500">developer@ovelix.com</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - también compacto y con todas las opciones */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {mainSections.map((section) => (
                <div key={section.id}>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </div>
                  <div className="space-y-1 pl-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.path)
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
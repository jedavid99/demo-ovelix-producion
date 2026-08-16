import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../features/auth/index'
import Register from '../features/auth/Register'
import AdminActivationCodes from '../features/auth/AdminActivationCodes'
import AdminLogin from '../features/auth/AdminLogin'
import SimpleCodeGenerator from '../features/auth/SimpleCodeGenerator'
import Unauthorized from '../features/auth/Unauthorized'
import RepairStatus from '../pages/RepairStatus'
import QRScanner from '../pages/QRScanner'
import Dashboard from '../features/dashboard/index'
import Clients from '../features/clients/index'
import Sales from '../features/sales/index'
import Stock from '../features/products/index'
import Providers from '../features/shipments/providers'
import Settings from '../features/settings/index'
import RootLayout from './layout'
import AdminLayout from '../shared/components/layouts/AdminLayout'
import DeveloperLayout from '../shared/layouts/DeveloperLayout'
import RepairsList from '../features/repairs/components/RepairList'
import RepairAdd from '../features/repairs/components/RepairAdd'
import RepairFlow from '../features/repairs/RepairFlow'
import QuickRepairForm from '../features/repairs/QuickRepairForm'
import RepairAddSimple from '../features/repairs/RepairAdd'
import Budgets from '../features/repairs/components/Budgets'
import BudgetRequests from '../features/budgetRequests'
import ClientAdd from '../features/clients/Add'
import SaleAdd from '../features/sales/Add'
import StockAdd from '../features/products/Add'
import ProviderAdd from '../features/shipments/Add'
import ProvidersOrders from '../features/shipments/Orders'
import OrdersList from '../features/shipments/OrdersList'
import OrderForm from '../features/shipments/OrderForm'
import OrderDetail from '../features/shipments/OrderDetail'
import Billing from '../features/business/billing'
import Expenses from '../features/expenses/index'
import ExpensesAdd from '../features/expenses/Add'
import ExpensesCategories from '../features/expenses/Categories'
import Developer from '../features/settings/developer'
import Profile from '../features/settings/profile'
import CajaDiaria from '../features/sales/cash-register'
import ARCA from '../features/business/arca'
import ARCAIVA from '../features/business/ARCAIVA'
import CreateInvoice from '../features/sales/invoice'
import InvoicesList from '../features/sales/invoices'
import IphoneSales from '../features/sales/iphone/Sales'
import IphoneRecords from '../features/sales/iphone/Records'
import IphoneInsurance from '../features/sales/iphone/Insurance'
import IphoneCanje from '../features/sales/iphone/Canje'
import CanjeNew from '../features/sales/iphone/CanjeNew'
import IPhoneInventory from '../features/products/IPhoneInventory'
import IPhoneInventoryList from '../features/products/IPhoneInventoryList'
import IPhoneInsurance from '../features/products/IPhoneInsurance'
import StockRepuestos from '../features/products/Repuestos'
import StockAdjustments from '../features/products/Adjustments'
import Notifications from '../features/settings/notifications'
import Tracking from '../features/shipments/Tracking'
import Remises from '../features/shipments/Remises'
import ReportsSales from '../features/reports/SalesReport'
import ReportsStock from '../features/reports/StockReport'
import ReportsFinancial from '../features/reports/FinancialReport'
import Docs from '../features/settings/docs'
import Help from '../features/settings/help'
import RepairsReport from '@/features/reports/RepairsReport'
import RepairEdit from '../features/repairs/components/RepairEdit'
import RepairQRDetails from '../features/repairs/RepairQRDetails'
import Page404 from '../features/developer/templates/Page404'
import TrialEnd from '../features/developer/templates/TrialEnd'
import SubscriptionEnd from '../features/developer/templates/SubscriptionEnd'
import PaymentReminder from '../features/developer/templates/PaymentReminder'
import PrivateRoute from '../shared/components/PrivateRoute'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import DeveloperCompanies from '../features/developer/Companies'
import DeveloperUsers from '../features/developer/Users'
import DeveloperDashboard from '../features/developer/Dashboard'
import DeveloperDatabase from '../features/developer/Database'
import DeveloperSettings from '../features/developer/Settings'
import DeveloperTests from '../features/developer/Tests'
import DeveloperRoles from '../features/developer/security/Roles'
import DeveloperAudit from '../features/developer/security/Audit'
import DeveloperHealth from '../features/developer/monitoring/Health'
import DeveloperCron from '../features/developer/monitoring/Cron'
import DeveloperLogs from '../features/developer/monitoring/Logs'
import DeveloperStats from '../features/developer/analytics/Stats'
import DeveloperDashboards from '../features/developer/analytics/Dashboards'
import DeveloperBackups from '../features/developer/backup/Backups'
import DeveloperRestore from '../features/developer/backup/Restore'
import DeveloperDocs from '../features/developer/api/Docs'
import DeveloperTokens from '../features/developer/api/Tokens'
import DeveloperTemplates from '../features/developer/notifications/Templates'
import DeveloperBulk from '../features/developer/notifications/Bulk'
import WhatsAppPage from '../features/whatsapp/WhatsAppPage'
import RepairCosts from '../features/repairCosts'
import PresupuestoLayout from '../presupuesto/PresupuestoLayout'
import ServicesPage from '../presupuesto/ServicesPage'
import ServicesListPage from '../presupuesto/ServicesListPage'
import PresupuestoFlow from '../presupuesto/PresupuestoFlow'
import TrackingPage from '../presupuesto/TrackingPage'
import BookingPage from '../presupuesto/BookingPage'
import LegalPage from '../presupuesto/LegalPage'
import PresupuestoTenantRoute from '../presupuesto/PresupuestoTenantRoute'
import { PERMISSIONS } from '@/hooks/usePermissions'
export function AppRouter() {
  return (
    <Routes>
      {/* Ruta principal - Dashboard */}
      <Route path="/" element={<PrivateRoute><ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/generate-codes" element={<SimpleCodeGenerator />} />
      <Route path="/admin/activation-codes" element={<AdminActivationCodes />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/repair-status" element={<RepairStatus />} />
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<PrivateRoute><ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ProtectedRoute><AdminLayout><Clients /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/sales" element={<PrivateRoute><ProtectedRoute><AdminLayout><Sales /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/stock" element={<PrivateRoute><ProtectedRoute><AdminLayout><Stock /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/providers" element={<PrivateRoute><ProtectedRoute><AdminLayout><Providers /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><ProtectedRoute><Navigate to="/reports/sales" replace /></ProtectedRoute></PrivateRoute>} />
      <Route path="/billing" element={<PrivateRoute><ProtectedRoute><AdminLayout><InvoicesList /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><ProtectedRoute><AdminLayout><Expenses /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      {/* Rutas de desarrollador */}
      <Route path="/developer" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperDashboard /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/dashboard" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperDashboard /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/companies" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperCompanies /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/users" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperUsers /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/tests" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperTests /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* Security */}
      <Route path="/developer/security/roles" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperRoles /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/security/audit" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperAudit /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* Monitoring */}
      <Route path="/developer/monitoring/health" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperHealth /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/monitoring/cron" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperCron /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/monitoring/logs" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperLogs /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* Analytics */}
      <Route path="/developer/analytics/stats" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperStats /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/analytics/dashboards" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperDashboards /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* Backup */}
      <Route path="/developer/backup/backups" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperBackups /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/backup/restore" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperRestore /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* API */}
      <Route path="/developer/api/docs" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperDocs /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/api/tokens" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperTokens /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* Notifications */}
      <Route path="/developer/notifications/templates" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperTemplates /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/notifications/bulk" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperBulk /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* Developer */}
      <Route path="/developer/database" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperDatabase /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/developer/settings" element={<PrivateRoute><ProtectedRoute><DeveloperLayout><DeveloperSettings /></DeveloperLayout></ProtectedRoute></PrivateRoute>} />
      {/* Templates Preview */}
      <Route path="/developer/templates/404" element={<Page404 />} />
      <Route path="/developer/templates/trial-end" element={<TrialEnd />} />
      <Route path="/developer/templates/subscription-end" element={<SubscriptionEnd />} />
      <Route path="/developer/templates/payment-reminder" element={<PaymentReminder />} />
      <Route path="/profile" element={<PrivateRoute><ProtectedRoute><AdminLayout><Profile /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/clients/add" element={<PrivateRoute><ProtectedRoute><AdminLayout><ClientAdd /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/sales/add" element={<PrivateRoute><ProtectedRoute><AdminLayout><SaleAdd /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/stock/add" element={<PrivateRoute><ProtectedRoute><AdminLayout><StockAdd /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/providers/add" element={<PrivateRoute><ProtectedRoute><AdminLayout><ProviderAdd /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/expenses/add" element={<PrivateRoute><ProtectedRoute><AdminLayout><ExpensesAdd /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      {/* keep backwards compatibility: direct /envios goes to tracking as well */}
      <Route path="/envios" element={<PrivateRoute><ProtectedRoute><AdminLayout><Tracking /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/envios/tracking" element={<PrivateRoute><ProtectedRoute><AdminLayout><Tracking /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/caja-diaria" element={<PrivateRoute><ProtectedRoute><AdminLayout><CajaDiaria /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/list" element={<PrivateRoute><ProtectedRoute><AdminLayout><RepairsList /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/add" element={<PrivateRoute><ProtectedRoute><AdminLayout><QuickRepairForm /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/quick-add" element={<PrivateRoute><ProtectedRoute><AdminLayout><QuickRepairForm /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/add-simple" element={<PrivateRoute><ProtectedRoute><AdminLayout><RepairAddSimple /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/edit/:id" element={<PrivateRoute><ProtectedRoute><AdminLayout><RepairEdit /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/budgets" element={<PrivateRoute><ProtectedRoute><AdminLayout><Budgets /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/budget-requests" element={<PrivateRoute><ProtectedRoute><AdminLayout><BudgetRequests /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/qr-scanner" element={<PrivateRoute><ProtectedRoute><AdminLayout><QRScanner /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reparaciones/qr-details/:order" element={<PrivateRoute><ProtectedRoute><AdminLayout><RepairQRDetails /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/billing/ARCA" element={<PrivateRoute><ProtectedRoute><AdminLayout><ARCA /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/billing/ARCA/iva" element={<PrivateRoute><ProtectedRoute><AdminLayout><ARCAIVA /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/billing/create" element={<PrivateRoute><ProtectedRoute><AdminLayout><CreateInvoice /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/iphone/sales" element={<PrivateRoute><ProtectedRoute><AdminLayout><IphoneSales /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/iphone/records" element={<PrivateRoute><ProtectedRoute><AdminLayout><IphoneRecords /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/iphone/insurance" element={<PrivateRoute><ProtectedRoute><AdminLayout><IphoneInsurance /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/iphone-canje" element={<PrivateRoute><ProtectedRoute><AdminLayout><IphoneCanje /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/iphone-canje/new" element={<PrivateRoute><ProtectedRoute><AdminLayout><CanjeNew /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/stock/iphone" element={<PrivateRoute><ProtectedRoute><AdminLayout><IPhoneInventoryList /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/stock/iphone-add" element={<PrivateRoute><ProtectedRoute><AdminLayout><IPhoneInventory /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/stock/iphone-insurance" element={<PrivateRoute><ProtectedRoute><AdminLayout><IPhoneInsurance /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/stock/repuestos" element={<PrivateRoute><ProtectedRoute><AdminLayout><StockRepuestos /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/stock/adjustments" element={<PrivateRoute><ProtectedRoute><AdminLayout><StockAdjustments /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/providers/orders" element={<PrivateRoute><ProtectedRoute><AdminLayout><OrdersList /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/providers/orders/add" element={<PrivateRoute><ProtectedRoute><AdminLayout><OrderForm /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/providers/orders/edit/:id" element={<PrivateRoute><ProtectedRoute><AdminLayout><OrderForm /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/providers/orders/:id" element={<PrivateRoute><ProtectedRoute><AdminLayout><OrderDetail /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/expenses/categories" element={<PrivateRoute><ProtectedRoute><AdminLayout><ExpensesCategories /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reports/sales" element={<PrivateRoute><ProtectedRoute><AdminLayout><ReportsSales /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reports/stock" element={<PrivateRoute><ProtectedRoute><AdminLayout><ReportsStock /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reports/financial" element={<PrivateRoute><ProtectedRoute><AdminLayout><ReportsFinancial /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/reports/repairs" element={<PrivateRoute><ProtectedRoute><AdminLayout><RepairsReport /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/envios/remises" element={<PrivateRoute><ProtectedRoute><AdminLayout><Remises /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><ProtectedRoute><AdminLayout><Notifications /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/docs" element={<PrivateRoute><ProtectedRoute><AdminLayout><Docs /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/help" element={<PrivateRoute><ProtectedRoute><AdminLayout><Help /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/whatsapp" element={<PrivateRoute><ProtectedRoute><AdminLayout><WhatsAppPage /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      <Route path="/costos-reparaciones" element={<PrivateRoute><ProtectedRoute><AdminLayout><RepairCosts /></AdminLayout></ProtectedRoute></PrivateRoute>} />
      {/* Presupuesto: sitio público trasplantado del presupuesto (tokens del sistema) */}
      <Route path="/presupuesto" element={<PresupuestoLayout />}>
        <Route index element={<ServicesPage />} />
        <Route path="servicios" element={<ServicesListPage />} />
        <Route path="valuacion" element={<PresupuestoFlow />} />
        <Route path="seguimiento" element={<TrackingPage />} />
        <Route path="atelier" element={<BookingPage />} />
        <Route path="legal/:slug" element={<LegalPage />} />
      </Route>
      {/* Ruta legacy del piloto: redirige a la página de valuación */}
      <Route path="/presupuesto-piloto" element={<Navigate to="/presupuesto/valuacion" replace />} />
      {/* Sitio público por empresa en dev: /presupuesto.<empresa>[/valuacion|...] */}
      <Route path="*" element={<PresupuestoTenantRoute />} />
    </Routes>
  )
}

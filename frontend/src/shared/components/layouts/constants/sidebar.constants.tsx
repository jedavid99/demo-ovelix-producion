import React from 'react';
import { Home, Users, Wrench, ShoppingCart, BarChart2, Box, Truck, Send, DollarSign, FileText, Calendar, TrendingUp, Smartphone, Shield, Package, List, Plus, Settings, ClipboardList, Receipt, Printer, Calculator } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';
import type { NavItem } from '../types/sidebar.types';

export const navItems: NavItem[] = [
  { title: 'PRINCIPAL', href: '#', children: [{ title: 'Dashboard', href: '/dashboard', icon: React.createElement(Home, { size: 18 }) }] },
  {
    title: 'VENTAS Y CLIENTES', href: '#', children: [
      { title: 'Clientes', href: '/clients', icon: React.createElement(Users, { size: 18 }), children: [
        { title: 'Listar Clientes', href: '/clients', icon: React.createElement(List, { size: 14 }) },
        { title: 'Agregar Cliente', href: '/clients/add', icon: React.createElement(Plus, { size: 14 }) },
      ]},
      { title: 'Ventas', href: '/sales', icon: React.createElement(ShoppingCart, { size: 18 }), children: [
        { title: 'Nueva Venta', href: '/sales/add', icon: React.createElement(Plus, { size: 14 }) },
        { title: 'Listar Ventas', href: '/sales', icon: React.createElement(List, { size: 14 }) },
        { title: 'Facturación', href: '/billing', icon: React.createElement(FileText, { size: 14 }) },
        { title: 'Caja Diaria', href: '/caja-diaria', icon: React.createElement(Calendar, { size: 14 }) },
      ]},
      { title: 'iPhone', href: '/iphone', icon: React.createElement(Smartphone, { size: 18 }), children: [
        { title: 'Ventas iPhone', href: '/iphone/sales', icon: React.createElement(ShoppingCart, { size: 14 }) },
        { title: 'Seguros', href: '/iphone/insurance', icon: React.createElement(Shield, { size: 14 }) },
        { title: 'Stock iPhone', href: '/stock/iphone', icon: React.createElement(Package, { size: 14 }) },
        { title: 'Programa de Canje', href: '/iphone-canje', icon: React.createElement(TrendingUp, { size: 14 }) },
      ]},
    ]
  },
  {
    title: 'SERVICIOS', href: '#', children: [
      { title: 'Reparaciones', href: '/reparaciones/list', icon: React.createElement(Wrench, { size: 18 }), children: [
        { title: 'Listar Reparaciones', href: '/reparaciones/list', icon: React.createElement(List, { size: 14 }) },
        { title: 'Nueva Reparación', href: '/reparaciones/add', icon: React.createElement(Plus, { size: 14 }) },
        { title: 'Presupuestos', href: '/reparaciones/budgets', icon: React.createElement(ClipboardList, { size: 14 }) },
      ]},
      { title: 'Costos de Reparación', href: '/costos-reparaciones', icon: React.createElement(Calculator, { size: 18 }) },
      { title: 'Envíos', href: '/envios', icon: React.createElement(Send, { size: 18 }), children: [
        { title: 'Seguimiento', href: '/envios/tracking', icon: React.createElement(List, { size: 14 }) },
        { title: 'Remises', href: '/envios/remises', icon: React.createElement(TrendingUp, { size: 14 }) },
      ]},
    ]
  },
  { title: 'COMUNICACIÓN', href: '#', children: [{ title: 'WhatsApp ', href: '/whatsapp', icon: React.createElement(BsWhatsapp, { size: 18 }) }] },
  {
    title: 'INVENTARIO', href: '#', children: [
      { title: 'Stock', href: '/stock', icon: React.createElement(Box, { size: 18 }), children: [
        { title: 'Listar Stock', href: '/stock', icon: React.createElement(List, { size: 14 }) },
        { title: 'Agregar Producto', href: '/stock/add', icon: React.createElement(Plus, { size: 14 }) },
        { title: 'Stock Repuestos', href: '/stock/repuestos', icon: React.createElement(Wrench, { size: 14 }) },
        { title: 'Ajustes de Stock', href: '/stock/adjustments', icon: React.createElement(Settings, { size: 14 }) },
      ]},
      { title: 'Proveedores', href: '/providers', icon: React.createElement(Truck, { size: 18 }), children: [
        { title: 'Listar Proveedores', href: '/providers', icon: React.createElement(List, { size: 14 }) },
        { title: 'Agregar Proveedor', href: '/providers/add', icon: React.createElement(Plus, { size: 14 }) },
        { title: 'Órdenes de Compra', href: '/providers/orders', icon: React.createElement(Receipt, { size: 14 }) },
      ]},
    ]
  },
  {
    title: 'FINANZAS', href: '#', children: [
      { title: 'Gastos', href: '/expenses', icon: React.createElement(DollarSign, { size: 18 }), children: [
        { title: 'Listar Gastos', href: '/expenses', icon: React.createElement(List, { size: 14 }) },
        { title: 'Registrar Gasto', href: '/expenses/add', icon: React.createElement(Plus, { size: 14 }) },
        { title: 'Categorías', href: '/expenses/categories', icon: React.createElement(Settings, { size: 14 }) },
      ]},
      { title: 'Reportes', href: '#', icon: React.createElement(BarChart2, { size: 18 }), children: [
        { title: 'Ventas', href: '/reports/sales', icon: React.createElement(TrendingUp, { size: 14 }) },
        { title: 'Stock', href: '/reports/stock', icon: React.createElement(Package, { size: 14 }) },
        { title: 'Financiero', href: '/reports/financial', icon: React.createElement(DollarSign, { size: 14 }) },
        { title: 'Reparaciones', href: '/reports/repairs', icon: React.createElement(Wrench, { size: 14 }) },
      ]},
      { title: 'ARCA', href: '/billing/ARCA', icon: React.createElement(FileText, { size: 18 }), children: [
        { title: 'Facturación Electrónica', href: '/billing/ARCA', icon: React.createElement(Printer, { size: 14 }) },
        { title: 'Libro de IVA', href: '/billing/ARCA/iva', icon: React.createElement(ClipboardList, { size: 14 }) },
      ]},
    ]
  },
];

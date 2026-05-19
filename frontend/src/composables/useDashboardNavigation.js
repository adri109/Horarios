import { BRAND } from '@/config/branding';

function readAuthContext() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const permissions = user.permissions || {};
    const isAdmin = user.role === 'ADMIN';
    return { permissions, isAdmin };
  } catch {
    return { permissions: {}, isAdmin: false };
  }
}

/**
 * Entradas del menú lateral / móvil (misma visibilidad que Sidebar_Element).
 */
export function getDashboardNavItems() {
  const { permissions, isAdmin } = readAuthContext();

  /** @type {{ to: string; label: string; exact?: boolean; icon: string }[]} */
  const raw = [
    { to: '/dashboard/resume', label: BRAND.dashboardLabel, exact: true, icon: 'panel' },
    { to: '/dashboard/citas', label: 'Citas', exact: true, icon: 'calendar' },
    {
      to: '/dashboard/clientes',
      label: 'Clientes',
      icon: 'clients',
      permission: 'canViewClients',
    },
    {
      to: '/dashboard/personal',
      label: 'Personal',
      icon: 'staff',
      permission: 'canViewPersonal',
    },
    {
      to: '/dashboard/servicios',
      label: 'Servicios',
      icon: 'services',
      permission: 'canViewServices',
    },
    {
      to: '/dashboard/inventario',
      label: 'Inventario',
      icon: 'inventory',
      permission: 'canViewInventory',
    },
    {
      to: '/dashboard/informes',
      label: 'Informes',
      icon: 'reports',
      permission: 'canViewReports',
    },
    {
      to: '/dashboard/marketing',
      label: 'Marketing',
      icon: 'marketing',
      permission: 'canViewMarketing',
    },
    { to: '/dashboard/configuracion', label: 'Configuración', icon: 'settings', requiresAdmin: true },
  ];

  return raw.filter((item) => {
    if (item.requiresAdmin && !isAdmin) return false;
    if (item.permission && !isAdmin && !permissions[item.permission]) return false;
    return true;
  });
}

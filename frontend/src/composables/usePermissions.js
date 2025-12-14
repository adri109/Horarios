import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export function usePermissions(requiredPermission = null) {
  const router = useRouter();

  const checkPermission = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const permissions = user.permissions || {};
    const isAdmin = user.role === 'ADMIN';

    // Si no se requiere permiso específico, permitir acceso
    if (!requiredPermission) {
      return true;
    }

    // Si es admin, permitir acceso a todo
    if (isAdmin) {
      return true;
    }

    // Verificar permiso específico
    const hasPermission = permissions[requiredPermission] === true;

    if (!hasPermission) {
      // Redirigir al dashboard principal si no tiene permiso
      router.push('/dashboard/resume');
      return false;
    }

    return true;
  };

  // Verificar permisos al montar el componente
  onMounted(() => {
    checkPermission();
  });

  return {
    checkPermission
  };
}

import { io } from 'socket.io-client';
import { onBeforeUnmount } from 'vue';
import { API_BASE_URL } from '@/config/api';

let socketInstance = null;

export function useSocket() {
  const token = localStorage.getItem('token');

  // Crear o reutilizar instancia del socket
  if (!socketInstance) {
    socketInstance = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
    });

    socketInstance.on('connect', () => {
      console.log('🔌 WebSocket conectado');
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 WebSocket desconectado');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Error de autenticación WebSocket:', error.message);
    });
  }

  // Limpiar al desmontar (solo si es la última referencia)
  onBeforeUnmount(() => {
    // No desconectar automáticamente, mantener la conexión activa
  });

  return {
    socket: socketInstance,
    emit: (event, data) => socketInstance.emit(event, data),
    on: (event, callback) => socketInstance.on(event, callback),
    off: (event, callback) => socketInstance.off(event, callback)
  };
}

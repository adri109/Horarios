import { io } from 'socket.io-client';
import { onBeforeUnmount } from 'vue';

let socketInstance = null;

export function useSocket() {
  const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Crear o reutilizar instancia del socket
  if (!socketInstance) {
    socketInstance = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('🔌 WebSocket conectado');
      if (user.id) {
        socketInstance.emit('join', user.id);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 WebSocket desconectado');
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

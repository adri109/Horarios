import { reactive, readonly } from 'vue';

const dialogState = reactive({
  isOpen: false,
  title: '',
  message: '',
  variant: 'alert',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  _resolver: null,
});

const openDialog = ({
  title,
  message,
  variant = 'alert',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
}) => {
  return new Promise((resolve) => {
    dialogState.title = title;
    dialogState.message = message;
    dialogState.variant = variant;
    dialogState.confirmText = confirmText;
    dialogState.cancelText = cancelText;
    dialogState.isOpen = true;
    dialogState._resolver = resolve;
  });
};

export const alertDialog = (message, title = 'Aviso') =>
  openDialog({
    title,
    message,
    variant: 'alert',
    confirmText: 'Entendido',
  });

export const confirmDialog = (message, title = 'Confirmación') =>
  openDialog({
    title,
    message,
    variant: 'confirm',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
  });

export const useDialog = () => {
  const confirm = () => {
    if (dialogState._resolver) {
      dialogState._resolver(true);
    }
    dialogState.isOpen = false;
    dialogState._resolver = null;
  };

  const cancel = () => {
    if (dialogState._resolver) {
      dialogState._resolver(false);
    }
    dialogState.isOpen = false;
    dialogState._resolver = null;
  };

  return {
    dialogState: readonly(dialogState),
    confirm,
    cancel,
  };
};

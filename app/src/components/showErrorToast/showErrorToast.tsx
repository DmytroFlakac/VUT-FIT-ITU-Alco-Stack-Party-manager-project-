import { toast, ToastOptions } from 'react-toastify';

export const showErrorToast = (message: string, options?: ToastOptions): void => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options,
    });
};

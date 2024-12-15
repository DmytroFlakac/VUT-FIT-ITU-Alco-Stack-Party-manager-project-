import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import { UserProvider } from "./Context/useAuth.tsx";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    return (
        <>
            <UserProvider>
                <Outlet />
                <ToastContainer style={{ zIndex: 10055 }}
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
            </UserProvider>
        </>
    );
};

export default App;

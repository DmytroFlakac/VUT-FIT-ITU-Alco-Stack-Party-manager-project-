import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import Disco from '../../assets/disco.svg';
import backgroundImage from '../../assets/backgroundFinal.svg';

import './LoginPage.css';

type LoginFormsInputs = {
    userName: string;
    password: string;
};

const validation = Yup.object().shape({
    userName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
    const { loginUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

    const handleLogin = (form: LoginFormsInputs) => {
        loginUser(form.userName, form.password);

    };



    return (
        <div className="container-fluid-login d-flex p-0 full-height-login"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',
             }}>
            <div className="video-left flex-grow-1">

            </div>
            <div
                className="container-fluid-login p-0 d-flex flex-column align-items-center custom-background square-container-login flex-grow-7">
                <div>
                    <img
                        src={Disco}
                        alt="Disco Icon"
                        className="party-icon-login"
                    />
                </div>
                <div
                    className="sign-in-card">
                    <div className="card-body p-5">
                        <h1 className="card-title-login mb-4 text-center">Sign in to your account</h1>
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <div className="mb-3">
                                <label htmlFor="username" className="UsernamePassword-login">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    autoComplete="username"
                                    className={`custom-input-login form-control ${errors.userName ? 'is-invalid-login' : ''}`}
                                    placeholder="Username"
                                    {...register("userName")}
                                />
                                {errors.userName && (
                                    <div className="invalid-feedback-login">{errors.userName.message}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="UsernamePassword-login">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    className={`custom-input-login form-control ${errors.password ? 'is-invalid-login' : ''}`}
                                    placeholder="••••••••"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <div className="invalid-feedback-login">{errors.password.message}</div>
                                )}
                            </div>
                            <button type="submit" className="confirm-button-login">Sign in</button>
                            <p className="text-center mt-3 text-dont-login">
                                Don't have an account yet?{" "}
                                <Link to={"/register"} className="text-signup-login">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
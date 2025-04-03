import { useContext } from "react";
import { useForm } from "../../../hooks/useForm";
import { Alert, Form, Input, Spinner } from "../../../ui";
import apiRequest from "../../../helpers/ApiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const validate = (values) => {
    const errors = {};
    if (!values.username.trim()) {
        errors.username = "El usuario es requerido.";
    }
    if (!/^(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/.test(values.password)) {
        errors.password = "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.";
    }
    return errors;
};

export const LoginPage = () => {
    const navigate = useNavigate();
    const { onLogin } = useContext(AuthContext);
    const [alert, setAlert] = useState({
        show: false,
        msg: ''
    });
    const [loading, setLoading] = useState(false); // Add loading state
    const { values, errors, handleChange, handleSubmit } = useForm(
        { username: "", password: "" },
        validate
    );

    const handleLogin = async () => {
        setLoading(true); // Show spinner
        const { status, data } = await apiRequest({
            path: 'users/login',
            method: 'post',
            data: values
        });

        setLoading(false); // Hide spinner
        if (status === 201) {
            const { password, ...userData } = data;
            onLogin(userData);
            navigate('/');
        } else {
            setAlert({
                show: true,
                msg: 'Credenciales inválidas'
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
                <p className="text-gray-600">Por favor, ingresa tus credenciales para continuar.</p>
            </div>
            <Form
                onSubmit={(e) => {
                    handleSubmit(e, () => {
                        handleLogin();
                    });
                }}
                submitText={loading ?  <Spinner /> : "Iniciar Sesión"} // Show spinner in button
                className="min-w-80 w-md bg-white p-6 rounded-lg shadow-md"
            >
                <Input
                    label="Usuario"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    required
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

                <Input
                    label="Contraseña"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    required
                    type="password"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </Form>
            {alert.show && (
                <div className="mt-4 w-full max-w-md">
                    <Alert
                        message={alert.msg}
                        type="error"
                        onClose={() => setAlert({
                            show: false,
                            msg: ''
                        })}
                    />
                </div>
            )}
        </div>
    );
};
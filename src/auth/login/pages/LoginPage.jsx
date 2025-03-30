import { useContext } from "react";
import { useForm } from "../../../hooks/useForm";
import { Alert, Form, Input } from "../../../ui";
import apiRequest from "../../../helpers/ApiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const validate = (values) => {
    const errors = {};
    if (!values.username.trim()) {
        errors.username = "El usuario no puede estar vacío.";
    }
    if (!/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)) {
        errors.password = "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.";
    }
    return errors;
};

export const LoginPage = () => {
    const navigate = useNavigate()
    const { onLogin } = useContext(AuthContext);
    const [alert, setAlert] = useState({
        show: false,
        msg: ''
    })
    const { values, errors, handleChange, handleSubmit } = useForm(
        { username: "", password: "" },
        validate
    );

    const handleLogin = async() => {
  

      const {status, data}  = await apiRequest({
            path: 'users/login',
            method: 'post',
            data: values
        })

        if (status === 201) {
            const {password, ...userData} = data;
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
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <Form
                onSubmit={(e) => {
                    handleSubmit(e, () => {
                        handleLogin();
                    });
                }}
                submitText="Iniciar Sessión"
                className=" min-w-80 w-md"
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
                    type='password'
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
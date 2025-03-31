
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import apiRequest from "../../helpers/ApiRequest";
import { Alert, Breadcrumb, Form, Input } from "../../ui";

export const UserAddPage = () => {
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
    const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
        { username: "", password: "", role: "admin" },
        validate
    );

    const [alert, setAlert] = useState({
        show: false,
        msg: '',
        type: 'error'
    })
 
    const onRegister = async () => {
        const { status } = await apiRequest({
            method: 'POST',
            path: 'users/register',
            data: values
        })
        if (status === 201) {
            setAlert(
                {
                    show: true,
                    msg: "Se registro correctamente el usuario.",
                    type: 'success'
                }
            )
            resetForm()
            
        }
        else {
            setAlert(
                {
                    show: true,
                    msg: "Error al registrar usuario.",
                    type: 'error'
                }
            )
        }
    }
    return (
        <div className="flex flex-col px-2 py-4">
        <Breadcrumb  items={[{ label: "Usuarios", href: "/users" }, { label: "Agregar usuario", href: '' }]} />

        <div className="flex flex-col items-center justify-center ">
        <Form
             onSubmit={(e) => {
                handleSubmit(e, () => {
                    onRegister();
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
                    type={alert.type}
                    onClose={() => setAlert({
                        show: false,
                        msg: '',
                        type: 'error'
                    })}
                />
            </div>
        )}
        </div>

    </div>);
}
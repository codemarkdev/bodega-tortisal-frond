import { data, href, useParams } from "react-router-dom";
import { Alert, Breadcrumb, Form, Input } from "../../ui";
import { useForm } from "../../hooks/useForm";
import apiRequest from "../../helpers/ApiRequest";
import { useState } from "react";
import { useEffect } from "react";


export const EditUserPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null)
    const [alert, setAlert] = useState({
        show: false,
        msg: '',
        type: 'error'
    })

    const validate = (values) => {
        const errors = {};
        if (!values.username.trim()) {
            errors.username = "El usuario es requerido.";
        }
        if (!/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)) {
            errors.password = "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter especial.";
        }
        return errors;
    };

    const { values, errors, handleChange, handleSubmit, setValues } = useForm(
        { username: "", password: "", role: "admin" },
        validate
    );

    const updateUser = async() => {
        const {data, status} = await apiRequest({
            method: 'PATCH',
            data: values, 
            path: `users/${id}`
        })
        if(status == 200){
            setAlert({
                show: true, 
                msg: 'Se actualizo con exito.',
                type: 'success'
            })
        }
        else{
            setAlert({
                show: true, 
                msg: 'Error al actualizar usuario.',
                type: 'error'
            })
        }

    }



    const getUserById = async (id) => {
        const { status, data } = await apiRequest({
            method: 'GET',
            path: `users/${id}`,
        })
        const { username} = data

        if(status == 200){
           setValues((prev) => ({
            ...prev, 
            username: username
           }))

           setUser(data)
        
        }
    

    }
    useEffect(() => {
        getUserById(id)

    }, [id]);


    return (
        <div className="flex flex-col px-2 py-4">
            <Breadcrumb items={[{ label: "Usuarios", href: "/users" }, { label: "Editar usuario", href: '' }]} />

            <div className="flex flex-col items-center justify-center ">

                {
                    (user !== null) ?
                        (
                            <Form
                                onSubmit={(e) => {
                                    handleSubmit(e, () => {
                                        updateUser();
                                    });
                                }}
                                submitText="Guardar"
                                className=" min-w-80 w-md mt-5" >
                                <Input
                                    label="Usuario"
                                    name="username"
                                    value={values.username}
                                    onChange={handleChange}
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

                            
                        ) :
                        (
                            <Alert type="error" message="No existe usuario con esos datos." />
                        )
                }
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
        </div>
    );
};
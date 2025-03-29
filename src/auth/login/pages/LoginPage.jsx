import { useForm } from "../../../hooks/useForm";
import { Input } from "../../../ui";

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
    const { values, errors, handleChange, handleSubmit } = useForm(
        { username: "", password: "" },
        validate
    );

    const onSubmit = () => {
        console.log("login", values);
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <form
                onSubmit={(event) => handleSubmit(event, onSubmit)}
                className=" bg-surface p-6 rounded shadow-md w-full max-w-sm"
            >
                <div className="mb-4">
                   <Input
                   label="Usuario"
                   name="username"
                   value={values.username}
                   onChange={handleChange}
                   required
                   />
                   {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-tortisal text-white py-2 px-4 rounded hover:bg-tortisal-200 focus:outline-none focus:ring-2 focus:ring-tortisal-200 focus:ring-offset-2"
                >
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
};
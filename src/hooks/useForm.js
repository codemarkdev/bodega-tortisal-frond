import { useState } from "react";

export const useForm = (initialValues = {}, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });

        if (validate) {
            const validationErrors = validate({ ...values, [name]: value });
            setErrors(validationErrors);
        }
    };

    const handleSubmit = (event, callback) => {
        event.preventDefault();
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0 && callback) {
                callback();
            }
        } else if (callback) {
            callback();
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        setValues,
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
    };
};


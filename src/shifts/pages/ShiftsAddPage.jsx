import { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import apiRequest from "../../helpers/ApiRequest";
import { Alert, Breadcrumb, Form, Input, Select } from "../../ui";
import { DatePicker } from "../../ui/components/DatePicker";


export const ShiftsAddPage = () => {
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const [listEmployees, setListEmployees] = useState([]);
    const validate = (values) => {
        const errors = {};
        if (!values.employee) {  
            errors.employee = "El campo empleado es requerido.";
        }
        return errors;  
    };

    const { values, errors, handleChange, handleSubmit, resetForm, setValues } = useForm(
        { employee: '' },  
        validate
    );

    const [alert, setAlert] = useState({
        show: false,
        msg: '',
        type: 'error'
    });

console.log('value', values)
    const onRegister = async () => {
        const { status, data } = await apiRequest({
            method: 'POST',
            path: 'shifts',
            data: {
                id_employee: Number(values.employee)
            }
        });
        if (status === 201) {
            setAlert({
                show: true,
                msg: "Se registró correctamente el turno del empleado.",
                type: 'success'
            });
            resetForm();
        } else {
            console.log('data', data)
            setAlert({
                show: true,
                msg: `${data?.message ? data.message : 'Error al registrar el turno del empleado'}`,
                type: 'error'
            });
        }
    };

    const getEmployee = async () => {
        const { data, status } = await apiRequest({
            method: 'GET',
            path: "employees?page=1&limit=10"
        });
        if (status === 200) {
            const formatSelectEmployee = data.data.map((item) => ({ 
                value: item?.id, 
                label: `${item?.firstname} ${item?.lastname}` 
            })).sort((a, b) => b.label.localeCompare(a.label))
            setListEmployees(formatSelectEmployee);
        } else {
            setListEmployees([]);
        }
    };

    useEffect(() => {
        getEmployee();
    }, []);

 
    

    return (
        <div className="flex flex-col px-2 py-4">
            <Breadcrumb items={[{ label: "Turnos", href: "/shifts" }, { label: "Agregar turno", href: '' }]} />

            <div className="flex flex-col items-center justify-center ">
                <Form
                    onSubmit={(e) => {
                        handleSubmit(e, () => {
                            onRegister();
                        });
                    }}
                    submitText="Nuevo turno"
                    className="min-w-80 w-md"
                >
                    <Select
                        options={listEmployees}
                        value={values.employee} 
                        onChange={handleChange}
                        label="Empleado"
                        id="employee"
                        name="employee" 
                        placeholder="Selecciona el empleado"
                        required
                        error={errors.employee}
                        helpText="Selecciona el empleado para asignar turno"
                        className="mb-6"
                    />
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
        
        </div>
    );
};
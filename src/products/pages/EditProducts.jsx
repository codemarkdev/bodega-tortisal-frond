import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Breadcrumb, Form, Input } from "../../ui";
import apiRequest from "../../helpers/ApiRequest";

export const EditProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
        purchase_price: 0,
        quantity: 0,
        is_consumable: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [alert, setAlert] = useState({
        show: false,
        msg: '',
        type: 'error'
    });

    // Validación del formulario
    const validateForm = () => {
        const errors = {};
        if (!formValues.name?.trim()) {
            errors.name = "El nombre del producto es requerido.";
        }
        if (formValues.purchase_price <= 0) {
            errors.purchase_price = "El precio de compra debe ser mayor que cero.";
        }
        if (formValues.quantity < 0) {
            errors.quantity = "La cantidad no puede ser negativa.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Obtener producto por ID
    const getProductById = async (id) => {
        setIsLoading(true);
        try {
            const response = await apiRequest({
                method: 'GET',
                path: `products/${id}`,
            });
            
            console.log("Respuesta de la API (GET):", response);
            
            if (response.status === 200) {
                const data = response.data;
                setProduct(data);
                
                // Actualizar los valores del formulario con los datos del producto
                setFormValues({
                    name: data.name || "",
                    description: data.description || "",
                    purchase_price: data.purchase_price || 0,
                    quantity: data.quantity || 0,
                    is_consumable: data.is_consumable || false
                });
            } else {
                setAlert({
                    show: true, 
                    msg: `Error al obtener información del producto: ${response.status}`,
                    type: 'error'
                });
            }
        } catch (error) {
            console.error("Error al obtener producto:", error);
            setAlert({
                show: true, 
                msg: 'Error al conectar con el servidor.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos del producto al iniciar
    useEffect(() => {
        if (id) {
            getProductById(id);
        }
    }, [id]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Para checkboxes, usamos el valor de "checked" en lugar de "value"
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormValues(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return; // Detener si hay errores
        }
        
        setIsLoading(true);
        
        try {
            // Convertir valores numéricos
            const dataToSend = {
                ...formValues,
                purchase_price: Number(formValues.purchase_price),
                quantity: Number(formValues.quantity)
            };
            
            console.log("Enviando datos:", dataToSend);
            
            const response = await apiRequest({
                method: 'PATCH',
                path: `products/${id}`,
                data: dataToSend
            });
            
            console.log("Respuesta de la API (PATCH):", response);
            
            if (response.status === 200) {
                setAlert({
                    show: true, 
                    msg: 'Producto actualizado con éxito.',
                    type: 'success'
                });
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate("/products");
                }, 2000);
            } else {
                setAlert({
                    show: true, 
                    msg: `Error al actualizar el producto: ${response.status}`,
                    type: 'error'
                });
            }
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            setAlert({
                show: true, 
                msg: 'Error al conectar con el servidor.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar y volver a la lista
    const handleCancel = () => {
        navigate("/products");
    };

    return (
        <div className="flex flex-col px-2 py-4">
            <Breadcrumb items={[
                { label: "Productos", href: "/products" }, 
                { label: "Editar producto", href: '' }
            ]} />

            <div className="flex flex-col items-center justify-center">
                {isLoading && <div className="text-center py-4">Cargando información del producto...</div>}
                
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
                
                {!isLoading && product ? (
                    <Form
                        onSubmit={handleSubmit}
                        submitText="Guardar Cambios"
                        className="min-w-80 w-md mt-5"
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nombre del producto
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                            />
                            {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                Descripción
                            </label>
                            <Input
                                id="description"
                                name="description"
                                value={formValues.description}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchase_price">
                                Precio de compra
                            </label>
                            <Input
                                id="purchase_price"
                                name="purchase_price"
                                type="number"
                                step="0.01"
                                value={formValues.purchase_price}
                                onChange={handleChange}
                            />
                            {formErrors.purchase_price && <p className="text-red-500 text-sm">{formErrors.purchase_price}</p>}
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                                Cantidad
                            </label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={formValues.quantity}
                                onChange={handleChange}
                            />
                            {formErrors.quantity && <p className="text-red-500 text-sm">{formErrors.quantity}</p>}
                        </div>
                        
                        <div className="mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_consumable"
                                    checked={formValues.is_consumable}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span className="text-gray-700 text-sm font-bold">Es consumible</span>
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                        </div>
                    </Form>
                ) : (
                    !isLoading && <Alert type="error" message="No existe producto con esos datos." />
                )}
            </div>
        </div>
    );
};
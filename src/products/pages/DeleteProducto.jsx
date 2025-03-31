import { useState } from "react";
import apiRequest from "../../helpers/ApiRequest";
import { Alert } from "../../ui";

export const DeleteProducto = ({ productId, productName, onCancel, onSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    
    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        
        try {
            // Aquí usamos el endpoint para productos, no el de usuarios
            const response = await apiRequest({
                method: "DELETE",
                path: `products/${productId}`
            });
            
            if (response.status === 200) {
                // Notificar al componente padre que la eliminación fue exitosa
                onSuccess();
            } else {
                setError(`Error al eliminar el producto: ${response.status}`);
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            setError("Error al conectar con el servidor");
        } finally {
            setIsDeleting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
                
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        className="mb-4"
                    />
                )}
                
                <p className="mb-6">
                    ¿Estás seguro de que deseas eliminar el producto <span className="font-bold">{productName || `ID: ${productId}`}</span>?
                    Esta acción no se puede deshacer.
                </p>
                
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
};
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Button, Modal } from "rsuite";
import apiRequest from "../../helpers/ApiRequest";
import { Alert, Breadcrumb, Form, History, Input, Table } from "../../ui";
import { toolsEmployeShift } from "../../../confiTable";
import { useForm } from "../../hooks/useForm";
import { FloatingAlert } from "../../ui/components/FlotingAlert";

export const ShiftToolsDetails = () => {
    const { idShift, idEmployee } = useParams();
    const  navigate = useNavigate()

    const [state, setState] = useState({
        modalVisible: false,
        selectedTool: null,
        tools: [],
        error: null
    });

    const [alertVisible, setAlertVisible] = useState(false);

    const validate = (values) => {
        const errors = {};
        const quantity = Number(values.quantityReturned);
        
        if (isNaN(quantity) || quantity < 0) {
            errors.quantityReturned = "La cantidad debe ser un número mayor a cero";
        } else if (state.selectedTool && quantity > (state.selectedTool.issued - state.selectedTool.returned)) {
            errors.quantityReturned = `No puede devolver más de ${state.selectedTool.issued - state.selectedTool.returned} unidades`;
        }
        
        return errors;
    };

    const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
        { quantityReturned: "" },
        validate
    );


    const getToolsEmployeeShift = useCallback(async () => {
        try {
            const { status, data } = await apiRequest({
                method: "GET",
                path: `tools-issued/employee/${idEmployee}/shift/${idShift}`,
            });

            if (status === 200) {
                const transformedData = data.tools.map(tool => ({
                    toolName: tool.product.name,
                    issued: tool.issued,
                    returned: tool.returned,
                    missing: tool.missing,
                    toolStatus: tool.status,
                    idProduct: Number(tool.product.id),
                    shiftId: Number(idShift)
                }));
                setState(prev => ({ ...prev, tools: transformedData, error: null }));
            } else {
                setState(prev => ({ ...prev, tools: [], error: "No se pudieron cargar las herramientas" }));
            }
        } catch (error) {
            setState(prev => ({ ...prev, tools: [], error: "Error al cargar las herramientas" }));
        }
    }, [idEmployee, idShift]);

    useEffect(() => {
        getToolsEmployeeShift();
    }, [getToolsEmployeeShift]);

    const handleToolReturn = async () => {
        if (!state.selectedTool) return;
        
        try {
          const {status, data} =  await apiRequest({
                method: "POST",
                path: `tools-issued/return/${state.selectedTool.shiftId}`, 
                data: {
                    tools: [{
                        productId: state.selectedTool.idProduct,
                        quantityReturned: Number(values.quantityReturned),
                        
                    }]
                }
            });
            
            // Actualizar la lista después de la devolución
            await getToolsEmployeeShift();

            if(status == 403){
                setState(prev => ({
                    ...prev,
                    error: data.message
                }));
                setAlertVisible(true); // Show alert
            }
            
            // Cerrar modal y resetear formulario
            setState(prev => ({ ...prev, modalVisible: false, selectedTool: null }));
            resetForm();
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: "Error al registrar la devolución"
            }));
            setAlertVisible(true); // Show alert
        }
    };

    const openReturnModal = (tool) => {
        setState(prev => ({
            ...prev,
            modalVisible: true,
            selectedTool: tool,
            error: null
        }));
    };

    const closeModal = () => {
        setState(prev => ({
            ...prev,
            modalVisible: false,
            selectedTool: null,
            error: null
        }));
        resetForm();
    };

    return (
        <>
            <Button type="ghost" onClick={() => navigate('/shifts')}>Regresar</Button>

            {alertVisible && state.error && (
                <FloatingAlert 
                 type="error"
                 message={`${state.error}`}
                 duration={5000}
                 position="top-center"
                 onClose={() => setAlertVisible(false)} // Close alert
             
             />
            )}

            <Table
                actions={[
                    {
                        label: 'Devolver herramienta',
                        icon: History,
                        onClick: openReturnModal,
                        disabled: (tool) => (tool.issued - tool.returned) <= 0
                    }
                ]}
                data={state.tools}
                columns={toolsEmployeShift}
            />

            <Modal
                open={state.modalVisible}
                onClose={closeModal}
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title>
                        Devolver {state.selectedTool?.toolName || 'herramienta'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => handleSubmit(e, handleToolReturn)}
                        submitText="Registrar Devolución"
                        onCancel={closeModal}
                    >
                        <Input
                            name="quantityReturned"
                            label={`Cantidad a devolver (Máx: ${state.selectedTool ? state.selectedTool.issued - state.selectedTool.returned : 0})`}
                            type="number"
                            min="1"
                            max={state.selectedTool ? state.selectedTool.issued - state.selectedTool.returned : undefined}
                            value={values.quantityReturned}
                            onChange={handleChange}
                            error={errors.quantityReturned}
                            autoFocus
                        />
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};
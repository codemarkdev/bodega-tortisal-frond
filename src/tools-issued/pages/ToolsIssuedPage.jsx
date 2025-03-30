import { toolsIssuedColumns } from "../../../confiTable";
import { Breadcrumb, Table } from "../../ui";
import { Edit, Trash } from "../../ui/icons";

export const ToolsIssuedPage = () => {

    const toolsIssuedData = [
        {
          id: 1,
          shift_info: "25/03/2024 - Juan Pérez",
          product_name: "Taladro eléctrico",
          product_description: "Taladro inalámbrico 18V",
          quantity_issued: 2,
          quantity_returned: 1,
          status: "Pendiente"
        },
        {
          id: 2,
          shift_info: "26/03/2024 - María García",
          product_name: "Martillo neumático",
          product_description: "Martillo para demolición 1500W",
          quantity_issued: 1,
          quantity_returned: 1,
          status: "Devuelto"
        },
        {
          id: 3,
          shift_info: "27/03/2024 - Carlos López",
          product_name: "Andamio modular",
          product_description: "Estructura de andamio 2x1m",
          quantity_issued: 3,
          quantity_returned: 0,
          status: "Pendiente"
        },
        {
          id: 4,
          shift_info: "28/03/2024 - Ana Rodríguez",
          product_name: "Cortadora de cerámica",
          product_description: "Cortadora manual para azulejos",
          quantity_issued: 1,
          quantity_returned: 1,
          status: "Devuelto"
        },
        {
          id: 5,
          shift_info: "29/03/2024 - Luis Fernández",
          product_name: "Generador eléctrico",
          product_description: "Generador diésel 5000W",
          quantity_issued: 1,
          quantity_returned: 0,
          status: "Pendiente"
        },
        {
          id: 6,
          shift_info: "30/03/2024 - Sofía Martínez",
          product_name: "Soldadora MIG",
          product_description: "Equipo de soldadura 250A",
          quantity_issued: 1,
          quantity_returned: 1,
          status: "Devuelto"
        },
        {
          id: 7,
          shift_info: "31/03/2024 - Pedro Sánchez",
          product_name: "Compactadora de suelo",
          product_description: "Placa vibratoria 100kg",
          quantity_issued: 1,
          quantity_returned: 0,
          status: "Pendiente"
        }
      ];

      const toolsIssuedActions = [
        {
          label: 'Editar',
          icon: Edit,
          onClick: (item) => console.log('Editar:', item.id),
 
        },
        {
          label: 'Eliminar',
          icon: Trash,
          onClick: (item) => console.log('Eliminar:', item.id),
          
        }
      ];
    return (
            <div className="flex flex-col px-2 py-4">
     <Breadcrumb items={[
        { label: "Herramientas emitidas", href: "/employees" },
      ]} />
    <Table
      title="Herramientas Asignadas"
      columns={toolsIssuedColumns}
      data={toolsIssuedData}
      actions={toolsIssuedActions}
      onAddClick={() =>{}}
      addButtonText="Nueva Asignación"
      itemsPerPage={5}
    />
       </div>
    );
}
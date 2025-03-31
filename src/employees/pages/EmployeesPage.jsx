import { columnsEmployees } from "../../../confiTable";
import { Table } from "../../ui";
import { Breadcrumb } from "../../ui/components/Breadcrumb ";

import { Trash, Edit } from "../../ui/icons";

const employeesData = [
    
  ];
export const EmployeesPage = () => {

    
      const actions = [
        {
          icon: Edit,
          label: 'Editar',
          onClick: (employee) => console.log('Editar empleado:', employee)
        },
        {
          icon: Trash,
          label: 'Eliminar',
          onClick: (employee) => console.log('Eliminar empleado:', employee)
        }
      ];

      const breadcrumbItems = [
        { label: "Empleados", href: "/employees" },
      ];
      return(

        <div className="flex flex-col px-2 py-4">
 <Breadcrumb items={breadcrumbItems} />


            <Table
            title="Lista de Empleados"
            columns={columnsEmployees}
            data={employeesData}
            actions={actions}
            onAddClick={() => console.log('Agregar nuevo empleado')}
            addButtonText="Nuevo Empleado"
            itemsPerPage={6} 
          />
        </div>
      )
    
}
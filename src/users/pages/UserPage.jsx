import { columnsUser } from "../../../confiTable";
import { Table } from "../../ui";
import { Breadcrumb } from "../../ui/components/Breadcrumb ";
import { Edit, Trash } from "../../ui/icons";

export const UserPage = () => {
    const usersData = [
        {
            id: 1,
            username: 'admin',
            role: 'Administrador',
            createdAt: '2023-01-15'
        },
        {
            id: 2,
            username: 'mgarciac',
            role: 'Gerente',
            createdAt: '2023-02-20'
        },
        {
            id: 3,
            username: 'jperez',
            role: 'Desarrollador Senior',
            createdAt: '2023-03-10'
        },
        {
            id: 4,
            username: 'amartinez',
            role: 'Desarrollador',
            createdAt: '2023-04-05'
        },
        {
            id: 5,
            username: 'crodriguez',
            role: 'Diseñador UX/UI',
            createdAt: '2023-05-12'
        },
        {
            id: 6,
            username: 'slopez',
            role: 'Analista de Datos',
            createdAt: '2023-06-18'
        },
        {
            id: 7,
            username: 'lhernandez',
            role: 'QA Tester',
            createdAt: '2023-07-22'
        },
        {
            id: 8,
            username: 'egomez',
            role: 'Soporte Técnico',
            createdAt: '2023-08-30'
        },
        {
            id: 9,
            username: 'psanchez',
            role: 'Marketing Digital',
            createdAt: '2023-09-05'
        },
        {
            id: 10,
            username: 'idiaz',
            role: 'Recursos Humanos',
            createdAt: '2023-10-15'
        }
    ];

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
        { label: "Usuarios", href: "/users" },
      ];
    return (
        <div className="flex flex-col px-2 py-4">
        <Breadcrumb items={breadcrumbItems} />
        <Table
            title="Gestión de Usuarios"
            columns={columnsUser}
            data={usersData}
            actions={actions}
            onAddClick={() => console.log('Agregar nuevo usuario')}
            addButtonText="Nuevo Usuario"
            itemsPerPage={6}
        /></div>);
}
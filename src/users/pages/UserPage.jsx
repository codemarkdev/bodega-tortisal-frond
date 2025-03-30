import { useState } from "react";
import { columnsUser } from "../../../confiTable";
import apiRequest from "../../helpers/ApiRequest";
import {Table } from "../../ui";
import { Breadcrumb } from "../../ui/components/Breadcrumb ";
import { Edit, Trash } from "../../ui/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
    const [listUser, setListUser] = useState([])
    const navigate = useNavigate()

    const getUsers = async() => {
      const {status, data} = await apiRequest({
            method: "GET",
            path: 'users'
        })
    setListUser(status === 200 ? data : [])
    }
    useEffect(() => {
      getUsers()
    }, []);
    const handleDelete = async (user) => {
        try {
            const { status } = await apiRequest({
                method: 'DELETE',
                path: `users/${user.id}`
            });
            
            if (status === 200) {
                
                await getUsers();
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };


    const handleEdit = (id) => {
     navigate(`/users/${id}`)
    }
    const actions = [
        {
            icon: Edit,
            label: 'Editar',
            onClick: (user) => handleEdit(user.id)
        },
        {
            icon: Trash,
            label: 'Eliminar',
            onClick: (user) => handleDelete(user)
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
            data={listUser}
            actions={actions}
            onAddClick={() => navigate('/users/add')}
            addButtonText="Nuevo Usuario"
            itemsPerPage={6}
        />
        
        </div>);
}
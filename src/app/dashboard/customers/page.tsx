"use client"
import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { useRouter } from 'next/navigation';
import { SignUpForm } from '@/components/auth/sign-up-form';

// import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { metadata } from './metadata';
import { getUsers, createUser } from '@/services/api';
import { User } from '@/services/api';

export default function Page(): React.JSX.Element {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // Estado para almacenar los usuarios obtenidos
  const router = useRouter();
  const page = 0;
  const rowsPerPage = 100;

  useEffect(() => {
    fetchUsers(); // Llamar a la función para obtener usuarios al montar el componente
  }, []); // Solo se ejecuta una vez al montar el componente

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers); // Actualizar el estado con los usuarios obtenidos
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      // Aquí puedes manejar el error según tu aplicación (mostrar un mensaje, etc.)
    }
  };

  const paginatedUsers = applyPagination(users, page, rowsPerPage);

  const handleClick = () => {
    setShowSignUpForm(true);
  };

  const handleClose = () => {
    setShowSignUpForm(false);
  };

  const handleUserCreated = async (name: string, surname: string, email: string, password: string) => {
    try {
      await createUser(name, surname, email, password);
      fetchUsers(); // Volver a cargar la lista de usuarios después de crear uno nuevo
      setShowSignUpForm(false); // Cerrar el formulario después de crear el usuario
      alert('Usuario creado exitosamente'); // Mostrar una alerta de éxito (puedes personalizar esto según tu UI)
    } catch (error) {
      console.error('Error al crear usuario:', error);
      // Aquí puedes manejar el error según tu aplicación (mostrar un mensaje, etc.)
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Participantes</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {/* <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button> */}
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleClick}>
            Add
          </Button>
        </div>
      </Stack>
      <Stack spacing={2}>
        {showSignUpForm && (
          <div>
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        )}
        {showSignUpForm && <SignUpForm onSubmit={handleUserCreated} />} {/* Pasar el manejador onSubmit al formulario */}
        {/* ... other component parts ... */}
      </Stack>
      {/* <CustomersFilters /> */}
      <CustomersTable
        count={paginatedUsers.length}
        page={page}
        rows={paginatedUsers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

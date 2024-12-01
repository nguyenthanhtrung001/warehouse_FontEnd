"use client";
import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosInstance';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Modal, TextField, TablePagination, IconButton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaTrash, FaLock, FaUnlock, FaSearch } from 'react-icons/fa';
import LockResetIcon from '@mui/icons-material/LockReset';
import Swal from 'sweetalert2';
import { useEmployeeStore } from "@/stores/employeeStore";

interface Role {
  name: string;
}

interface User {
  id: string;
  username: string;
  roles: Role[];
  isLocked?: boolean;
}

const API_BASE_URL = 'http://localhost:8888/v1/identity';

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email')
});

const AccountManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { employee } = useEmployeeStore();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: ''
    },
    resolver: yupResolver(schema),
  });

  const fetchUsers = async () => {
    if (!employee || !employee.warehouseId) return;
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users/employee/warehouse/${employee.warehouseId}`);
      if (usersResponse.data.code === 1000) {
        console.log("Data:",  usersResponse);
        setUsers(usersResponse.data.result);
        setFilteredUsers(usersResponse.data.result);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0);
  };

  const handleDelete = async (userId: string) => {
    const confirmDelete = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa tài khoản này?',
      text: "Thao tác này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
        Swal.fire({
          icon: 'success',
          title: 'Tài khoản đã được xóa thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
  
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          icon: 'error',
          title: 'Xóa tài khoản thất bại!',
          text: 'Vui lòng thử lại sau.',
        });
      }
    }
  };

  const toggleLockAccount = async (userId: string, isLocked: boolean) => {
    try {
      if (isLocked) {
        await axios.put(`${API_BASE_URL}/users/${userId}/unlock`);
        Swal.fire({
          icon: 'success',
          title: 'Tài khoản đã được mở khóa thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios.put(`${API_BASE_URL}/users/${userId}/lock`);
        Swal.fire({
          icon: 'success',
          title: 'Tài khoản đã bị khóa thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
  
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, isLocked: !isLocked } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error toggling account lock:", error);
      Swal.fire({
        icon: 'error',
        title: 'Thay đổi trạng thái tài khoản thất bại!',
        text: 'Vui lòng thử lại sau.',
      });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleResetPassword = async (user: User) => {
    const { value: newPassword } = await Swal.fire({
      title: `Nhập mật khẩu mới cho: ${user.username}`,
      input: 'password',
      inputLabel: 'Mật khẩu mới',
      inputPlaceholder: 'Nhập mật khẩu mới',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    });
  
    if (!newPassword) return; // Người dùng nhấn "Hủy" hoặc không nhập mật khẩu
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${user.id}/reset-password`,
        { newPassword }
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: response.data.result,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Đặt lại mật khẩu thất bại.',
      });
    }
  };
  
  return (
    <Box sx={{ padding: '32px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4a4a4a' }}>
          Quản lý tài khoản 
        </Typography>
      </Box>

      <TextField
        label="Tìm kiếm người dùng"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <FaSearch style={{ marginRight: '8px', color: '#1976d2' }} />
        }}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên người dùng</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Vai trò</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.roles[0].name}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <IconButton color={user.isLocked ? "default" : "warning"} onClick={() => toggleLockAccount(user.id, user.isLocked || false)}>
                      {user.isLocked ? <FaUnlock /> : <FaLock />}
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleResetPassword(user)}>
                      <LockResetIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                      <FaTrash />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[3, 5, 10]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default AccountManagement;

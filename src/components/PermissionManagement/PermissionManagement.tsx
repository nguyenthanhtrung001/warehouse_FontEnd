"use client";
import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosInstance';
import {
  Box, Grid, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Modal, TextField, TablePagination, IconButton, 
  FormControl, InputLabel, MenuItem, Select, Checkbox, FormControlLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaUserPlus, FaTrash, FaLock, FaUnlock, FaSearch } from 'react-icons/fa';
import LockResetIcon from '@mui/icons-material/LockReset';
import Swal from 'sweetalert2';


interface Permission {
  name: string;
  description: string | null;
}

interface Role {
  name: string;
  description: string;
  permissions: Permission[];
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
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  role: yup.string().required('Vui lòng chọn vai trò'),
});

const AccountManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [openRoleModal, setOpenRoleModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [tempPermissions, setTempPermissions] = useState<Permission[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
 
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // filter role
  const [selectedFilterRole, setSelectedFilterRole] = useState("MANAGER");
  //
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');



  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
    resolver: yupResolver(schema),
  });
  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users`);
      if (usersResponse.data.code === 1000) {
        setUsers(usersResponse.data.result);
        setFilteredUsers(usersResponse.data.result);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesResponse = await axios.get(`${API_BASE_URL}/roles`);
      if (rolesResponse.data.code === 1000) {
        setRoles(
          rolesResponse.data.result.filter((role: { name: string }) =>
            // role.name.toLowerCase() !== 'admin' && 
            role.name.toLowerCase() !== 'user'
          )
        ); }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const permissionsResponse = await axios.get(`${API_BASE_URL}/permissions`);
      if (permissionsResponse.data.code === 1000) {
        setPermissions(permissionsResponse.data.result);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, []);
  
 

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
    setSelectedUser(null);
    reset();
  };

  const openRoleModalHandler = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    setSelectedRole(role || null);
    if (role) setTempPermissions(role.permissions);
    setOpenRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
    setSelectedRole(null);
  };

  const onSubmit = (data: { name: string; email: string; role: string }) => {
    if (selectedUser) {
      const updatedUsers = users.map(user =>
        user.id === selectedUser.id ? { ...user, ...data } : user
      );
      setUsers(updatedUsers);
    } else {
      const newUser: User = { id: String(users.length + 1), username: data.name, roles: [] };
      setUsers([...users, newUser]);
    }
    setFilteredUsers(users);
    handleCloseUserModal();
  };

  const handleDelete = async (userId: string) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
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
        // Gọi API xóa tài khoản
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
        Swal.fire({
          icon: 'success',
          title: 'Tài khoản đã được xóa thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
  
        // Cập nhật danh sách người dùng sau khi xóa
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

  const handleOpenModal = (userId: string, currentRole: string) => {
    setSelectedUserId(userId);
    setNewRole(currentRole);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUserId(null);
    setNewRole('');
    setPassword('');
  };

  const handleRoleChange = async () => {
    // Kiểm tra nếu trường vai trò hoặc mật khẩu còn trống
    if (!newRole || !password) {
      handleCloseModal();
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng điền đầy đủ thông tin!',
        text: 'Hãy chọn vai trò mới và nhập mật khẩu để xác nhận.',
      });
      return;
    }
  
    if (!selectedUserId) return;
  
    try {
      // Đóng Modal trước khi gọi API và hiển thị thông báo thành công
      handleCloseModal();
      
      // Gọi API để cập nhật vai trò
      await axios.put(`${API_BASE_URL}/users/${selectedUserId}/roles`, {
        roles: [newRole], // Gửi danh sách các vai trò trong mảng
        password // Đảm bảo gửi mật khẩu nếu API yêu cầu xác nhận
      });
      
  
      Swal.fire({
        icon: 'success',
        title: 'Vai trò đã được cập nhật thành công!',
        showConfirmButton: false,
        timer: 1500,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật vai trò thất bại!',
        text: 'Vui lòng thử lại sau hoặc kiểm tra mật khẩu.',
      });
    }
  };
  
  
  

  const handleResetPassword = async (user: User) => {
    const newPassword = prompt(`Nhập mật khẩu mới cho: ${user.username}`);
    if (!newPassword) return;
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${user.id}/reset-password`,
        { newPassword }
      );
      alert(response.data.result); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Đặt lại mật khẩu thất bại.");
    }
  };

  const toggleLockAccount = async (userId: string, isLocked: boolean) => {
    try {
      if (isLocked) {
        // Nếu tài khoản đang bị khóa, gọi API mở khóa
        await axios.put(`${API_BASE_URL}/users/${userId}/unlock`);
        Swal.fire({
          icon: 'success',
          title: 'Tài khoản đã được mở khóa thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Nếu tài khoản chưa bị khóa, gọi API khóa tài khoản
        await axios.put(`${API_BASE_URL}/users/${userId}/lock`);
        Swal.fire({
          icon: 'success',
          title: 'Tài khoản đã bị khóa thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
  
      // Cập nhật trạng thái người dùng
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
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(value.toLowerCase()) &&
      (selectedFilterRole ? user.roles.some(role => role.name === selectedFilterRole) : true)
    );
    setFilteredUsers(filtered);
    setPage(0);
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const togglePermissionForRole = (permission: Permission) => {
    setTempPermissions(tempPermissions.some(p => p.name === permission.name)
      ? tempPermissions.filter(p => p.name !== permission.name)
      : [...tempPermissions, permission]
    );
  };

  const updateRolePermissions = async () => {
    if (selectedRole) {
      try {
        const payload = {
          role: selectedRole.name,
          permissions: tempPermissions.map((p) => p.name),
        };
        console.log("data update role: ", JSON.stringify(payload, null, 2));
  
        await axios.put(`${API_BASE_URL}/roles/${selectedRole.name}/permissions`, payload);
  
        setRoles(
          roles.map((role) =>
            role.name === selectedRole.name ? { ...role, permissions: tempPermissions } : role
          )
        );
  
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật quyền thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
  
        handleCloseRoleModal();
      } catch (error) {
        console.error("Error updating role permissions:", error);
  
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật quyền thất bại!',
          text: 'Vui lòng thử lại sau.',
        });
      }
    }
  };

  const handleFilterChange = (role: string) => {
    const filtered = role
      ? users.filter((user) => user.roles.some((r) => r.name === role))
      : users;
    setFilteredUsers(filtered);
  };
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) || 
    (permission.description && permission.description.toLowerCase().includes(permissionSearchTerm.toLowerCase()))
  );

  

  return (
    <Box sx={{ padding: '32px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4a4a4a' }}>
          Quản lý tài khoản
          
        </Typography>
        
        <FormControl variant="outlined" sx={{ minWidth: 220, mr: 10, alignSelf: 'flex-start' }}>


          <InputLabel>Lọc theo vai trò</InputLabel>
          <Select
            value={selectedFilterRole}
            onChange={(e) => {
              setSelectedFilterRole(e.target.value);
              handleFilterChange(e.target.value);
            }}
            label="Lọc theo vai trò"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.name} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 280 }}>
          <InputLabel>Chọn vai trò để cập nhật quyền</InputLabel>
          <Select
            value={selectedRole?.name || ''}
            onChange={(e) => openRoleModalHandler(e.target.value as string)}
            label="Chọn vai trò để cập nhật quyền"
          >
            {roles.map((role) => (
              <MenuItem key={role.name} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vai trò</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}></TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.roles.map(role => role.name).join(", ")}</TableCell>
                <TableCell>
              <Button variant="contained" onClick={() => handleOpenModal(user.id, user.roles[0]?.name || '')}>
                Thay đổi quyền
              </Button>
               </TableCell>
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
                    {/* <IconButton color="primary" onClick={() => openUserModalHandler(user)}>
                      <FaUserPlus />
                    </IconButton> */}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* Modal để thay đổi quyền và yêu cầu xác nhận mật khẩu */}
          <Modal open={openModal} onClose={handleCloseModal}>
    <Box sx={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 400, bgcolor: 'background.paper', borderRadius: 2, p: 4, boxShadow: 24
    }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Thay đổi quyền cho người dùng</Typography>
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <Select
          displayEmpty
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <MenuItem value="" disabled>
            Chọn vai trò mới
          </MenuItem>
          {roles.map((role) => (
            <MenuItem key={role.name} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <TextField
        fullWidth
        type="password"
        label="Xác nhận mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      /> */}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
          Hủy
        </Button>
        <Button variant="contained" color="primary" onClick={handleRoleChange}>
          Xác nhận
        </Button>
      </Box>
    </Box>
  </Modal>
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

      <Modal open={openRoleModal} onClose={handleCloseRoleModal}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        
        maxWidth: 600,
        bgcolor: '#ffffff',
        boxShadow: 3,
        p: 4,
        borderRadius: 2,
        maxHeight: '80vh',
        minHeight:'80vh',
        overflowY: 'auto'
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
          Cập nhật quyền cho vai trò: {selectedRole?.name}
        </Typography>

        {/* Thêm TextField để tìm kiếm */}
        <TextField
  label="Tìm kiếm quyền"
  variant="outlined"
  fullWidth
  value={permissionSearchTerm}
  onChange={(e) => setPermissionSearchTerm(e.target.value)}
  sx={{ mb: 2 }}
/>

        <Box sx={{
          maxHeight: 300,
          overflowY: 'auto', 
          paddingRight: 1,
        }}>
          <Grid container spacing={2}>
            {filteredPermissions.map(permission => (
              <Grid item xs={12} key={permission.name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempPermissions.some(p => p.name === permission.name)}
                      onChange={() => togglePermissionForRole(permission)}
                    />
                  }
                  label={`${permission.name} - ${permission.description || "Không có mô tả"}`}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            onClick={updateRolePermissions}
            variant="contained"
            sx={{
              backgroundColor: '#6A1B9A',
              color: 'white',
              '&:hover': {
                backgroundColor: '#4A148C',
              },
              mr: 1,
            }}
          >
            Cập nhật
          </Button>
          <Button onClick={handleCloseRoleModal} variant="outlined">
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
    </Box>
  );
};

export default AccountManagement;

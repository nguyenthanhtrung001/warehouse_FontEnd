"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Typography, message, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';

const { Title } = Typography;

// Định nghĩa kiểu cho Warehouse
interface Warehouse {
  id: number;
  warehouseName: string;
  location: string;
  capacity: number;
  phoneNumber?: string;
  email?: string;
  status?: number;
  note: string;
}

const WarehouseManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [warehouseList, setWarehouseList] = useState<Warehouse[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const { control, handleSubmit, reset, setValue } = useForm<Warehouse>();

  // Hàm để gọi API lấy danh sách warehouse
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get("http://localhost:8888/v1/api/warehouses");
        setWarehouseList(response.data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };
    fetchWarehouses();
  }, []);

  // Hàm hiển thị modal
  const showModal = (selectedWarehouse: Warehouse | null = null) => {
    setEditingWarehouse(selectedWarehouse);
    setIsModalVisible(true);

    if (selectedWarehouse) {
      setValue('warehouseName', selectedWarehouse.warehouseName);
      setValue('location', selectedWarehouse.location);
      setValue('capacity', selectedWarehouse.capacity);
      setValue('note', selectedWarehouse.note);
    } else {
      reset({
        warehouseName: '',
        location: '',
        capacity: 0,
        note: ''
      });
    }
  };

  // Hàm xử lý khi gửi form
  const handleFormSubmit = async (formData: Warehouse) => {
    try {
      if (editingWarehouse) {
        await axios.put(`http://localhost:8888/v1/api/warehouses/${editingWarehouse.id}`, formData);
        setWarehouseList((prevList) =>
          prevList.map((warehouse) =>
            warehouse.id === editingWarehouse.id ? { ...warehouse, ...formData } : warehouse
          )
        );
        notification.success({
          message: 'Cập Nhật Thành Công',
          description: 'Kho đã được cập nhật thành công!',
        });
      } else {
        const response = await axios.post("http://localhost:8888/v1/api/warehouses", formData);
        setWarehouseList((prevList) => [...prevList, response.data]);
        notification.success({
          message: 'Thêm Thành Công',
          description: 'Kho mới đã được thêm thành công!',
        });
      }
      setIsModalVisible(false);
      reset();
    } catch (error) {
      console.error("Error saving warehouse:", error);
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi lưu kho. Vui lòng thử lại!',
      });
    }
  };

  // Hàm xóa kho
  const deleteWarehouse = async (warehouseId: number) => {
    try {
      await axios.delete(`http://localhost:8888/v1/api/warehouses/${warehouseId}`);
      setWarehouseList((prevList) => prevList.filter((warehouse) => warehouse.id !== warehouseId));
      message.success('Xóa kho thành công');
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      message.error('Xóa kho thất bại');
    }
  };

  // Hàm cập nhật từ khóa tìm kiếm
  const updateSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  // Lọc danh sách kho theo từ khóa tìm kiếm
  const filteredWarehouseList = warehouseList.filter(
    (warehouse) =>
      warehouse.warehouseName.toLowerCase().includes(searchKeyword) ||
      warehouse.location.toLowerCase().includes(searchKeyword)
  );

  // Cấu hình các cột của bảng
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' as 'center' },
    { title: 'Tên Kho', dataIndex: 'warehouseName', key: 'warehouseName', align: 'center' as 'center' },
    { title: 'Vị Trí', dataIndex: 'location', key: 'location', align: 'center' as 'center' },
    { title: 'Sức Chứa', dataIndex: 'capacity', key: 'capacity', align: 'center' as 'center' },
    { title: 'Ghi Chú', dataIndex: 'note', key: 'note', align: 'center' as 'center' },
    {
      title: 'Hành Động',
      key: 'actions',
      align: 'center' as 'center',
      render: (_: any, warehouse: Warehouse) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(warehouse)}
            style={{ color: 'blue' }}
          >
            Chỉnh Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => deleteWarehouse(warehouse.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{
              style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' },
            }}
            cancelButtonProps={{
              style: { backgroundColor: '#d9d9d9', borderColor: '#d9d9d9', color: 'black' },
            }}
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={1} style={{ textAlign: 'left', marginBottom: '20px' }}>QUẢN LÝ KHO HÀNG</Title>
      
      <Input
        placeholder="Tìm kiếm kho hàng"
        prefix={<SearchOutlined />}
        onChange={updateSearchKeyword}
        style={{ marginBottom: '20px', width: '300px' }}
      />

      <Button
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: '20px', color: 'green' }}
      >
        Thêm Kho Mới
      </Button>

      <Table
        columns={columns}
        dataSource={filteredWarehouseList}
        rowKey="id"
        bordered
        style={{ marginTop: '20px' }}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingWarehouse ? 'Chỉnh Sửa Kho' : 'Thêm Kho Mới'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
          <Form.Item label="Tên Kho" required tooltip="Nhập tên kho duy nhất" >
            <Controller
              name="warehouseName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} placeholder="Nhập tên kho" />}
            />
          </Form.Item>
          <Form.Item label="Vị Trí" required tooltip="Xác định vị trí kho">
            <Controller
              name="location"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} placeholder="Nhập vị trí" />}
            />
          </Form.Item>
          <Form.Item label="Sức Chứa" tooltip="Xác định sức chứa tối đa (ví dụ: 1000)">
            <Controller
              name="capacity"
              control={control}
              render={({ field }) => <Input {...field} type="number" placeholder="Nhập sức chứa" />}
            />
          </Form.Item>
          <Form.Item label="Ghi Chú" tooltip="Ghi chú về kho">
            <Controller
              name="note"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nhập ghi chú" />}
            />
          </Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            <Button
              htmlType="submit"
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                color: 'white',
              }}
            >
              {editingWarehouse ? 'Cập Nhật' : 'Thêm'}
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default WarehouseManagement;

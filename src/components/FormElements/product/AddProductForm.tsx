import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import API_ROUTES from "@/utils/apiRoutes";
import Swal from "sweetalert2";
import { storage, ref, uploadBytes, getDownloadURL } from "@/utils/firebase"; // Import các hàm từ firebase
import { useEmployeeStore } from "@/stores/employeeStore";

interface Item {
  barcode: string;
  name: string;
  category: number;
  brand: number;
  location: string;
  costPrice: string;
  salePrice: number;
  stock: string;
  weight: number;
  directSale: boolean;
  description: string;
  images: string; // URL của ảnh
}

export default function AddItemForm() {
  const [item, setItem] = useState<Item>({
    barcode: "",
    name: "",
    category: 0,
    brand: 0,
    location: "",
    costPrice: "",
    salePrice: 0,
    stock: "",
    weight: 0,
    directSale: false,
    description: "",
    images: "",
  });

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null); // State để lưu trữ file ảnh
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.BRANDS);
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.PRODUCT_GROUPS);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      setItem({
        ...item,
        [name]: e.target.checked,
      });
    } else {
      setItem({
        ...item,
        [name]: type === "number" ? parseFloat(value) : value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUploadAndSubmit = async (): Promise<string | undefined> => {
    if (file) {
      // Sử dụng tên sản phẩm để đặt tên file ảnh
      const fileName = `MH_${item.name.replace(/\s+/g, '_')}_${file.name}`;
      const fileRef = ref(storage, `images/${fileName}`);
      
      try {
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        console.log("Download URL:", downloadURL); // Hoặc console.error nếu muốn giữ định dạng cũ
        setItem({ ...item, images: downloadURL });
        return downloadURL; // Trả về URL tải xuống
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Có lỗi xảy ra khi tải lên ảnh.");
        return; // Trả về undefined nếu có lỗi
      }
    }
  };
  
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const result = await Swal.fire({
      title: 'Xác nhận gửi',
      text: "Bạn có chắc chắn muốn thêm sản phẩm này không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, thêm!',
      cancelButtonText: 'Hủy bỏ',
    });
  
    if (result.isConfirmed) {
     
      if (!item.name || item.salePrice <= 0 || item.category === 0 || item.brand === 0) {
        toast.error("Vui lòng điền đầy đủ thông tin: Tên hàng, Giá bán, Nhóm hàng và Thương hiệu.");
        return;
      }
  
      const imageURL = await handleUploadAndSubmit();
    
      if (!imageURL) {
        toast.error("Vui lòng tải lên hình ảnh.");
        return;
      }
  
      console.log("Data to be sent to API: 9999");
      console.log({
        productName: item.name,
        weight: item.weight,
        description: item.description,
        productGroup: item.category,
        brand: item.brand,
        images: imageURL,
        prices: item.salePrice,
        employeeId: employee?.id,
      });
      try {
        const response = await axiosInstance.post(API_ROUTES.API_PRODUCTS, {
          productName: item.name,
          weight: item.weight,
          description: item.description,
          productGroup: item.category,
          brand: item.brand,
          images: imageURL,
          prices: item.salePrice,
          employeeId: employee?.id,
        });
  
       
        Swal.fire(
          'Thành công!',
          'Sản phẩm đã được thêm thành công!',
          'success'
        );
      } catch (error) {
        console.error("Error creating product:", error);
        Swal.fire(
          'Thất bại!',
          'Lỗi khi thêm sản phẩm. Vui lòng thử lại.',
          'error'
        );
      }
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-md shadow-xl text-black">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-2">
          <div className="col-span-1">
            <label className="block text-sm font-bold text-blue-800">Tên hàng</label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-bold text-blue-800">
              Giá bán
            </label>
            <input
              type="number"
              name="salePrice"
              value={item.salePrice}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold text-blue-800">
              Nhóm hàng
            </label>
            <select
              name="category"
              value={item.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            >
              <option value={0}>Chọn nhóm hàng</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-blue-800">
              Thương hiệu
            </label>
            <select
              name="brand"
              value={item.brand}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            >
              <option value={0}>Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-blue-800">
              Trọng lượng
            </label>
            <input
              type="number"
              name="weight"
              value={item.weight}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold text-blue-800">
              Hình ảnh
            </label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-blue-800">
            Mô tả
          </label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full px-3 py-2 rounded-md border-blue-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}

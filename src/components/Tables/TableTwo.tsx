// "use client";
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// import Container from 'react-bootstrap/Container'; // Container
// import Row from 'react-bootstrap/Row'; // Row
// import Col from 'react-bootstrap/Col'; // Col
// import Image from 'react-bootstrap/Image'; // Image
// import ListGroup from 'react-bootstrap/ListGroup'; // ListGroup
// import Button from 'react-bootstrap/Button'; // Button

// import { Product } from "@/types/product";
// import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";

// const TableProduct = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:8084/api/products');
//         const productList = await Promise.all(response.data.map(async (item: any) => {
//           const inventoryResponse = await axios.get(`http://localhost:8086/api/batch-details/quantity/${item.id}`);
//           const quantity = inventoryResponse.data.quantity;

//           return {
//             id: item.id,
//             image: "/images/product/product-01.png", // Đường dẫn ảnh giả định
//             name: item.productName,
//             category: item.productGroup ? item.productGroup.groupName : 'Unknown',
//             brandName: item.brand ? item.brand.brandName : 'Unknown',
//             price: item.price, // Giả định giá là trọng lượng, bạn có thể thay đổi theo yêu cầu
//             sold: quantity, // Số lượng tồn kho lấy từ API
//             profit: 0, // Giá trị giả định, thay đổi theo yêu cầu
//             description: item.description, // Thêm thuộc tính mô tả sản phẩm
//             weight: item.weight,
//           }; 
//         }));
//         setProducts(productList);
//       } catch (error) {
//         console.error("Error fetching products: ", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleProductClick = async (product: Product) => {
//     try {
//       if (selectedProduct && selectedProduct.id === product.id) {
//         setSelectedProduct(null); // Nếu sản phẩm đã được chọn, click lại để ẩn thông tin chi tiết
//       } else {
//         const inventoryResponse = await axios.get(`http://localhost:8086/api/batch-details/quantity/${product.id}`);
//         const quantity = inventoryResponse.data.quantity;

//         const updatedProduct = {
//           ...product,
//           sold: quantity
//         };
        
//         setSelectedProduct(updatedProduct);
//       }
//     } catch (error) {
//       console.error("Error fetching product details: ", error);
//     }
//   };

//   return (
//     <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//       <div className="px-4 py-6 md:px-6 xl:px-7.5">
//         <h4 className="text-xl font-semibold text-black dark:text-white">
//           Mặt hàng
//         </h4>
//       </div>
//       <Container>
//         <Row className="border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
//           <Col xs={4}> <p className="font-medium ml-7">Tên mặt hàng </p></Col>
//           <Col> <p className="font-medium">Nhóm hàng</p></Col>
//           <Col> <p className="font-medium">Thương hiệu</p></Col>
//           <Col> <p className="font-medium">Tồn kho</p></Col>
//           <Col> <p className="font-medium">Giá</p></Col>
//         </Row>
//       </Container>

//       {products.map((product, key) => (
//         <React.Fragment key={product.id}>
//           <Container>
//             <Row className="mb-2 border border-green-500 rounded-lg p-2">
//               <Col xs={4}>
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center" onClick={() => handleProductClick(product)}>
//                   <CheckboxTwo />
//                   <div className="h-12.5 w-15 rounded-md">
//                     <Image
//                       src={product.image}
//                       width={60}
//                       height={50}
//                       alt="Product"
//                     />
//                   </div>
//                   <p className="text-sm text-black dark:text-white mr-3">{product.name}</p>
//                 </div>
//               </Col>
//               <Col>
//                 <p className="text-sm text-black dark:text-white mt-2">{product.category}</p>
//               </Col>
//               <Col>
//                 <p className="text-sm text-black dark:text-white mt-2">{product.brandName}</p>
//               </Col>
//               <Col>
//                 <p className="text-sm text-black dark:text-white mt-2">{product.sold}</p>
//               </Col>
//               <Col>
//                 <p className="text-sm text-meta-3">{product.price} VND</p>
//               </Col>
//             </Row>
//           </Container>

//           {selectedProduct && selectedProduct.id === product.id && (
//             <div className="px-4 py-4.5 border-t border-stroke dark:border-strokedark md:px-6 2xl:px-7.5">
//               <Container>
//                 <Row>
//                   <Col>   
//                     <label className="mb-3 block font-medium text-blue-500 dark:text-white">
//                       {product.name}
//                     </label>
//                     <Row>
//                       <Image src="https://drinkocany.com/wp-content/uploads/2022/10/coca-bao-nhieu-calo.jpg" fluid />
//                     </Row>
//                   </Col>
//                   <Col xs={6}>
//                     <ListGroup>
//                       <ListGroup.Item className="mb-1">Mã mặt hàng: MH00{product.id}</ListGroup.Item>
//                       <ListGroup.Item>Nhóm mặt hàng: {product.category}</ListGroup.Item>
//                       <ListGroup.Item>Loại mặt hàng: Hàng hóa</ListGroup.Item>
//                       <ListGroup.Item>Thương hiệu: {product.brandName}</ListGroup.Item>
//                       <ListGroup.Item>Giá bán: {product.price} </ListGroup.Item>
//                       <ListGroup.Item>Trọng lượng: {product.weight}</ListGroup.Item>
//                       <ListGroup.Item>Vị trí: VT24</ListGroup.Item>
//                     </ListGroup>
//                   </Col>
//                   <Col>
//                     <div>
//                       <label className="mb-3 block text-sm font-medium text-black dark:text-white">
//                         Mô tả
//                       </label>
//                       <textarea
//                         rows={6}
//                         placeholder=""
//                         className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
//                       ></textarea>
//                     </div>
//                     <div>
//                       <label className="mb-3 block text-sm font-medium text-black dark:text-white">
//                         Lô hàng: BAC
//                       </label>
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row className="mt-3">
//                   <Col xs={6}></Col>
//                   <Col>
//                     <Button variant="success">Cập nhật</Button>{' '}
//                     <Button variant="danger">Ngừng kinh doanh</Button>{' '}
//                     <Button variant="danger">Xóa</Button>{' '}
//                   </Col>
//                 </Row>
//               </Container>
//             </div>
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// export default TableProduct;

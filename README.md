Chạy ứng dụng trong chế độ phát triển (development mode):
**npm run dev**

Khởi động ứng dụng trong chế độ sản xuất (production mode):
**npm run start**

Xây dựng ứng dụng để triển khai (build the application):
**npm run build**

-------------------------------------------------------------
Mô tả ứng dụng

4.2.1.1 Đăng nhập

![image](https://github.com/user-attachments/assets/1757d4bf-dbca-4e3c-839e-0a557871341c)

4.2.1.2 Trang chủ

Sau khi đăng nhập thành công, quản lý sẽ nhìn thấy tình hình tổng quan hoạt động của kho trong tháng hiện tại với các thông tin như: Doanh thu hiện tại trong tháng, số vốn bỏ ra để nhập hàng vào kho, số lượng các loại mặt hàng hiện có trong kho, các đơn trả hàng từ khách hàng trong tháng. Thống kê top hàng hóa hiện đang xuất bán nhiều nhất trong kho và hiển thị được hàng hóa hiện có số lượng tồn thấp.

![image](https://github.com/user-attachments/assets/f960e21a-2ed1-43b2-bffc-e13a4f68b276)

![image](https://github.com/user-attachments/assets/8e19e0bd-88fc-4e53-a08c-f7a0a9cb779d)

4.2.2.1 Mặt hàng

Trang hiển thị danh sách các mặt hàng hiện có trong kho, cung cấp các thông tin tổng quan như giá mặt hàng xuất kho và số lượng tồn kho hiện có. Hỗ trợ tìm kiếm các mặt hàng qua thanh tìm kiếm.

![image](https://github.com/user-attachments/assets/9905ea1d-5c54-4d1b-b694-2702e2f2e817)

Trang chi tiết mặt hàng cung cấp các thông tin chi tiết của mặt hàng, vị trí của mặt hàng được chứa trong kho.

 ![image](https://github.com/user-attachments/assets/71b7f782-b41c-4e26-81f2-b29db5ab20d0)

Chức năng thêm danh mục mặt hàng mới, thêm mặt hàng mới vào kho để kinh doanh và thông tin để nhập hàng vào kho.

![image](https://github.com/user-attachments/assets/0d9f2169-74ce-4656-bcab-587302c67759)

4.2.2.2 Kiểm kho

Trang danh sách các phiếu kiểm kho lưu trữ được thông tin của các quá trình kiểm kho hàng cung cấp thông tin tổng quan về ngày kiểm kho, sự chênh lệch số lượng giữa hệ thống với số lượng thực tế. Hỗ trợ lọc các phiếu kiểm trong khoảng thời gian hoặc tìm kiếm thông qua mã phiếu kiểm kho.

![image](https://github.com/user-attachments/assets/cbf4f536-58f2-465d-8032-cd0bdea78a69)

Trang chi tiết phiếu kiểm kho trình bày chi tiết về các mặt hàng có sự chênh lệch giữa thống kho và số lượng thực tế, đã được cập nhật về hệ thống tồn kho.

![image](https://github.com/user-attachments/assets/badf5a78-1ce8-4ef9-b628-2550e2d3b3de)

Giao diện tạo phiếu kiểm kho giúp nhân viên tạo ra các phiếu kiểm kho cập nhật về số lượng chênh lệch về hệ thống kho 
![image](https://github.com/user-attachments/assets/d71b952f-6ff1-414a-bfb9-dced633421ba)

4.2.2.3 Cập nhật giá

Trang cập nhật giá giúp cho quản lý cập nhật giá bán ra của từng mặt hàng nhất định. Hỗ trợ tìm kiếm theo mã mặt hàng và tên mặt hàng
![image](https://github.com/user-attachments/assets/d543e10c-c7f5-4a19-be6f-093307d20d20)

4.2.3.1 Đặt hàng

![image](https://github.com/user-attachments/assets/c9455733-411a-42a1-a306-97a3d09f7c0e)

Sau khi đơn hàng được đặt hành công, hệ thống chuyển đến trang xác nhận thanh toán
![image](https://github.com/user-attachments/assets/c2b881da-283c-4cae-ad7d-8526d24f885d)

![image](https://github.com/user-attachments/assets/31647fd8-040e-43a5-9c83-26e037c724cf)

Trang danh sách các đơn đặt hàng chưa được thanh toán của khách hàng gồm các thông tin cơ bản như tên khách hàng và tổng giá trị đơn hàng chờ được thanh toán. Hỗ trợ lọc theo khoảng thời gian, tìm kiếm theo mã phiếu đặt hoặc theo tên khách hàng

![image](https://github.com/user-attachments/assets/84d08d7b-427a-4388-a168-8ad2d8df68cb)

Trang chi tiết đơn đặt hàng cung cấp thông tin khách hàng và chi tiết các mặt hàng đã được đặt mua. Hỗ trợ hủy đơn hàng nếu khách hàng không thanh toán.

![image](https://github.com/user-attachments/assets/2065e59a-6d53-4f1a-af1e-5b06f24c07d7)

4.2.3.2 Danh sách hóa đơn

Trang danh sách hóa đơn hiển thị danh sách các đơn hàng đã được khách hàng thanh toán gồm các thông tin cơ bản như tên khách hàng và tổng giá trí hóa đơn, hỗ trợ lọc ra các hóa đơn theo khoảng thời gian, tìm kiếm theo mã hóa đơn hoặc theo tên của khách hàng trên hóa đơn

![image](https://github.com/user-attachments/assets/5793f4be-0602-4dde-be9a-b4653c74965d)

Trang chi tiết đơn hóa đơn cung cấp thông tin khách hàng và chi tiết các mặt hàng đã được thanh toán. Hỗ trợ yêu cầu trả đơn hàng xác nhận bởi nhân viên kho (hỗ trợ trả hàng 1 lần đối với 1 hóa đơn). 

![image](https://github.com/user-attachments/assets/23d1ab9b-6824-4c23-9fa6-a07fe6a22bab)

4.2.3.3 Trả hàng

![image](https://github.com/user-attachments/assets/1f122135-64b6-4df6-b221-a4a6e590a319)

4.2.3.4 Nhập hàng

![image](https://github.com/user-attachments/assets/39b6a977-9eee-4ade-b46d-bce1c34314ce)

![image](https://github.com/user-attachments/assets/4071e0f3-6c06-4e84-86df-e868a2ef30f0)

![image](https://github.com/user-attachments/assets/763ab5d5-f386-4bc4-a21f-9399ad826d9e)

![image](https://github.com/user-attachments/assets/b30d6694-8662-4965-a671-bad3b4c3ac7f)

4.2.3.5 Trả hàng nhập

![image](https://github.com/user-attachments/assets/a8804b07-a433-4d97-8699-6b6957835a1a)

Trang chi tiết phiếu xuất kho – trả nhà cung cấp: hiển thị chi tiết phiếu xuất và các mặt hàng xuất trả cho nhà cung cấp. Hỗ trợ hủy nếu có sai sót.

![image](https://github.com/user-attachments/assets/85bc8091-0281-445e-80c5-d11828f9d71d)

![image](https://github.com/user-attachments/assets/d39a573e-6672-4186-a320-776d383f725d)

4.2.3.6 Xuất hủy kho

![image](https://github.com/user-attachments/assets/acace26e-6dbf-48f1-8576-480709c2baae)

![image](https://github.com/user-attachments/assets/237b2362-edaa-4e1b-a462-0b16a5c33b1e)

![image](https://github.com/user-attachments/assets/0b6e11df-89d1-4c15-9c64-762668d60e27)

4.2.4.1 Khách hàng

Trang danh sách khách hàng: hiển thị các danh sách khách hàng đã mua hàng trên hệ thống bán hàng của kho, khi bấm chọn có thể xem chi tiết thông tin khách hàng. Hỗ trợ thêm mới khách hàng và cập nhật thông tin khách hàng.

![image](https://github.com/user-attachments/assets/6ddf2e9c-7be5-49d8-b69c-757c5fc7c5eb)

![image](https://github.com/user-attachments/assets/5f6d3cdb-2251-4e62-841e-4428182e5efe)

![image](https://github.com/user-attachments/assets/375424a0-9ab6-4789-8df0-c9a0911abef7)

4.2.4.2 Nhà cung cấp

![image](https://github.com/user-attachments/assets/c2e5204f-5673-4684-a036-844eaff8e9e3)

![image](https://github.com/user-attachments/assets/292cd4b1-11e0-4325-9677-b83d675f90ea)

4.2.5 Nhân viên

![image](https://github.com/user-attachments/assets/16680609-5bca-488e-9760-6c64753ecd16)

![image](https://github.com/user-attachments/assets/bc0cf076-dae8-41c4-988d-9e85c647d1a7)

![image](https://github.com/user-attachments/assets/8a30019f-90b1-47df-8ed6-5efdbc9d2098)

4.2.5.2 Lịch làm việc nhân viên

![image](https://github.com/user-attachments/assets/1189c82a-b01c-4028-9877-be964eff898e)

![image](https://github.com/user-attachments/assets/b66585f1-4de5-4a17-a599-1f60a8295d13)

![image](https://github.com/user-attachments/assets/0528c84a-7597-4312-8149-03c7012a34d5)

![image](https://github.com/user-attachments/assets/8b3db067-f8ad-4a96-99a0-88efd3bdc0ea)

![image](https://github.com/user-attachments/assets/4cb47828-638b-4e2e-9085-d37e26bb54c4)

![image](https://github.com/user-attachments/assets/6a15c108-23d9-41b8-b42c-0c2e8c722c4b)

4.2.5.3 Bảng tính lương

![image](https://github.com/user-attachments/assets/22a35f6d-8dff-4732-9643-2dd983af8b3a)

![image](https://github.com/user-attachments/assets/0c052fbc-e0fb-484f-8d30-0cecb9e65d38)

![image](https://github.com/user-attachments/assets/c2aa1cb0-e840-4bf6-83bb-4061c118b14b)

![image](https://github.com/user-attachments/assets/3a9798b9-7107-4e4c-9db3-828548465ca2)

4.2.5.4 Thiết lập chung cấu hình lương

![image](https://github.com/user-attachments/assets/dd6e1634-fbaa-4603-9aca-3495ca64f4cf)

4.2.6.1 Tồn kho

![image](https://github.com/user-attachments/assets/5090f422-ae09-4470-9897-7abf27bffffe)

4.2.6.2 Chi tiết nhập kho – xuất kho

![image](https://github.com/user-attachments/assets/99c6a104-36b4-4ceb-b10f-14f0a8b19324)











































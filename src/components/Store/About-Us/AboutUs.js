"use client";
import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Phần tiêu đề */}
      <section className="text-center my-8">
        <h1 className="text-4xl font-bold text-green-800">Về Chúng Tôi</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Chào mừng bạn đến với trang web của chúng tôi! Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm tốt nhất với các sản phẩm chất lượng cao và dịch vụ tuyệt vời.
        </p>
      </section>

      {/* Phần hình ảnh giới thiệu */}
      <section className="my-12">
        <img
          src="https://via.placeholder.com/1200x500"
          alt="About Us"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </section>

      {/* Phần sứ mệnh & tầm nhìn */}
      <section className="my-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Sứ Mệnh</h2>
          <p className="text-gray-700">
            Chúng tôi hướng tới việc mang lại những sản phẩm chất lượng cao nhất, đáp ứng nhu cầu đa dạng của khách hàng. Sứ mệnh của chúng tôi là tạo ra trải nghiệm mua sắm dễ dàng, tiện lợi và hài lòng cho mọi người.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Tầm Nhìn</h2>
          <p className="text-gray-700">
            Chúng tôi mong muốn trở thành thương hiệu hàng đầu trong lĩnh vực thương mại điện tử, mang đến giải pháp mua sắm đáng tin cậy và nhanh chóng cho khách hàng trên khắp cả nước.
          </p>
        </div>
      </section>

      {/* Phần đội ngũ */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Đội Ngũ Của Chúng Tôi</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/200"
              alt="Team Member 1"
              className="w-40 h-40 object-cover rounded-full mx-auto"
            />
            <h3 className="text-xl font-semibold text-gray-900 mt-4">Nguyễn Thành Trung</h3>
            <p className="text-gray-600">Giám Đốc Điều Hành</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/200"
              alt="Team Member 2"
              className="w-40 h-40 object-cover rounded-full mx-auto"
            />
            <h3 className="text-xl font-semibold text-gray-900 mt-4">Trần Thị B</h3>
            <p className="text-gray-600">Trưởng Phòng Kinh Doanh</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/200"
              alt="Team Member 3"
              className="w-40 h-40 object-cover rounded-full mx-auto"
            />
            <h3 className="text-xl font-semibold text-gray-900 mt-4">Lê Văn C</h3>
            <p className="text-gray-600">Quản Lý Sản Phẩm</p>
          </div>
        </div>
      </section>

      {/* Phần lời cam kết */}
      <section className="my-12 bg-green-800 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Lời Cam Kết Của Chúng Tôi</h2>
        <p className="text-lg max-w-2xl mx-auto text-center">
          Chúng tôi cam kết mang đến sản phẩm và dịch vụ tốt nhất cho khách hàng, từ khâu lựa chọn sản phẩm đến dịch vụ sau bán hàng. Mỗi khách hàng là một người bạn đồng hành, và chúng tôi sẽ luôn nỗ lực để mang lại sự hài lòng tối đa.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;

import { z } from "zod";

const statusMap: Record<number, string> = {
  0: "vừa tạo",
  1: "đã nhận đơn hàng",
  2: "đang trong quá trình giặt",
  3: "đã hoàn thành",
  4: "đã hủy đơn hàng",
  // Bạn có thể thêm các giá trị khác nếu cần
};
const deliveryStatusMap: Record<number, string> = {
  0: "nhận hàng trực tiếp",
  1: "đang chuẩn bị",
  2: "đang trong quá trình giao",
  3: "đã hoàn thành"
  // Bạn có thể thêm các giá trị khác nếu cần
};

const deliveryTypeMap: Record<number, string> = {
  1: "giao hàng tận nơi",
  2: "nhận hàng trực tiếp",
  // Bạn có thể thêm các giá trị khác nếu cần
};

export const Order = z.object({
  orderId: z.number(),
  orderDate: z.string(),
  note: z.string(),
  deadline: z.string(),
  customerId: z.number(),
  status: z.number().transform((val) => statusMap[val] || "khác"), // Sử dụng object map để chuyển đổi
  deliveryTypeId: z.number().transform((val) => deliveryTypeMap[val] ||"khác"),
  deliveryStatus: z.number().transform((val) => deliveryStatusMap[val] ||"khác"),
  phoneNumber: z.string(),
  address: z.string()
});
export const OrderRes =z.object({
  data: Order,
  message: z.string()
})

export const OrdersRes = z.object({
  data: z.array(Order), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});


export const OrderCreateBody = z.object({
  orderDate: z.string(),
  customerId: z.number().optional(),
  note: z.string(),
  deadline: z.string(),
  deliveryTypeId: z.number(),
  phoneNumber: z.string().optional(), // Cập nhật kiểu để cho phép undefined
  address: z.string()
});


export const OrderDetail= z.object({
serviceName: z.string(),
amount: z.number(),
price: z.number()
})
export const OrderDetailRes = z.object({
  data: z.array(OrderDetail), // Thay đổi từ z.object() thành z.array(Order)
  message: z.string()
});

export type CreateOrderBodyType = z.TypeOf<typeof OrderCreateBody>
export type OrdersResType = z.TypeOf<typeof OrdersRes>
export type OrderResType = z.TypeOf<typeof OrderRes>
export type OrderDetailResType = z.TypeOf<typeof OrderDetailRes>



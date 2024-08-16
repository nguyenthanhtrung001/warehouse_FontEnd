import z, { date } from 'zod'

export const RegisterBody = z
  .object({
    username: z.string().email(),
    password: z.string().min(6).max(100),
    role: z.number().default(1),
  })
  .strict()
  
  

  export type RegisterBodyType = z.TypeOf<typeof RegisterBody>
  

  export const RegisterRes = z.object({
  data: z.object({
    token: z.string(),
    expiresAt: z.string(),
    username: z.string(),
    userId: z.number()
    })
  ,
  message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginBody = z
  .object({
    username: z.string(),
    password: z.string().min(6).max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = RegisterRes

export type LoginResType = z.TypeOf<typeof LoginRes>


// Định nghĩa schema cho CustomerRes
export const CustomerRes = z.object({
  
  data: z.object({
      id: z.number(),
      name: z.string(),
      address: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
      hobbie: z.string(),
      avatar: z.string(),
      username: z.string(),
      rankId: z.number() // Sử dụng optional nếu giá trị có thể là null hoặc undefined
    }),
    message: z.string()
});
export type CustomerResType = z.infer<typeof CustomerRes>;

 
// Định nghĩa schema cho StaffRes
export const StaffRes = z.object({
  data: z.object({
      id: z.number(),
      name: z.string(),
      position: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
      avatar: z.string(),
      username: z.string(),
    }),
    message: z.string()
});
export type StaffResType = z.infer<typeof StaffRes>;

// export const UserRes = z
//   .object({
//     data: z.object({
//     username: z.string()
//     }),
//     message: z.string()
//   })

// export type UserResType = z.TypeOf<typeof UserRes>

export const RoleRes = z
  .object({
    data:z.number(),
    message: z.string()
  }).strict()
  export type RoleResType = z.TypeOf<typeof RoleRes>

  export const MessageRes = z
  .object({
    message: z.string()
  })
  .strict()

export type MessageResType = z.TypeOf<typeof MessageRes>
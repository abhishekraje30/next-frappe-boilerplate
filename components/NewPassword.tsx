"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "antd"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { resetPassword } from "actions/verification-token"
import { SIGN_IN } from "configs/constants"
import CustomPasswordInput from "./FormInputs/CustomPasswordInput"
import { useState } from "react"
const NewPasswordSchema = zod
  .object({
    password: zod
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(16, { message: "Password must be at most 16 characters" }),
    password_confirmation: zod.string(),
  })
  .refine((fieldsData) => fieldsData.password === fieldsData.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  })

export default function NewPassword({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  })

  const onSubmit = async (data: zod.infer<typeof NewPasswordSchema>) => {
    setIsLoading(true)
    await resetPassword(email, data.password)
    router.push(SIGN_IN)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-300 p-6 shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <CustomPasswordInput name="password" control={control} label="Password" />
        <CustomPasswordInput name="password_confirmation" control={control} label="Confirm password" />
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </form>
    </div>
  )
}

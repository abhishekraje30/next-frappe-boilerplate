"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "antd"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as zod from "zod"
import { verifyEmailandGenerateToken } from "actions/verification-token"
import AlertNotification from "components/AlertNotification"
import CustomTextInput from "components/FormInputs/CustomInput"

const resetPasswordSchema = zod.object({
  email: zod.string().email({
    message: "Please enter a valid email address",
  }),
})

export default function ResetPassword() {
  const [status, setStatus] = useState<string | null>("")
  const [message, setMessage] = useState<string | null>("")
  const [isPending, setIsPending] = useState(false)
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit: SubmitHandler<zod.infer<typeof resetPasswordSchema>> = async (values) => {
    setStatus("")
    setMessage("")
    setIsPending(true)
    const response = await verifyEmailandGenerateToken(values.email)
    if (response.status === "success") {
      setStatus("success")
      setMessage("Go to your registered email to reset your password")
    } else {
      setStatus("error")
      setMessage(response.message)
    }
    setIsPending(false)
  }

  return (
    <div className="mx-auto mt-4 w-1/2 rounded-2xl border border-gray-300 p-4 shadow-md">
      <h1 className="text-center text-lg font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomTextInput
            name="email"
            control={control}
            label="Email"
            type="email"
            placeholder="Enter your registered email"
          />
        </div>
        <AlertNotification message={message} status={status} />
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={isPending}>
            Verify Email
          </Button>
        </div>
      </form>
    </div>
  )
}

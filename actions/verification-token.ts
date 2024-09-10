"use server"
import { v4 as uuid } from "uuid"
import { adminApiClient } from "./axios-clients"
import { updateData } from "./crud-actions"
import { getUser } from "./user-actions"

export const verifyEmailandGenerateToken = async (email: string) => {
  try {
    const response = await adminApiClient.get(`/document/User/${email}`)
    if (response.status !== 200) {
      return { status: "error", message: "User not found" }
    }
    const token = uuid()
    // Token will expire in 1 hour
    const expiresDatetime = new Date(Date.now() + 3600 * 1000)
    const expiresDate = expiresDatetime.toISOString().split("T")[0]
    const expiresTime = expiresDatetime.toLocaleTimeString([], { hour12: false })
    const expires = `${expiresDate} ${expiresTime}`
    const updateResponse = await adminApiClient.put(`/document/NextAuthUser/${email}`, {
      password_reset_token: token,
      expires_on: expires,
    })
    if (updateResponse.status !== 200) {
      return { status: "error", message: "Failed to send verification email" }
    }
    return { status: "success", message: "Token generated successfully", token }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return { status: "error", message: "User not found" }
    }
    return { status: "error", message: "Something went wrong!" }
  }
}

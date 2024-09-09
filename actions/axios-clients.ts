"use server"
import axios from "axios"
import { getFrappeToken } from "actions/frappe-key-secret"

// Create and configure your API client
export const getApiClient = async () => {
  const token = await getFrappeToken()
  const apiClient = axios.create({
    baseURL: process.env.FRAPPE_BASE_URL,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })

  return apiClient
}

export const adminApiClient = axios.create({
  baseURL: process.env.FRAPPE_BASE_URL,
  maxBodyLength: Infinity,
  headers: {
    "Content-Type": "application/json",
    Authorization: `token ${process.env.FRAPPE_ADMIN_AUTH_KEY}:${process.env.FRAPPE_ADMIN_AUTH_SECRET}`,
  },
})

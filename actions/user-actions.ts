"use server"

import { getApiClient } from "./axios-clients"

export const getUsers = async () => {
  const apiClient = await getApiClient()

  const response = await apiClient.get(`/document/User?fields=["*"]`)
  if (response.status === 200) {
    return response.data.data
  }

  return []
}

export const getUser = async (userId: string) => {
  try {
    const apiClient = await getApiClient()
    const response = await apiClient.get(`/document/User/${userId}`)
    if (response.status === 200) {
      return response.data.data
    }
    // If status is not 200, return null or handle as needed
    return null
  } catch (error) {
    return null
  }
}

export const fetcher = async (url: string) => {
  try {
    const apiClient = await getApiClient()
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    throw error
  }
}

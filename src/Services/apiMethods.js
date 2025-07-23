import axiosInstance from './axios'

export const postRequest = async (url, data, token = null) => {
  try {
    const response = await axiosInstance.post(url, data, {
      headers: {
        'x-access-token': token,
      },
    })
    return response.data
  } catch (error) {
    throw error.response?.data || 'Error during POST request'
  }
}

export const getRequest = async (url, token = null) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        'x-access-token': token,
      },
    })
    return response.data
  } catch (error) {
    throw error.response?.data || 'Error during GET request'
  }
}

export const putRequest = async (url, data, token = null, headers = {}) => {
  try {
    const response = await axiosInstance.put(url, data, {
      headers: {
        ...headers,
        'x-access-token': token,
      },
    })
    return response.data
  } catch (error) {
    throw error.response?.data || 'Error during PUT request'
  }
}

export const deleteRequest = async (url, data, token = null) => {
  try {
    const response = await axiosInstance.delete(url, {
      headers: {
        'x-access-token': token,
      },
      data: data // This is how you pass data in the body of a DELETE request
    })
    return response.data
  } catch (error) {
    throw error.response?.data || 'Error during DELETE request'
  }
}

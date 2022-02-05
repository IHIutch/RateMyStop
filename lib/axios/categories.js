import axios from 'redaxios'

export const getCategories = async (params = null) => {
  try {
    const { data } = await axios.get(`/api/v1/categories`, {
      params,
    })
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getCategory = async (id) => {
  try {
    const { data } = await axios.get(`/api/v1/categories/${id}`)
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const postCategory = async (payload) => {
  try {
    const { data } = await axios.post(`/api/v1/categories`, { payload })
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const putCategory = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/v1/categories/${id}`, { payload })
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const deleteCategory = async (id) => {
  try {
    const { data } = await axios.delete(`/api/v1/categories/${id}`)
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

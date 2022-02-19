import axios from 'redaxios'

export const getAnswers = async (params = null) => {
  try {
    const { data } = await axios.get(`/api/v1/answers`, {
      params,
    })
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

export const getAnswer = async (id) => {
  try {
    const { data } = await axios.get(`/api/v1/answers/${id}`)
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

export const postAnswer = async (payload) => {
  try {
    const { data } = await axios.post(`/api/v1/answers`, { payload })
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

export const putAnswer = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/v1/answers/${id}`, { payload })
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

export const deleteAnswer = async (id) => {
  try {
    const { data } = await axios.delete(`/api/v1/answers/${id}`)
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

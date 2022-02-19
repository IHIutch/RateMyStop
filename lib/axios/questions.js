import axios from 'redaxios'

export const getQuestions = async (params = null) => {
  try {
    const { data } = await axios.get(`/api/v1/questions`, {
      params,
    })
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}
export const getQuestion = async (id) => {
  try {
    const { data } = await axios.get(`/api/v1/questions/${id}`)
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}
export const postQuestion = async (payload) => {
  try {
    const { data } = await axios.post(`/api/v1/questions`, { payload })
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}
export const putQuestion = async (id, payload) => {
  try {
    const { data } = await axios.put(`/api/v1/questions/${id}`, { payload })
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

export const deleteQuestion = async (id) => {
  try {
    const { data } = await axios.delete(`/api/v1/questions/${id}`)
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

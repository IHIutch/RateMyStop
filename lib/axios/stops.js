import axios from 'redaxios'

export const getStops = async (params = null) => {
  try {
    const data = await axios.get(`/api/v1/stops`, {
      params,
    })
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const getStop = async (id) => {
  try {
    const data = await axios.get(`/api/v1/stops/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const postStop = async (payload) => {
  try {
    const data = await axios.post(`/api/v1/stops`, { payload })
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const putStop = async (id, payload) => {
  try {
    const data = await axios.put(`/api/v1/stops/${id}`, { payload })
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteStop = async (id) => {
  try {
    const data = await axios.delete(`/api/v1/stops/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

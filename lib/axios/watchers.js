import axios from 'redaxios'

export const getWatchers = async (params = null) => {
  try {
    const data = await axios.get(`/api/v1/watchers`, {
      params,
    })
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const getWatcher = async (id) => {
  try {
    const data = await axios.get(`/api/v1/watchers/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const postWatcher = async (payload) => {
  try {
    const data = await axios.post(`/api/v1/watchers`, { payload })
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const putWatcher = async (id, payload) => {
  try {
    const data = await axios.put(`/api/v1/watchers/${id}`, { payload })
    return data
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteWatcher = async (id) => {
  try {
    const data = await axios.delete(`/api/v1/watchers/${id}`)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

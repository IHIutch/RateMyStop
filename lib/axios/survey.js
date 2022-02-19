import axios from 'redaxios'

export const postSurvey = async (stopId, payload) => {
  try {
    const { data } = await axios.post(`/api/v1/survey/${stopId}`, payload)
    return data
  } catch (err) {
    throw new Error(err.data.error)
  }
}

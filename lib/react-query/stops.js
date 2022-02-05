import { useQuery } from 'react-query'
import { getStop, getStops } from '../axios/stops'

export const useGetStops = (params = null) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['stops', params],
    async () => await getStops(params)
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

export const useGetStop = (id) => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['stops', id],
    async () => await getStop(id),
    {
      enabled: !!id,
    }
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
  }
}

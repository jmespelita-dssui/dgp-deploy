import { initializeAxiosInstance } from './axiosUtils'

export const dataverseSearch = async () => {
  //systemuserid
  const axiosInstance = await initializeAxiosInstance()
  const userNamePromise = await axiosInstance.get(`systemusers(${userID})`)
  return userNamePromise.data.fullname
}

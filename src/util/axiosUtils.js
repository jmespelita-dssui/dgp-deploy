import axios from 'axios'
import { Providers } from '@microsoft/mgt-element'
import msalInstance from 'src/msalConfig'

export const getAccessToken = async () => {
  const provider = Providers.globalProvider
  if (provider && provider.state === 2) {
    // const accessToken = await provider.getAccessToken()
    // return accessToken
    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['https://org2f29bfe1.crm4.dynamics.com/.default'],
      })
      // console.log(response.accessToken)
      return response.accessToken
    } catch (error) {
      console.error('Error acquiring token:', error)
    }
  } else {
    console.error('User is not signed in.')
  }
}

export const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: 'https://org2f29bfe1.crm4.dynamics.com/api/data/v9.2/',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

import axios from 'axios'
import { Providers } from '@microsoft/mgt-element'
import msalInstance from 'src/msalConfig'

export const getAccessToken = async () => {
  const provider = Providers.globalProvider
  if (provider && provider.state === 2) {
    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['https://orgac85713a.crm4.dynamics.com/.default'],
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

export const getAccessTokenForGraph = async () => {
  const provider = Providers.globalProvider
  // console.log('getting access token for graph')
  if (provider && provider.state === 2) {
    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read.All'], // Microsoft Graph API scope
      })
      return response.accessToken
    } catch (error) {
      console.error('Error acquiring token for Microsoft Graph:', error)
    }
  } else {
    console.error('User is not signed in.')
  }
}

export const createAxiosInstance = (token) => {
  const axiosInstance = axios.create({
    baseURL: 'https://orgac85713a.crm4.dynamics.com/api/data/v9.2/',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  return axiosInstance
}

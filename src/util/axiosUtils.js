import axios from 'axios'
import { Providers, ProviderState } from '@microsoft/mgt-element'
import msalInstance from 'src/msalConfig'
import { InteractionRequiredAuthError } from '@azure/msal-browser'

let interactionInProgress = false

export async function getAccessToken() {
  const account = msalInstance.getActiveAccount()
  if (!account) throw new Error('No active account')

  try {
    const res = await msalInstance.acquireTokenSilent({
      scopes: ['https://orgac85713a.crm4.dynamics.com/.default'],
      account,
    })
    return res.accessToken
  } catch (e) {
    if (e.errorCode === 'interaction_required' && !interactionInProgress) {
      interactionInProgress = true
      await msalInstance.acquireTokenRedirect({
        scopes: ['https://orgac85713a.crm4.dynamics.com/.default'],
      })
    }
    throw e
  }
}

export const getAccessTokenForGraph = async () => {
  const provider = Providers.globalProvider
  if (provider && provider.state === 2) {
    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read.All', 'Group.Read.All', 'Directory.Read.All'],
      })
      return response.accessToken
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        console.warn('Interaction required, falling back to popup...')
        try {
          const response = await msalInstance.acquireTokenPopup({
            scopes: ['User.Read.All', 'Group.Read.All', 'Directory.Read.All'],
          })
          return response.accessToken
        } catch (popupError) {
          console.error('Popup failed:', popupError)
        }
      } else {
        console.error('Silent token acquisition error:', error)
      }
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

export const initializeAxiosInstance = async () => {
  try {
    const token = await getAccessToken()
    return createAxiosInstance(token)
  } catch (error) {
    console.error('Cannot get access token.')
  }
}

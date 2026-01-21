import { LogLevel, PublicClientApplication } from '@azure/msal-browser'
import { Msal2Provider } from '@microsoft/mgt-msal2-provider'
import { Providers } from '@microsoft/mgt-element'
import { CustomGraph } from './util/customGraph'
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
// console.log('Crypto subtle:', window.crypto, window.crypto.subtle) // Check if it's available in production

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MSAL_CLIENT_ID,
    authority: process.env.REACT_APP_MSAL_AUTHORITY,
    redirectUri: 'http://localhost:3000',
    // redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URI,
    // scopes: 'https://orgac85713a.crm4.dynamics.com/.default',
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
            return
          default:
            return
        }
      },
    },
  },
}

const msalInstance = new PublicClientApplication(msalConfig)

Providers.globalProvider = new Msal2Provider({
  scopes: [
    'calendars.read',
    'user.read',
    'openid',
    'profile',
    'people.read',
    'user.readbasic.all',
    'presence.read',
    'user.readwrite',
    'group.read.all',
    'directory.read.all',
  ],
  publicClientApplication: msalInstance,
})

Providers.globalProvider.graph = new CustomGraph(Providers.globalProvider)

export default msalInstance

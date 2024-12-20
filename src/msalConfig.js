import { LogLevel, PublicClientApplication } from '@azure/msal-browser'
import { Msal2Provider } from '@microsoft/mgt-msal2-provider'
import { Providers } from '@microsoft/mgt-element'
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */

const msalConfig = {
  auth: {
    clientId: 'b781906d-dabc-418d-b1e6-cca04e3ad35f',
    authority: 'https://login.microsoftonline.com/organizations',
    redirectUri: 'http://localhost:3000',
    scopes: 'https://orgac85713a.crm4.dynamics.com/.default',
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
  ],
  publicClientApplication: msalInstance,
})

export default msalInstance

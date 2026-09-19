// export const authConfig= {
//   clientId: 'oauth2-pkce-client',
//   authorizationEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/auth',
//   tokenEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/token',
//   redirectUri: 'http://localhost:5173',
//   scope: 'openid profile email offline_access',
//   onRefreshTokenExpire: (event) => event.logIn(),
// }


export const authConfig = {
  clientId: 'oauth2-pkce-client',

  authorizationEndpoint:
    `${import.meta.env.VITE_KEYCLOAK_URL}/realms/fitness-app/protocol/openid-connect/auth`,

  tokenEndpoint:
    `${import.meta.env.VITE_KEYCLOAK_URL}/realms/fitness-app/protocol/openid-connect/token`,

  redirectUri: window.location.origin,

  scope: 'openid profile email offline_access',

  onRefreshTokenExpire: (event) => event.logIn(),
};
import auth0 from 'auth0-js';
import config from './config';
class Auth {
/**
 * A class to help with the authentication workflow
 * We use auth0.WebAuth to create an new Auth instance
 * with our Auth0 values and important configuration
 */
    constructor() {
    this.auth0 = new auth0.WebAuth(config);
  }

  getProfile = () => {
    return this.profile;
  }

  getIdToken = () => {
    return this.idToken;
  }

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession = (authResult, step) => {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire at
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
  }

  signOut = () => {
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: 'VU7BwQHJMEKXU6UjVQ6MzYzYtuetkkAv',
    });
  }

  silentAuth = () => {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }

  isAuthenticated = () => {
    return new Date().getTime() < this.expiresAt;
  }

  signIn = () => {
    this.auth0.authorize();
  }

  signOut = () => {
    // clear id token, profile, and expiration
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
  }
}

const auth0Client = new Auth();

export default auth0Client;
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import {ERROR_MESSAGE} from '../event-types';


/**
 * @param {Element} idInput input form of id
 * @param {Element} passwordInput input form of password
 */
export function authorize(idInput, passwordInput) {
  const validation = (input) => {
    return new Promise((res, rej) => {
      if (input.value === '') {
        rej(new Error(`${input.name} is empty`));
      }
      res();
    });
  };

  const id = idInput.value;
  const password = passwordInput.value;
  return Promise.all([validation(idInput), validation(passwordInput)])
    .then(() => axios.get(`/api/auth/token/${id}`, {headers: {'X-Account': `${id} ${password}`}}))
    .then(resp => window.localStorage.setItem('token', resp.data.token));
};


/**
 * @returns {string} get jwt encoded token
 */
export function getAuthToken() {
  return localStorage.getItem('token');
}

export function clearAuthToken() {
  window.localStorage.removeItem('token');
}


function isTokenProvided(token) {
  if (!token) return false;
  return true;
}


function isExpired(decodedToken) {
  const unixStyleNow = Math.floor(new Date().getTime() / 1000) ;
  return decodedToken.exp <= unixStyleNow;
}


const {AUTHORIZATION} = ERROR_MESSAGE;


/**
 * check a token is valid.
 * @param {string} token jwt encoded token
 * @returns {Tuple.<boolean,string>} left value is "is authorized", and right value is message "why failed to authorize"
 */
export function isTokenValid(token) {
  if (!isTokenProvided(token)) {
    console.info(AUTHORIZATION.NOT_AUTHORIZED);
    return [false, AUTHORIZATION.NOT_AUTHORIZED];
  }
  let jwt;
  try {
    jwt = jwtDecode(token);
  } catch (e) {
    console.info(AUTHORIZATION.BROKEN_TOKEN);
    return [false, AUTHORIZATION.BROKEN_TOKEN];
  }
  if (isExpired(jwt)) {
    console.info(AUTHORIZATION.EXPIRED, new Date(jwt.exp));
    return [false, AUTHORIZATION.EXPIRED];
  }

  return [true, null];
}

/**
 * @returns {Tuple.<boolean,string>} left value is "is authorized", and right value is message "why failed to authorize"
 */
export function isAuthorized() {
  const token = getAuthToken();
  return isTokenValid(token)[0];
}

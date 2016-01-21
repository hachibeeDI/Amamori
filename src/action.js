import axios from 'axios';

import {getAuthToken, isTokenValid} from './util/auth';


export function EventHandler(func) {
  return (ctx, component) => {
    return (...args) => {
      return func.call('do not use "this"', ctx, component.props, component.state, ...args);
    };
  };
}


/**
 * @param {string} [baseURL=/api/] api baseURL
 * @param {string} [tokenField=X-Account-Token] http header field of authorization token
 * @returns {Tuple.<axios,Error>} axios and error
 */
export function authorizedRequest(baseURL = '/api/', tokenField = 'X-Account-Token') {
  const token = getAuthToken();
  const [isValid, err] = isTokenValid(token);
  if (!isValid) {
    return [null, new Error(err)];
  }
  return [axios.create({baseURL: baseURL, headers: {[tokenField]: token}}), null];
}

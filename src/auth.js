"use strict";

const _ = require('private-parts').createKey();

const Call = require("./apiCall");
const objects = require("./objects");
const CONT_TYPES = require("./callTypes");
const GRANT_TYPES = require("./grantTypes");

class ChinoAPIAuth {
  /** Create a caller for Authentication Chino APIs
   *  This class is used to authenticate application users
   *
   * @param baseUrl            {string}  The url endpoint for APIs
   * @param applicationId      {string}  The Chino application id
   * @param applicationSecret  {string}  The Chino application key
   */
  constructor(baseUrl, applicationId, applicationSecret) {
    this.baseUrl = baseUrl;

    if (!baseUrl || !applicationId || !applicationSecret) {

      const err = {
        message : "Impossible to create an Auth object without credentials or base url",
        data : null,
        result : "error",
        result_code : 400
      }
      throw new objects.ChinoException(err);
    }

    _(this).applicationId = applicationId;
    // select between basic or bearer auth
    _(this).applicationSecret = applicationSecret;

    this.call = new Call(baseUrl, _(this).applicationId, _(this).applicationSecret);
  }

  /** Authenticate user through username and password
   *  and if successful return a access token
   *
   * @param username    {string}
   * @param password    {string}
   * @returns {Promise.<objects.Auth, objects.ChinoException>}
   *         A promise that return a Auth object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  login(username, password) {
    const form = {
      grant_type : GRANT_TYPES.PASSWORD,
      username : username,
      password : password
    }

    return this.call.post(`/auth/token/`, form, CONT_TYPES.FORM_DATA)
        .then((result) => objects.checkResult(result, "Auth"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Authenticate user through code returned at redirectUlr
   *  from Chino login service
   *
   * @param code           {string}
   * @param redirectUrl    {string}
   * @returns {Promise.<objects.Auth, objects.ChinoException>}
   *         A promise that return a Auth object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  loginWithCode(code, redirectUrl) {
    const form = {
      grant_type : GRANT_TYPES.AUTH_CODE,
      code: code,
      redirect_uri: redirectUrl,
      client_id: _(this).applicationId,
      client_secret: _(this).applicationSecret,
      scope: "read write"
    }

    return this.call.post(`/auth/token/`, form, CONT_TYPES.FORM_DATA)
        .then((result) => objects.checkResult(result, "Auth"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Get a new token using a old token
   *
   * @param token           {string}
   * @returns {Promise.<objects.Auth, objects.ChinoException>}
   *         A promise that return a Auth object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  refreshToken(token) {
    const form = {
      grant_type : GRANT_TYPES.RFS_TOKEN,
      token : token,
      client_id: _(this).applicationId,
      client_secret: _(this).applicationSecret,
    }

    return this.call.post(`/auth/token/`, form, CONT_TYPES.FORM_DATA)
        .then((result) => objects.checkResult(result, "Auth"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Revoke token authorization
   *
   * @param token           {string}
   * @returns {Promise.<objects.Success, objects.ChinoException>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  logout(token) {
    const form = {
      grant_type : "revoke",
      token : token,
      client_id: _(this).applicationId,
      client_secret: _(this).applicationSecret,
    }

    return this.call.post(`/auth/revoke_token/`, form, CONT_TYPES.FORM_DATA)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }
}

module.exports = ChinoAPIAuth;
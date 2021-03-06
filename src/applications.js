"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIApplication extends ChinoAPIBase {
  /** Create a caller for Applications Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return the list of existing applications
   *
   * @param offset {int}
   * @param limit  {int}
   * @return {Promise.<Object, objects.ChinoException>}
   *         A promise that return a list of Application object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   *
   */
  list(offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/auth/applications`, params)
        .then((result) => objects.checkListResult(result, "applications", "Application"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Create a new application
   *
   * @param data          {object}
   * @return {Promise.<objects.Application, objects.ChinoException>}
   *         A promise that return a Application object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/auth/applications`, data)
        .then((result) => objects.checkResult(result, "Application"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Return information about application selected by its id
   *
   * @param applicationId  {string}
   * @return {Promise.<objects.Application, objects.ChinoException>}
   *         A promise that return a Application object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  details(applicationId) {
    return this.call.get(`/auth/applications/${applicationId}`)
        .then((result) => objects.checkResult(result, "Application"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Update information about application selected by its id
   *  with data as new application information
   *
   * @param applicationId  {string}
   * @param data           {object}
   * @return {Promise.<objects.Application, objects.ChinoException>}
   *         A promise that return a Application object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  update(applicationId, data) {
    return this.call.put(`/auth/applications/${applicationId}`, data)
        .then((result) => objects.checkResult(result, "Application"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Delete application selected by its id
   *
   * @param applicationId {string}
   * @return {Promise.<objects.Success, objects.ChinoException>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  delete(applicationId) {
    return this.call.del(`/auth/applications/${applicationId}`)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }
}

module.exports = ChinoAPIApplication;
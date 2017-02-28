/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIGroups extends ChinoAPIBase {
  /** Create a caller for Groups Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return the list of existing groups
   *
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Group object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   *
   */
  list() {
    let groups = [];

    return this.call.get(`/groups`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.groups.forEach((gInfo) => {
              let gData = {
                data : {
                  group : gInfo
                },
                result_code : result.result_code
              };

              groups.push(new objects.Group(gData));
            })

            return groups;
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Create a new group
   *
   * @param data          {object}
   * @return {Promise.<objects.Group, objects.Error>}
   *         A promise that return a Group object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/groups`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Group(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Return information about group selected by its id
   *
   * @param groupId  {string}
   * @return {Promise.<objects.Group, objects.Error>}
   *         A promise that return a Group object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  details(groupId) {
    return this.call.get(`/groups/${groupId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Group(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Update information about group selected by its id
   *  with data as group information
   *
   * @param groupId  {string}
   * @param data     {object}
   * @return {Promise.<objects.Group, objects.Error>}
   *         A promise that return a Group object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  update(groupId, data) {
    return this.call.put(`/groups/${groupId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Group(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Deactivate (or delete) group selected by its id
   *
   * @param groupId {string}
   * @param force   {bool}   If true delete group information
   *                         otherwise only deactivate it.
   *                         Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.Error>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  delete(groupId, force = false) {
    const url = force
        ? `/groups/${groupId}?force=true`
        : `/groups/${groupId}`;

    return this.call.del(url)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Success(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Insert the selected user into the selected group
   *
   * @param groupId {string} The id of the selected group
   * @param userId  {string} The id of the selected user
   * @returns {Promise.<objects.Success, objects.Error>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  insertUser(groupId, userId) {
    return this.call.post(`/groups/${groupId}/users/${userId}`, {})
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Success(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Remove the selected user from the selected
   *
   * @param groupId {string} The id of the selected group
   * @param userId  {string} The id of the selected user
   * @returns {Promise.<objects.Success, objects.Error>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  removeUser(groupId, userId) {
    return this.call.del(`/groups/${groupId}/users/${userId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Success(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }
}

module.exports = ChinoAPIGroups;
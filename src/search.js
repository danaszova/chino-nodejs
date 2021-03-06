"use strict";

const objects = require("./objects");
const RESULT_TYPES = require("./resultTypes");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPISearch extends ChinoAPIBase {
  /** Create a caller for Search Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return all matching documents inside selected schema
   *
   * @param schemaId      {string}
   * @param searchParams  {object}
   * @param offset        {int}
   * @param limit         {int}
   * @return {Promise.<Array, objects.ChinoException>}
   *         A promise that return a list of Document objects if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  documents(schemaId, searchParams, offset = 0, limit = 10) {
    switch (searchParams.result_type) {
      case RESULT_TYPES.FULL_CONTENT:
      case RESULT_TYPES.NO_CONTENT:
        return this.call.post(`/search/documents/${schemaId}?offset=${offset}&limit=${limit}`, searchParams)
            .then((result) => objects.checkListResult(result, "documents", "Document"))
            .catch((error) => { throw new objects.ChinoException(error); });

      case RESULT_TYPES.ONLY_ID:
        return this.call.post(`/search/documents/${schemaId}`, searchParams)
            .then((result) => objects.checkResult(result, "Success"))
            .catch((error) => { throw new objects.ChinoException(error); });

      case RESULT_TYPES.COUNT:
        return this.call.post(`/search/documents/${schemaId}`, searchParams)
            .then((result) => objects.checkResult(result, "Success"))
            .catch((error) => { throw new objects.ChinoException(error); });

      default:
        throw new Error("Wrong result type used. See docs for further information.");
    }
  }

  /** Return all matching user inside selected user schema
   *
   * @param userSchemaId  {string}
   * @param searchParams  {object}
   * @param offset        {int}
   * @param limit         {int}
   * @return {Promise.<Array, objects.ChinoException>}
   *         A promise that return a list of Document objects if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  users(userSchemaId, searchParams, offset = 0, limit = 10) {
    switch (searchParams.result_type) {
      case RESULT_TYPES.FULL_CONTENT:
        return this.call.post(`/search/users/${userSchemaId}?offset=${offset}&limit=${limit}`, searchParams)
            .then((result) => objects.checkListResult(result, "users", "User"))
            .catch((error) => { throw new objects.ChinoException(error); });

      case RESULT_TYPES.COUNT:
        return this.call.post(`/search/users/${userSchemaId}`, searchParams)
            .then((result) => objects.checkResult(result, "Success"))
            .catch((error) => { throw new objects.ChinoException(error); });

      case RESULT_TYPES.EXISTS:
      case RESULT_TYPES.USERNAME_EXISTS:
        return this.call.post(`/search/users/${userSchemaId}`, searchParams)
            .then((result) => objects.checkResult(result, "Success"))
            .catch((error) => { throw new objects.ChinoException(error); });

      default:
        throw new Error("Wrong result type used. See docs for further information.");
    }
  }
}

module.exports = ChinoAPISearch;
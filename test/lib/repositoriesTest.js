const assert = require("assert");
const should = require('should');

const objects = require("../../src/objects");
const settings = require("./../testsSettings");
const Repositories = require("../../src/repositories");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Repositories API', function() {
  this.slow(300);
  // change timeout for slow network
  this.timeout(5000);

  let repoCaller = new Repositories(baseUrl, customerId, customerKey);
  // keep track of ids to delete them later
  let repoId = "";

    /* create */
  it("Test the creation of a repository: should return a Repository object",
      function () {
        let repo = {
          description : "This is a repository test"
        }

        return repoCaller.create(repo)
            .then((result) => {
              repoId = result.repository_id;
              result.should.be.an.instanceOf(objects.Repository);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* details */
  it("Test the retrieving of repository information: should return a Repository object",
      function () {
        assert(repoId !== "", "Repository undefined");
        return repoCaller.details(repoId)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Repository);
              Object.keys(result).length.should.be.above(0);
            })
      }
  );
  /* list */
  it("Test the listing of repositories: should return a list of Repository",
      function () {
        return repoCaller.list()
            .then((result) => {
              result.should.be.an.instanceOf(objects.ChinoList);
              result.count.should.be.above(0);
              result.total_count.should.be.above(0);
              result.list.forEach((repo) => {
                repo.should.be.an.instanceOf(objects.Repository);
              });
              // one inserted now and one already online
              result.list.length.should.equal(2);
            });
      }
  );
  /* update */
  it("Test the update of repository information: should return a Repository object",
      function () {
        let repoUpdate = {
          description: "This repository was updated"
        }

        assert(repoId !== "", "Repository undefined");
        return repoCaller.update(repoId, repoUpdate)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Repository);
              Object.keys(result).length.should.be.above(0);
              result.description.should.be.equal("This repository was updated");
            })
      }
  );

  /* delete */
  it("Test the deletion of a repository: should return  a success message",
      function () {
        assert(repoId !== "", "Repository undefined");
        return repoCaller.delete(repoId, true)
            .then((result) => {
              result.should.be.an.instanceOf(objects.Success);
              result.result_code.should.be.equal(200);
            })
      }
  );
});
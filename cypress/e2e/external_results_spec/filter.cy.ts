import { cy, describe, before, beforeEach, it, afterEach } from "local-cypress";

describe("External Results Filters", () => {
  before(() => {
    cy.loginByApi("devdistrictadmin", "Coronasafe@123");
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.awaitUrl("/external_results");
    cy.contains("Filters").click();
  });

  it("filter by lsg", () => {
    cy.get("[placeholder='Select Local Body']")
      .type("ernakulam")
      .type("{downarrow}{enter}");
  });

  it("filter by ward", () => {
    cy.get("[placeholder='Select wards']")
      .type("ernakulam")
      .type("{downarrow}{enter}");
  });

  it("filter by created date", () => {
    cy.get("[name='created_date_after']").type("06/12/2020");
    cy.get("[name='created_date_before']").type("31/12/2020");
  });

  it("filter by result date", () => {
    cy.get("[name='result_date_after']").type("02/03/2021");
    cy.get("[name='result_date_before']").type("02/04/2021");
  });

  it("filter by sample collection date", () => {
    cy.get("[name='sample_collection_date_after']").type("04/01/2021");
    cy.get("[name='sample_collection_date_before']").type("03/03/2021");
  });

  it("filter by srf id", () => {
    cy.get("[name='srf_id']").type("432");
  });

  it("Apply filter", () => {
    cy.intercept(/\/api\/v1\/external_result/).as("external_result_filter");
    cy.contains("Apply").click();
    cy.wait("@external_result_filter").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.request.url).to.include("srf_id=");
      expect(interception.request.url).to.include("created_date_before=");
      expect(interception.request.url).to.include("created_date_after=");
      expect(interception.request.url).to.include("wards=");
      expect(interception.request.url).to.include("local_bodies=");
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
});

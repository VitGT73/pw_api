import { Endpoints, EndpointKeys } from "@helpers/endpoints";
import {
  saveSwaggerToFile,
  getSwaggerFromFile,
  saveSchemasToFile,
  saveAllVarianOfResponses,
} from "@helpers/swaggerParser";
import { test } from "@playwright/test";

test.describe("booking/ POST requests @booking", async () => {
  for (const endpoint of EndpointKeys) {
    test(`For ${endpoint} save JSON Swagger to local file`, async () => {
      const jsonURL = Endpoints[endpoint].swaggerURL;
      await saveSwaggerToFile(jsonURL, endpoint);
    });
  }

  for (const endpoint of EndpointKeys) {
    test(`Get all methods for ${endpoint}`, async () => {
      // await saveSchemasToFile(endpoint);
      await saveAllVarianOfResponses(endpoint);
    });
  }

  test("Get schemas /auth from file", async () => {
    const schema = await getSwaggerFromFile(EndpointKeys["auth"]);

    console.log("/login", schema.paths["/login"]["post"]["responses"][200]["content"]["*/*"].schema);
    console.log("/validate", schema.paths["/validate"]["post"]["responses"][200]["content"]["*/*"].schema);
    console.log("/logout", schema.paths["/logout"]["post"]["responses"][200]["content"]["*/*"].schema);
  });

  // test("Get schemas /booking from file", async () => {
  //   const schema = await getSwaggerFromFile(Endpoints.booking);

  //   console.log("GET / - 200", schema.paths["/"]["get"]["responses"][200]["content"]["*/*"].schema);
  //   console.log("GET / - 400", schema.paths["/"]["get"]["responses"][400]["content"]["*/*"].schema);
  //   console.log("POST / - 200", schema.paths["/"]["post"]["responses"][200]["content"]["*/*"].schema);
  //   console.log("POST / - 400", schema.paths["/"]["post"]["responses"][400]["content"]["*/*"].schema);
  //   console.log("GET /{id} - 200", schema.paths["/{id}"]["get"]["responses"][200]["content"]["*/*"].schema);
  //   console.log("GET /{id} - 400", schema.paths["/{id}"]["get"]["responses"][400]["content"]["*/*"].schema);
  //   console.log("PUT /{id} - 200", schema.paths["/{id}"]["put"]["responses"][200]["content"]["*/*"].schema);
  //   console.log("PUT /{id} - 400", schema.paths["/{id}"]["put"]["responses"][400]["content"]["*/*"].schema);
  //   console.log("DELETE /{id} - 200", schema.paths["/{id}"]["delete"]["responses"][200]["content"]["*/*"].schema);
  //   console.log("DELETE /{id} - 400", schema.paths["/{id}"]["delete"]["responses"][400]["content"]["*/*"].schema);
  //   console.log("GET /summary - 200", schema.paths["/summary"]["get"]["responses"][200]["content"]["*/*"].schema);
  //   console.log("GET /summary - 400", schema.paths["/summary"]["get"]["responses"][400]["content"]["*/*"].schema);
  // });

  test.only("Save all schemas for endpoint to files", async () => {
    for (const endpoint of EndpointKeys) {
      await saveSchemasToFile(endpoint);
    }
  });
});

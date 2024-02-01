// import { saveAllSchemasToFile } from "@helpers/swaggerParser";
import { APIRoutes } from "@helpers/routes";
import { JsonURL } from "@helpers/jsonURL";
import { saveSwaggerToFile, getSwaggerFromFile, generatePathResponseList } from "@helpers/myCreateJsonSchema";
import { test } from "@playwright/test";

test.describe("booking/ POST requests @booking", async () => {
  test("Save /booking schemas to file", async () => {
    const jsonURL = JsonURL.booking;
    await saveSwaggerToFile(jsonURL, APIRoutes.booking);
  });

  test("Save /auth schemas to file", async () => {
    const jsonURL = JsonURL.auth;
    await saveSwaggerToFile(jsonURL, APIRoutes.auth);
  });

  test("Save /room schemas to file", async () => {
    const jsonURL = JsonURL.room;
    await saveSwaggerToFile(jsonURL, APIRoutes.room);
  });

  test("Save /branding schemas to file", async () => {
    const jsonURL = JsonURL.branding;
    await saveSwaggerToFile(jsonURL, APIRoutes.branding);
  });

  test("Save /report schemas to file", async () => {
    const jsonURL = JsonURL.report;
    await saveSwaggerToFile(jsonURL, APIRoutes.report);
  });

  test("Save /message schemas to file", async () => {
    const jsonURL = JsonURL.message;
    await saveSwaggerToFile(jsonURL, APIRoutes.message);
  });

  test.only("Get all methods", async () => {
    const saveJsonSchemasToFile = false;
    await generatePathResponseList(APIRoutes.booking, saveJsonSchemasToFile);
  });

  test("Get schemas /auth from file", async () => {
    const schema = await getSwaggerFromFile(APIRoutes.auth);

    console.log("/login", schema.paths["/login"]["post"]["responses"][200]["content"]["*/*"].schema);
    console.log("/validate", schema.paths["/validate"]["post"]["responses"][200]["content"]["*/*"].schema);
    console.log("/logout", schema.paths["/logout"]["post"]["responses"][200]["content"]["*/*"].schema);
  });

  test("Get schemas /booking from file", async () => {
    const schema = await getSwaggerFromFile(APIRoutes.booking);

    console.log("GET / - 200", schema.paths["/"]["get"]["responses"][200]["content"]["*/*"].schema);
    console.log("GET / - 400", schema.paths["/"]["get"]["responses"][400]["content"]["*/*"].schema);
    console.log("POST / - 200", schema.paths["/"]["post"]["responses"][200]["content"]["*/*"].schema);
    console.log("POST / - 400", schema.paths["/"]["post"]["responses"][400]["content"]["*/*"].schema);
    console.log("GET /{id} - 200", schema.paths["/{id}"]["get"]["responses"][200]["content"]["*/*"].schema);
    console.log("GET /{id} - 400", schema.paths["/{id}"]["get"]["responses"][400]["content"]["*/*"].schema);
    console.log("PUT /{id} - 200", schema.paths["/{id}"]["put"]["responses"][200]["content"]["*/*"].schema);
    console.log("PUT /{id} - 400", schema.paths["/{id}"]["put"]["responses"][400]["content"]["*/*"].schema);
    console.log("DELETE /{id} - 200", schema.paths["/{id}"]["delete"]["responses"][200]["content"]["*/*"].schema);
    console.log("DELETE /{id} - 400", schema.paths["/{id}"]["delete"]["responses"][400]["content"]["*/*"].schema);
    console.log("GET /summary - 200", schema.paths["/summary"]["get"]["responses"][200]["content"]["*/*"].schema);
    console.log("GET /summary - 400", schema.paths["/summary"]["get"]["responses"][400]["content"]["*/*"].schema);
  });

  // test.only("Save all schemas for endpoint to files", async () => {
  //   await saveAllSchemasToFile()
  // });
});
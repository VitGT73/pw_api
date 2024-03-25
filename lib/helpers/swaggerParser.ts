// import { createSchema } from "genson-js";
import SwaggerParser from "@apidevtools/swagger-parser";
import * as fs from "fs/promises";
import { Endpoints } from "@helpers/endpoints";
// import fs from "fs";

function getSwaggerDirName(endpoint: string) {
  const dirName = `./.api/${endpoint}`;
  return dirName;
}

function getSwaggerFileName(endpoint: string) {
  const dirName = getSwaggerDirName(endpoint);
  const swaggerFileName = `${dirName}/${endpoint}Swagger.json`;
  return swaggerFileName;
}

export async function getEndpointURL(endpoint: string) {
  const endpointURL = Endpoints[endpoint].swaggerURL;
  return endpointURL;
}

export async function saveSwaggerToFile(jsonURL: string, endpoint: string) {
  try {
    await fs.mkdir(getSwaggerDirName(endpoint), { recursive: true });
    const swagger = await getSwaggerFromURL(jsonURL);
    const swaggerString = JSON.stringify(swagger, null, 2);
    const swaggerFileName = getSwaggerFileName(endpoint);

    await writeDataToFile(swaggerFileName, swaggerString);

    console.log(`JSON Schema for ${endpoint} created and saved.`);
  } catch (err) {
    console.error(err);
  }
}

export async function getSwaggerFromURL(jsonURL: string) {
  try {
    const swagger = await SwaggerParser.dereference(jsonURL);
    return swagger;
  } catch (err) {
    console.error(err);
  }
}

export async function getSwaggerFromFile(endpoint: string) {
  const swaggerFileName = getSwaggerFileName(endpoint);
  try {
    const swagger = await SwaggerParser.dereference(swaggerFileName);
    return swagger;
  } catch (err) {
    console.error(err);
  }
}

export async function getSchemaFromSwagger(endpoint: string, path: string, method: string, responseCode: string) {
  const swagger = await getSwaggerFromFile(endpoint);
  console.log(swagger);
  const schema = swagger.paths[path][method]["responses"][responseCode]["content"]["*/*"].schema;
  console.log(`схема для ${endpoint}, ${path}, ${method}, ${responseCode}`, schema);
  return schema;
}

export async function saveSchemasToFile(endpoint: string) {
  const swaggerFileName = getSwaggerFileName(endpoint);
  const dirName = getSwaggerDirName(endpoint);
  try {
    // Загрузка и дереференциация Swagger-спецификации
    const dereferencedSpec = await SwaggerParser.dereference(swaggerFileName);

    // Обход всех путей
    for (const path in dereferencedSpec.paths) {
      const pathObject = dereferencedSpec.paths[path];

      // Обход всех методов внутри пути
      for (const method in pathObject) {
        const methodObject = pathObject[method];

        // Проверка наличия блока "responses" внутри метода
        if (methodObject.responses) {
          // Обход всех кодов ответа внутри блока "responses"
          for (const responseCode in methodObject.responses) {
            const response = methodObject.responses[responseCode];

            // Проверка наличия схемы (schema) внутри кода ответа
            if (response.content && response.content["*/*"] && response.content["*/*"].schema) {
              const schemaFileName = `${path}_${method}_${responseCode}_schema.json`.replace("/", "_");
              const schemaFullFileName = `${dirName}/${schemaFileName}`;

              // Создание каталога "output", если он не существует
              await createDir(dirName);

              const schemaString = JSON.stringify(response.content["*/*"].schema, null, 2);
              await writeDataToFile(schemaFullFileName, schemaString);
              console.log(`Схема сохранена в файле: ${dirName}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при дереференциации Swagger-спецификации:", error);
  }
}

export async function saveAllVarianOfResponses(endpoint: string) {
  const swaggerFileName = getSwaggerFileName(endpoint);
  const apiPathToSchemas: Record<string, Record<string, Record<string, string[]>>> = {};
  const dirName = getSwaggerDirName(endpoint);

  try {
    const dereferencedSpec = await SwaggerParser.dereference(swaggerFileName);

    for (const path in dereferencedSpec.paths) {
      const pathObject = dereferencedSpec.paths[path];

      if (!apiPathToSchemas[path]) {
        apiPathToSchemas[path] = {};
      }

      for (const method in pathObject) {
        const methodObject = pathObject[method];

        if (!apiPathToSchemas[path][method]) {
          apiPathToSchemas[path][method] = { responses: [] };
        }

        if (methodObject.responses) {
          for (const responseCode in methodObject.responses) {
            const response = methodObject.responses[responseCode];

            if (response.content && response.content["*/*"] && response.content["*/*"].schema) {
              apiPathToSchemas[path][method].responses.push(responseCode);
            }
          }
        }
      }
    }

    await createDir(dirName);
    const schemaHelperFileName = `${dirName}/${endpoint}Responses.json`;
    await writeDataToFile(schemaHelperFileName, JSON.stringify({ paths: apiPathToSchemas }, null, 2));
  } catch (error) {
    console.error("Ошибка получения списка ответов из Swagger-спецификации:", error);
  }
}

export async function createDir(directoryName: string) {
  try {
    await fs.mkdir(directoryName, { recursive: true });
  } catch (mkdirError) {
    console.error("Ошибка при создании каталога:", mkdirError);
  }
}

export async function writeDataToFile(location: string, data: string) {
  try {
    await fs.writeFile(location, data, { encoding: "utf-8", flag: "w" });
  } catch (writeFileError) {
    console.error("Ошибка при записи в файл:", writeFileError);
  }
}

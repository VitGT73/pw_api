// import { createSchema } from "genson-js";
import SwaggerParser from "@apidevtools/swagger-parser";
import * as fs from "fs/promises";
// import fs from "fs";

// export async function createJsonSchema(name: string, path: string, json: object) {
export async function saveSwaggerToFile(jsonURL: string, endpoint: string) {
  const filePath = `./.api/${endpoint}`;

  try {
    await fs.mkdir(filePath, { recursive: true });
    const schema = await SwaggerParser.dereference(jsonURL);
    const swaggerString = JSON.stringify(schema, null, 2);
    const swaggerFileName = `${filePath}${endpoint}AllSwagger.json`;

    await writeDataToFile(swaggerFileName, swaggerString);

    console.log(`JSON Schema for ${endpoint} created and saved.`);
  } catch (err) {
    console.error(err);
  }
}

export async function getSwaggerFromURL(jsonURL: string) {
  try {
    const schema = await SwaggerParser.dereference(jsonURL);
    // const schemaString = JSON.stringify(schema, null, 2);
    return schema;
  } catch (err) {
    console.error(err);
  }
}

export async function getSwaggerFromFile(endpoint: string) {
  const swaggerFilePath = `./.api/${endpoint}`;
  const swaggerFileName = `${swaggerFilePath}${endpoint}AllSwagger.json`;
  try {
    const schema = await SwaggerParser.dereference(swaggerFileName);
    // const schemaString = JSON.stringify(schema, null, 2);
    // console.log(schema.paths)
    return schema;
  } catch (err) {
    console.error(err);
  }
}

export async function generatePathResponseList(endpoint: string, saveSchemasToFile: boolean) {
  const dirName = `./.api/${endpoint}`;
  const swaggerFileName = `${dirName}${endpoint}AllSwagger.json`;
  const apiPathToSchemas: string[] = [];
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
              const pathToSchema = `schema.paths["${path}"]['${method}']['responses'][${responseCode}]['content']["*/*"].schema`;
              const message = `${method} ${path} - ${responseCode}: ${pathToSchema}`;
              apiPathToSchemas.push(message);
              console.log(`Путь до схемы: ${pathToSchema}`);

              if (saveSchemasToFile) {
                // const filePath = `.api${route}/${fileName}`;
                const schemaFileName = `${dirName}${path}_${method}_${responseCode}_schema.json`;

                // Создание каталога "output", если он не существует
                await createDir(dirName);

                const schemaString = JSON.stringify(response.content["*/*"].schema, null, 2);
                await writeDataToFile(schemaFileName, schemaString);
                console.log(`Схема сохранена в файле: ${dirName}`);
              }
            }
          }
          const schemaHelperFileName = `${dirName}/schemaHelper.txt`;
          await writeDataToFile(schemaHelperFileName, apiPathToSchemas.join("\n"));
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при дереференциации Swagger-спецификации:", error);
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

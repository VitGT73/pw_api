// import { createSchema } from "genson-js";
import SwaggerParser from "@apidevtools/swagger-parser";
import * as fs from "fs/promises";
// import fs from "fs";

// export async function createJsonSchema(name: string, path: string, json: object) {
export async function saveSwaggerToFile(jsonURL: string, route: string) {
  const filePath = `./.api${route}`;

  try {
    await fs.mkdir(filePath, { recursive: true });
    const schema = await SwaggerParser.dereference(jsonURL);
    const swaggerString = JSON.stringify(schema, null, 2);
    const swaggerFileName = `${filePath}${route}AllSwagger.json`;

    await writeMyJsonFile(swaggerFileName, swaggerString);

    console.log(`JSON Schema for ${route} created and saved.`);
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

export async function getSwaggerFromFile(route: string) {
  const filePath = `./.api${route}`;
  const swaggerFileName = `${filePath}${route}AllSwagger.json`;
  try {
    const schema = await SwaggerParser.dereference(swaggerFileName);
    // const schemaString = JSON.stringify(schema, null, 2);
    // console.log(schema.paths)
    return schema;
  } catch (err) {
    console.error(err);
  }
}

export async function generatePathResponseList(route: string, saveToFile: boolean) {
  const filePath = `./.api${route}`;
  const swaggerFilePath = `${filePath}${route}AllSwagger.json`;

  try {
    // Загрузка и дереференциация Swagger-спецификации
    const dereferencedSpec = await SwaggerParser.dereference(swaggerFilePath);

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

              if (saveToFile) {
                const fileName = `${path}_${method}_${responseCode}_schema.json`;
                const filePath = `.api${route}/${fileName}`;

                // Создание каталога "output", если он не существует
                try {
                  await fs.mkdir("output", { recursive: true });
                } catch (mkdirError) {
                  console.error("Ошибка при создании каталога:", mkdirError);
                }

                // Запись схемы в файл
                try {
                  await fs.writeFile(filePath, JSON.stringify(response.content["*/*"].schema, null, 2));
                  console.log(`Схема сохранена в файле: ${filePath}`);
                } catch (writeFileError) {
                  console.error("Ошибка при записи в файл:", writeFileError);
                }
              }
              console.log(`Путь до схемы: ${pathToSchema}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при дереференциации Swagger-спецификации:", error);
  }
}

export async function writeMyJsonFile(location: string, data: string) {
  try {
    await fs.writeFile(location, data);
  } catch (err) {
    console.error(err);
  }
}

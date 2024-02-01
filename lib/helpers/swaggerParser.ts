import fs from "fs";
import SwaggerParser from "@apidevtools/swagger-parser";

const swaggerFilePath = "https://automationintesting.online/booking/v3/api-docs/booking-api";

export async function saveAllSchemasToFile() {
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
              const responseSchema = response.content["*/*"].schema;
              const fileName = `${path}_${method}_${responseCode}_schema.json`;
              const filePath = `output/${fileName}`;

              // Создание каталога "output", если он не существует
              if (!fs.existsSync("output")) {
                fs.mkdirSync("output");
              }

              // Запись схемы в файл
              fs.writeFileSync(filePath, JSON.stringify(responseSchema, null, 2));

              console.log(`Схема для ${path} ${method} ${responseCode} сохранена в файле: ${filePath}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при дереференциации Swagger-спецификации:", error);
  }
}

// Вызов функции saveSchemasToFile();

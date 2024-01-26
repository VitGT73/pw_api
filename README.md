# pw_api

```bash
npm init playwright@latest
```

* Typescript
* tests
* n (We don't need a GitHub actions file yet.)
* n (We don't need the browsers, we're testing the API!)

```bash
npm install dotenv --save
```

```bash
npm install --save-dev @faker-js/faker
```
git@github.com:VitGT73/pw_api.git

echo "# pw_api_reqres" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:VitGT73/pw_api.git
git push -u origin main


## [Настройка ESLint && Prettier && Husky](https://playwrightsolutions.com/the-definitive-guide-to-api-test-automation-with-playwright-part-8-adding-eslint-prettier-and-husky/)

ESLint install ([typescript-eslint](https://typescript-eslint.io/getting-started))
```
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```
Только проверка без исправлений:
```
npx eslint .
```

Исправление ошибок:
```
npx eslint . --fix
```


[Как отключить ESLint для некоторых строк, файлов или папок](https://learn.coderslang.com/0023-eslint-disable-for-specific-lines-files-and-folders/)


[Prettier](https://prettier.io/docs/en/install)

Отключает настройки ESLint, конфликтующие с Prettier
```
npm install --save-dev eslint-config-prettier
```
Установка Prettier
```
npm install --save-dev --save-exact prettier
```

Проверка без исправления:
```npx prettier . --check```

Исправление ошибок
```
npx prettier . --write
```

[Husky](https://typicode.github.io/husky/get-started.html)

```npx husky-init && npm install```

Add to ```.husky/pre-commit```
```npm run lint && npm run prettier```

Если все таки нужно срочно закоммитить:
```git commit -m "forcing the commit" --no-verify```


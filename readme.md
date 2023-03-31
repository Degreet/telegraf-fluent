# Telegraf Fluent I18n

Fixed i18n plugin for Telegraf v4 (using fluent like @grammy/i18n)

```
npm install telegraf-fluent
# or
yarn add telegraf-fluent
```

# Example

locales/en.ftl
```fluent
name = user
hello =
  Hello, {name}!
hello_world =
  Hello, {$name}!
```

index.ts

```typescript
import { Telegraf, Context } from 'telegraf';
import { I18n, match } from 'telegraf-fluent';
import * as path from 'path';

class MyContext extends Context {
  t: (name: string, pattern?: any) => string;
  i18nLocale: string;
}

const bot = new Telegraf('TOKEN', { contextType: MyContext });

const i18n = new I18n<MyContext>({
  locales: 'en',
  directory: path.resolve(__dirname, 'locales'),
});

bot.use(i18n.middleware());
bot.hears(match('hello'), (ctx) => ctx.reply(ctx.t('hello', { name: ctx.from?.first_name })))
```

index.js
```javascript
const { Telegraf, Context } = require('telegraf');
const { I18n, match } = require('telegraf-fluent');
const path = require('path')

const bot = new Telegraf('TOKEN');

const i18n = new I18n({
  locales: 'en',
  directory: path.resolve(__dirname, 'locales'),
});

bot.use(i18n.middleware());
bot.hears(match('hello'), (ctx) => ctx.reply(ctx.t('hello', { name: ctx.from?.first_name })))
```

# Debug

```typescript
import debug from 'debug'; // typescript
const debug = require('debug'); // javascript

debug.enable('telegraf:fluent');
```

# Hyper-express Adapter for NestJS

<div align="left">

[![NPM version](https://img.shields.io/npm/v/@nnmt/platform-hyper-express.svg?style=flat)](https://www.npmjs.com/package/@nnmt/platform-hyper-express)
[![NPM downloads](https://img.shields.io/npm/dm/@nnmt/platform-hyper-express.svg?style=flat)](https://www.npmjs.com/package/@nnmt/platform-hyper-express)
[![GitHub issues](https://img.shields.io/github/issues/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/issues)
[![GitHub license](https://img.shields.io/github/license/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/badge/established-in%202024-green)](https://github.com/cpfriend1721994/platform-hyper-express/releases)
[![GitHub stars](https://img.shields.io/github/stars/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/stargazers)

</div>



## Motivation
**`platform-hyper-express`** is [**`NestJS HTTP Adapter`**](https://docs.nestjs.com/faq/http-adapter) that implement hyper-express into NestJS.

[**`hyper-express`**](https://github.com/kartikk221/hyper-express) aims to be a simple yet performant HTTP & Websocket Server.

Combined with the power of [**`uWebsockets.js`**](https://github.com/uNetworking/uWebSockets.js) - a Node.js binding of uSockets written in C++, **`platform-hyper-express`** allows NestJS Developers to unlock higher throughput for their web applications with their existing hardware.



## Installation
```sh
npm i @nnmt/platform-hyper-express
```



## Usage
Use **HyperExpressAdapter** for NestJS HTTP Adapter. Must require **`@nestjs/platform-express`** in dependencies.
```js
// sample/nest-sample-1/src/main.ts
import { NestFactory } from '@nestjs/core';
import { HyperExpressAdapter } from '@nnmt/platform-hyper-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new HyperExpressAdapter());
  await app.listen(3000);
}
bootstrap();
```

Or use **`@nnmt/platform-hyper-express`** classes only to optimize hyper-express usage (Experimental).
```js
// sample/nest-sample-2/src/main.ts
import { NestFactory } from '@nestjs/core';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@nnmt/platform-hyper-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestHyperExpressApplication>(
    AppModule,
    new HyperExpressAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
```



## Sample
- Sample project are located in **`/sample`** directory.
- Sample project help developers to install/integrate **`platform-hyper-express`** into their NestJS projects.
- Sample project is not included in NPM package's source.



## Encountering Problems?
- **`@nnmt/platform-hyper-express`** is mostly compatible with **`@nestjs/platform-express`** but not **100%** therefore you may encounter some middlewares not working out of the box. In this scenario, you must either write your own polyfill or omit the middleware to continue.
- Currently uWebsockets.js supports only Node.js LTS versions 16, 18 and 20 on (glibc) Linux, macOS and Windows, on [**`Tier 1`**](https://github.com/nodejs/node/blob/master/BUILDING.md#platform-list) platforms.
- The uWebsockets.js version header is disabled by default. You may opt-out of this behavior by setting an environment variable called **`KEEP_UWS_HEADER`** to a truthy value such as **`1`** or **`true`**.



## Still Having Problems?
- Open an [**`Issue`**](https://github.com/cpfriend1721994/platform-hyper-express/issues) with details about what led up to the problem including error traces, route information, etc.



## Testing Changes
To run platform-hyper-express functionality tests locally on your machine, you must follow the steps below.
1. Clone the [**`platform-hyper-express`**](https://github.com/cpfriend1721994/platform-hyper-express.git) repository to your machine.
2. Initialize and pull any submodule(s) which are used throughout the tests.
3. Run **`npm install`** in the root directory.
4. Run **`npm install`** in the **`/tests`** directory.
5. Run **`npm test`** to run all tests with your local changes.



## License
[**MIT**](./LICENSE)
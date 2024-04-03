# Hyper-express Adapter for NestJS


<div align="left">

[![NPM version](https://img.shields.io/npm/v/@nnmt/platform-hyper-express.svg?style=flat)](https://www.npmjs.com/package/@nnmt/platform-hyper-express)
[![NPM downloads](https://img.shields.io/npm/dm/@nnmt/platform-hyper-express.svg?style=flat)](https://www.npmjs.com/package/@nnmt/platform-hyper-express)
[![GitHub issues](https://img.shields.io/github/issues/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/issues)
[![GitHub stars](https://img.shields.io/github/stars/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/stargazers)
[![GitHub license](https://img.shields.io/github/license/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/blob/master/LICENSE)

</div>


## Motivation
[`Platform-hyper-express`](https://github.com/cpfriend1721994/platform-hyper-express) is NestJS Adapter that implement hyper-express as HTTP Server into NestJS.
[`Hyper-express`](https://github.com/kartikk221/hyper-express) aims to be a simple yet performant HTTP & Websocket Server. Combined with the power of [`uWebsockets.js`](https://github.com/uNetworking/uWebSockets.js), a Node.js binding of uSockets written in C++, hyper-express allows developers to unlock higher throughput for their web applications with their existing hardware.


## Installation
```sh
npm i @nnmt/platform-hyper-express
```


## Usage
```js
import { NestFactory } from '@nestjs/core';
import { HyperExpressAdapter } from '@nnmt/platform-hyper-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new HyperExpressAdapter()
  );
  await app.listen(3000);
}
bootstrap();
```


## Encountering Problems?
- `@nnmt/platform-hyper-express` is mostly compatible with `@nestjs/platform-express` but not **100%** therefore you may encounter some middlewares not working out of the box. In this scenario, you must either write your own polyfill or omit the middleware to continue.
- Currently uWebsockets.js supports only Node.js LTS versions on (glibc) Linux, macOS and Windows, on [`Tier 1 platforms`](https://github.com/nodejs/node/blob/master/BUILDING.md#platform-list).
- The uWebsockets.js version header is disabled by default. You may opt-out of this behavior by setting an environment variable called `KEEP_UWS_HEADER` to a truthy value such as `1` or `true`.


## Still having Problems?
- Open an [`> [Issue]`](https://github.com/cpfriend1721994/platform-hyper-express/issues) with details about what led up to the problem including error traces, route information etc etc.


## Testing Changes
To run Platform-hyper-express functionality tests locally on your machine, you must follow the steps below.
1. Clone the [`platform-hyper-express`](https://github.com/cpfriend1721994/platform-hyper-express.git) repository to your machine.
2. Initialize and pull any submodule(s) which are used throughout the tests.
3. Run `npm install` in the root directory.
4. Run `npm install` in the `/tests` directory.
5. Run `npm test` to run all tests with your local changes.


## License
[MIT](./LICENSE)
# Platform HyperExpress: NestJS hyper-express Adapter

<div align="left">

[![NPM version](https://img.shields.io/npm/v/hyper-express.svg?style=flat)](https://www.npmjs.com/package/hyper-express)
[![NPM downloads](https://img.shields.io/npm/dm/hyper-express.svg?style=flat)](https://www.npmjs.com/package/hyper-express)
[![GitHub issues](https://img.shields.io/github/issues/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/issues)
[![GitHub stars](https://img.shields.io/github/stars/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/stargazers)
[![GitHub license](https://img.shields.io/github/license/cpfriend1721994/platform-hyper-express)](https://github.com/cpfriend1721994/platform-hyper-express/blob/master/LICENSE)

</div>

## Motivation
HyperExpress aims to be a simple yet performant HTTP & Websocket Server. Combined with the power of uWebsockets.js, a Node.js binding of uSockets written in C++, HyperExpress allows developers to unlock higher throughput for their web applications with their existing hardware.
Platform HyperExpress is NestJS Adapter that implement HyperExpress as HTTP Server into NestJS.

## Installation
```sh
npm i @nnmt/platform-hyper-express
```

## Usage
```js
import { NestFactory } from '@nestjs/core';
import {
  HyperExpressAdapter,
  NestHyperExpressApplication,
} from '@nnmt/platform-hyper-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestHyperExpressApplication>(
    AppModule,
    new HyperExpressAdapter()
  );
  await app.listen(3000);
}
bootstrap();
```

## Encountering Problems?
- `@nnmt/platform-hyper-express` is mostly compatible with `@nestjs/platform-express` but not **100%** therefore you may encounter some middlewares not working out of the box. In this scenario, you must either write your own polyfill or omit the middleware to continue.
- The uWebsockets.js version header is disabled by default. You may opt-out of this behavior by setting an environment variable called `KEEP_UWS_HEADER` to a truthy value such as `1` or `true`.
- Still having problems? Open an [`> [Issue]`](https://github.com/cpfriend1721994/platform-hyper-express/issues) with details about what led up to the problem including error traces, route information etc etc.

## Testing Changes
To run Platform HyperExpress functionality tests locally on your machine, you must follow the steps below.
1. Clone the HyperExpress repository to your machine.
2. Initialize and pull any submodule(s) which are used throughout the tests.
3. Run `npm install` in the root directory.
4. Run `npm install` in the `/tests` directory.
5. Run `npm test` to run all tests with your local changes.

## License
[MIT](./LICENSE)
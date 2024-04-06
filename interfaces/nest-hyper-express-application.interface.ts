import { INestApplication, HttpServer } from '@nestjs/common';
// import type { Server as CoreHttpServer } from 'http';
// import type { Server as CoreHttpsServer } from 'https';
import type { Request, Response, Server } from 'hyper-express/types/index';
import { NestHyperExpressBodyParserOptions } from './nest-hyper-express-body-parser-options.interface';
import { NestHyperExpressBodyParserType } from './nest-hyper-express-body-parser.interface';
import { ServeStaticOptions } from './serve-static-options.interface';

/**
 * Interface describing methods on NestHyperExpressApplication.
 *
 * @see [Platform](https://docs.nestjs.com/first-steps#platform)
 *
 * @publicApi
 */
export interface NestHyperExpressApplication<
  // TServer extends CoreHttpServer | CoreHttpsServer = CoreHttpServer,
  TServer extends Server = Server,
> extends INestApplication<TServer> {
  /**
   * Returns the underlying HTTP adapter bounded to the Hyper-express.
   *
   * @returns {HttpServer}
   */
  getHttpAdapter(): HttpServer<Request, Response, Server>;

  /**
   * Starts the application.
   *
   * @param {number|string} port
   * @param {string} [hostname]
   * @param {Function} [callback] Optional callback
   * @returns {Promise} A Promise that, when resolved, is a reference to the underlying HttpServer.
   */
  listen(port: number | string, callback?: () => void): Promise<TServer>;
  listen(
    port: number | string,
    hostname: string,
    callback?: () => void,
  ): Promise<TServer>;

  /**
   * A wrapper function around native `express.set()` method.
   *
   * @example
   * app.set('trust proxy', 'loopback')
   *
   * @returns {this}
   */
  set(...args: any[]): this;

  /**
   * A wrapper function around native `express.engine()` method.
   * @example
   * app.engine('mustache', mustacheExpress())
   *
   * @returns {this}
   */
  engine(...args: any[]): this;

  /**
   * A wrapper function around native `express.enable()` method.
   * @example
   * app.enable('x-powered-by')
   *
   * @returns {this}
   */
  enable(...args: any[]): this;

  /**
   * A wrapper function around native `express.disable()` method.
   *
   * @example
   * app.disable('x-powered-by')
   *
   * @returns {this}
   */
  disable(...args: any[]): this;

  useStaticAssets(options: ServeStaticOptions): this;
  /**
   * Sets a base directory for public assets.
   * @example
   * app.useStaticAssets('public')
   *
   * @returns {this}
   */
  useStaticAssets(path: string, options?: ServeStaticOptions): this;

  /**
   * Register Hyper-express body parsers on the fly. Will respect
   * the application's `rawBody` option.
   *
   * @example
   * const app = await NestFactory.create<NestHyperExpressApplication>(
   *   AppModule,
   *   { rawBody: true }
   * );
   * app.useBodyParser('json', { limit: '50mb' });
   *
   * @returns {this}
   */
  useBodyParser<Options = NestHyperExpressBodyParserOptions>(
    parser: NestHyperExpressBodyParserType,
    options?: Omit<Options, 'verify'>,
  ): this;

  /**
   * Sets one or multiple base directories for templates (views).
   *
   * @example
   * app.setBaseViewsDir('views')
   *
   * @returns {this}
   */
  setBaseViewsDir(path: string | string[]): this;

  /**
   * Sets a view engine for templates (views).
   * @example
   * app.setViewEngine('pug')
   *
   * @returns {this}
   */
  setViewEngine(engine: string): this;

  /**
   * Sets app-level globals for view templates.
   *
   * @example
   * app.setLocal('title', 'My Site')
   *
   * @see https://expressjs.com/en/4x/api.html#app.locals
   *
   * @returns {this}
   */
  setLocal(key: string, value: any): this;
}

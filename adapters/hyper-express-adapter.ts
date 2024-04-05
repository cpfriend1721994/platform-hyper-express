import {
  HttpStatus,
  InternalServerErrorException,
  Logger,
  RequestMethod,
  StreamableFile,
  VersioningOptions,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { VersionValue } from '@nestjs/common/interfaces';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import {
  isFunction,
  isNil,
  isObject,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { RouterMethodFactory } from '@nestjs/core/helpers/router-method-factory';
import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import * as bodyparser from 'body-parser';
import cors from 'cors';
import { Server, ServerConstructorOptions, Request, Response } from 'hyper-express';
import LiveDirectory from 'live-directory';
// import { Duplex, pipeline } from 'stream';
import { pipeline } from 'stream';
import { NestHyperExpressBodyParserOptions } from '../interfaces/nest-hyper-express-body-parser-options.interface';
import { NestHyperExpressBodyParserType } from '../interfaces/nest-hyper-express-body-parser.interface';
import { ServeStaticOptions } from '../interfaces/serve-static-options.interface';
import { getBodyParserOptions } from './utils/get-body-parser-options.util';

type VersionedRoute = <
  TRequest extends Record<string, any> = any,
  TResponse = any,
>(
  req: TRequest,
  res: TResponse,
  next: () => void,
) => any;

/**
 * @publicApi
 */
export class HyperExpressAdapter extends AbstractHttpAdapter<
  Server,
  Request,
  Response
> {
  private readonly routerMethodFactory = new RouterMethodFactory();
  private readonly logger = new Logger(HyperExpressAdapter.name);
  // private readonly openConnections = new Set<Duplex>();

  constructor(private opts?: ServerConstructorOptions) {
    super();
    if (opts) {
      this.opts = opts;
    }
    this.httpServer = this.instance = new Server(this.opts);
  }

  public reply(response: any, body: any, statusCode?: number) {
    if (statusCode) {
      response.status(statusCode);
    }
    if (isNil(body)) {
      return response.send();
    }
    if (body instanceof StreamableFile) {
      const streamHeaders = body.getHeaders();
      if (
        response.getHeader('Content-Type') === undefined &&
        streamHeaders.type !== undefined
      ) {
        response.setHeader('Content-Type', streamHeaders.type);
      }
      if (
        response.getHeader('Content-Disposition') === undefined &&
        streamHeaders.disposition !== undefined
      ) {
        response.setHeader('Content-Disposition', streamHeaders.disposition);
      }
      if (
        response.getHeader('Content-Length') === undefined &&
        streamHeaders.length !== undefined
      ) {
        response.setHeader('Content-Length', streamHeaders.length);
      }
      return pipeline(
        body.getStream().once('error', (err: Error) => {
          body.errorHandler(err, response);
        }),
        response,
        (err: Error) => {
          if (err) {
            body.errorLogger(err);
          }
        },
      );
    }
    const responseContentType = response.getHeader('Content-Type');
    if (
      typeof responseContentType === 'string' &&
      !responseContentType.startsWith('application/json') &&
      body?.statusCode >= HttpStatus.BAD_REQUEST
    ) {
      this.logger.warn(
        "Content-Type doesn't match Reply body, you might need a custom ExceptionFilter for non-JSON responses",
      );
      response.setHeader('Content-Type', 'application/json');
    }
    return isObject(body) ? response.json(body) : response.send(String(body));
  }

  public status(response: any, statusCode: number) {
    return response.status(statusCode);
  }

  public end(response: any, message?: string) {
    return response.end(message);
  }

  public render(response: any, view: string, options: any) {
    return response.render(view, options);
  }

  public redirect(response: any, statusCode: number, url: string) {
    return response.redirect(statusCode, url);
  }

  public setErrorHandler(handler: Function, prefix?: string) {
    return this.use(handler);
  }

  public setNotFoundHandler(handler: Function, prefix?: string) {
    return this.use(handler);
  }

  public isHeadersSent(response: any): boolean {
    return response.headersSent;
  }

  public getHeader?(response: any, name: string) {
    return response.get(name);
  }

  public setHeader(response: any, name: string, value: string) {
    return response.set(name, value);
  }

  public appendHeader?(response: any, name: string, value: string) {
    return response.append(name, value);
  }

  public listen(port: string | number, callback?: () => void): Server;
  public listen(port: string | number, hostname: string, callback?: () => void): Server;
  public listen(port: any, hostname?: any, callback?: any): Server {
    // this.port = port;
    const host = typeof hostname === 'string' ? hostname : undefined;
    const fn = callback || hostname;
    return this.instance.listen(Number(port), host).then(() => {
      fn && fn(port);
    });
  }

  public close() {
    if (!this.httpServer) {
      return undefined;
    }
    this.closeOpenConnections();
  }

  public set(...args: any[]) {
    return this.instance.set(...args);
  }

  public enable(...args: any[]) {
    return this.instance.enable(...args);
  }

  public disable(...args: any[]) {
    return this.instance.disable(...args);
  }

  public engine(...args: any[]) {
    return this.instance.engine(...args);
  }

  public useStaticAssets(path: string, options: ServeStaticOptions) {
    if (options && options.prefix) {
      return this.use(options.prefix, new LiveDirectory(path) );
    }
    return this.use(new LiveDirectory(path));
  }

  public setBaseViewsDir(path: string | string[]) {
    return this.set('views', path);
  }

  public setViewEngine(engine: string) {
    return this.set('view engine', engine);
  }

  public getRequestHostname(request: any): string {
    return request.hostname;
  }

  public getRequestMethod(request: any): string {
    return request.method;
  }

  public getRequestUrl(request: any): string {
    return request.originalUrl;
  }

  public enableCors(options: CorsOptions | CorsOptionsDelegate<any>) {
    return this.use(cors(options));
  }

  public createMiddlewareFactory(
    requestMethod: RequestMethod,
  ): (path: string, callback: Function) => any {
    return this.routerMethodFactory
      .get(this.instance, requestMethod)
      .bind(this.instance);
  }

  public initHttpServer(options: NestApplicationOptions) {
    if (this.opts && options && options?.httpsOptions) {
      this.opts.key_file_name = options.httpsOptions.key;
      this.opts.cert_file_name = options.httpsOptions.cert;
      this.opts.passphrase = options.httpsOptions.passphrase;
    }
    if (this.opts && options?.forceCloseConnections) {
      this.opts.auto_close = options.forceCloseConnections;
    }
    this.httpServer = new Server(this.opts);
  }

  public registerParserMiddleware(prefix?: string, rawBody?: boolean | undefined) {
    const rawBodyBoolean: boolean = rawBody || true;
    const bodyParserJsonOptions = getBodyParserOptions(rawBodyBoolean);
    const bodyParserUrlencodedOptions = getBodyParserOptions(rawBodyBoolean, {
      extended: true,
    });

    const parserMiddleware = {
      jsonParser: bodyParserJson(bodyParserJsonOptions),
      urlencodedParser: bodyParserUrlencoded(bodyParserUrlencodedOptions),
    };
    Object.keys(parserMiddleware)
      .filter(parser => !this.isMiddlewareApplied(parser))
      .forEach(parserKey => this.use(parserMiddleware[parserKey]));
  }

  public useBodyParser<Options extends (bodyparser.OptionsJson & bodyparser.OptionsUrlencoded & bodyparser.OptionsText & bodyparser.Options) | undefined = NestHyperExpressBodyParserOptions>(
    type: NestHyperExpressBodyParserType,
    rawBody: boolean,
    options?: Omit<Options, 'verify'>,
  ): this {
    const parserOptions = getBodyParserOptions(rawBody, options);
    const parser = bodyparser[type](parserOptions);

    this.use(parser);

    return this;
  }

  public setLocal(key: string, value: any) {
    this.instance.locals[key] = value;
    return this;
  }

  public getType(): string {
    return 'express';
  }

  public applyVersionFilter(
    handler: Function,
    version: VersionValue,
    versioningOptions: VersioningOptions,
  ): any {
    const callNextHandler: VersionedRoute = (req, res, next) => {
      if (!next) {
        throw new InternalServerErrorException(
          'HTTP adapter does not support filtering on version',
        );
      }
      return next();
    };

    if (
      version === VERSION_NEUTRAL ||
      // URL Versioning is done via the path, so the filter continues forward
      versioningOptions.type === VersioningType.URI
    ) {
      const handlerForNoVersioning: VersionedRoute = (req, res, next) =>
        handler(req, res, next);

      return handlerForNoVersioning;
    }

    // Custom Extractor Versioning Handler
    if (versioningOptions.type === VersioningType.CUSTOM) {
      const handlerForCustomVersioning: VersionedRoute = (req, res, next) => {
        const extractedVersion = versioningOptions.extractor(req);

        if (Array.isArray(version)) {
          if (
            Array.isArray(extractedVersion) &&
            version.filter(v => extractedVersion.includes(v as string)).length
          ) {
            return handler(req, res, next);
          }

          if (
            isString(extractedVersion) &&
            version.includes(extractedVersion)
          ) {
            return handler(req, res, next);
          }
        } else if (isString(version)) {
          // Known bug here - if there are multiple versions supported across separate
          // handlers/controllers, we can't select the highest matching handler.
          // Since this code is evaluated per-handler, then we can't see if the highest
          // specified version exists in a different handler.
          if (
            Array.isArray(extractedVersion) &&
            extractedVersion.includes(version)
          ) {
            return handler(req, res, next);
          }

          if (isString(extractedVersion) && version === extractedVersion) {
            return handler(req, res, next);
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForCustomVersioning;
    }

    // Media Type (Accept Header) Versioning Handler
    if (versioningOptions.type === VersioningType.MEDIA_TYPE) {
      const handlerForMediaTypeVersioning: VersionedRoute = (
        req,
        res,
        next,
      ) => {
        const MEDIA_TYPE_HEADER = 'Accept';
        const acceptHeaderValue: string | undefined =
          req.headers?.[MEDIA_TYPE_HEADER] ||
          req.headers?.[MEDIA_TYPE_HEADER.toLowerCase()];

        const acceptHeaderVersionParameter = acceptHeaderValue
          ? acceptHeaderValue.split(';')[1]
          : undefined;

        // No version was supplied
        if (isUndefined(acceptHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
              return handler(req, res, next);
            }
          }
        } else {
          const headerVersion = acceptHeaderVersionParameter.split(
            versioningOptions.key,
          )[1];

          if (Array.isArray(version)) {
            if (version.includes(headerVersion)) {
              return handler(req, res, next);
            }
          } else if (isString(version)) {
            if (version === headerVersion) {
              return handler(req, res, next);
            }
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForMediaTypeVersioning;
    }

    // Header Versioning Handler
    if (versioningOptions.type === VersioningType.HEADER) {
      const handlerForHeaderVersioning: VersionedRoute = (req, res, next) => {
        const customHeaderVersionParameter: string | undefined =
          req.headers?.[versioningOptions.header] ||
          req.headers?.[versioningOptions.header.toLowerCase()];

        // No version was supplied
        if (isUndefined(customHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
              return handler(req, res, next);
            }
          }
        } else {
          if (Array.isArray(version)) {
            if (version.includes(customHeaderVersionParameter)) {
              return handler(req, res, next);
            }
          } else if (isString(version)) {
            if (version === customHeaderVersionParameter) {
              return handler(req, res, next);
            }
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForHeaderVersioning;
    }
  }

  private closeOpenConnections() {
    return new Promise(resolve => this.httpServer.close(resolve));
  }

  private isMiddlewareApplied(name: string): boolean {
    const app = this.getInstance();
    return (
      !!app._router &&
      !!app._router.stack &&
      isFunction(app._router.stack.filter) &&
      app._router.stack.some(
        (layer: any) => layer && layer.handle && layer.handle.name === name,
      )
    );
  }
}

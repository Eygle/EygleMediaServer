/**
 * Node entry point
 */

import {EygleServer} from 'eygle-core/server/EygleServer';
import FileDownload from './middlewares/FileDownload';
import {ICustomRoute} from 'eygle-core/server/typings/customs.interface';

new EygleServer()
  .addRoute(<ICustomRoute>{path: '/dl/:id', method: 'get', middleware: [FileDownload.getSingleFileMiddleware()]})
  .addRoute({path: '/dl', method: 'post', middleware: [FileDownload.getMultipleFileLinkGeneratorMiddleware()]})
  .addRoute({path: '/dl/zip/:id', method: 'get', middleware: [FileDownload.getMultipleFileMiddleware()]})
  .start();

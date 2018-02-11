/**
 * Node entry point
 */

import {ExpressServer} from './core/ExpressServer';
import FileDownload from "./middlewares/FileDownload";
import {CustomRoute} from "./core/models/CustomRoute"

new ExpressServer()
  .setRoutes([<CustomRoute>{
    path: '/dl/:id',
    method: 'get',
    middleware: [FileDownload.getSingleFileMiddleware()]
  }, {
    path: '/dl',
    method: 'post',
    middleware: [FileDownload.getMultipleFileLinkGeneratorMiddleware()]
  }, {
    path: '/dl/zip/:id',
    method: 'get',
    middleware: [FileDownload.getMultipleFileMiddleware()]
  }])
  .start();

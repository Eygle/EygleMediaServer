/**
 * Node entry point
 */

import {EygleServer} from 'eygle-core/server/EygleServer';
import FileDownload from "./middlewares/FileDownload";
import {CustomRoute} from "eygle-core/server/models/CustomRoute"

new EygleServer()
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

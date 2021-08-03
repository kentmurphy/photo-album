import { RequestOptions } from 'https';
import * as http from 'http';

export interface IHttp {
  get(
    options: RequestOptions | string | URL,
    callback?: (res: http.IncomingMessage) => void
  ): http.ClientRequest;
  get(
    url: string | URL,
    options: RequestOptions,
    callback?: (res: http.IncomingMessage) => void
  ): http.ClientRequest;
}

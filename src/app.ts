import { createInterface } from 'readline';
import { PhotoAlbumService } from './services/photo-album';
import * as https from 'https';

const start = () => {
  const readLine = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const svc = new PhotoAlbumService(readLine, console, https);
  svc.go();
};

start();

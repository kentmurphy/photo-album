import { Interface } from 'readline';
import { IHttp } from '../interfaces/http';
import { ILogger } from '../interfaces/logger';
import { AlbumStatus, PhotoAlbumService } from './photo-album';

describe('PhotoAlbumService', () => {
  let svc: PhotoAlbumService;
  let readLine: Interface, logger: ILogger, http: IHttp;

  // ARRANGE
  beforeEach(() => {
    readLine = jasmine.createSpyObj('readLine', ['close', 'question']);
    logger = jasmine.createSpyObj('logger', ['clear', 'log']);
    http = jasmine.createSpyObj('http', ['get']);

    svc = new PhotoAlbumService(readLine, logger, http);
  });

  it('should create an instance of the service', () => {
    // ASSERT
    expect(svc).toBeDefined();
  });

  describe('go', () => {
    it('should call printHeader', () => {
      // ARRANGE
      const stub = spyOn(svc as any, 'printHeader');

      // ACT
      svc.go();

      // ASSERT
      expect(stub).toHaveBeenCalled();
    });

    it('should call log if albumId is empty', () => {
      // ARRANGE
      svc['albumId'] = AlbumStatus.EmptyAlbum;
      const stub = spyOn(svc as any, 'log');

      // ACT
      svc.go();

      // ASSERT
      expect(stub).toHaveBeenCalledWith(
        "The album you selected didn't have any data. Please try again."
      );
      expect(svc['albumId']).toBe(AlbumStatus.NoAlbumSelected);
    });

    it('should call log if albumId is invalid', () => {
      // ARRANGE
      svc['albumId'] = AlbumStatus.InvalidAlbumId;
      const stub = spyOn(svc as any, 'log');

      // ACT
      svc.go();

      // ASSERT
      expect(stub).toHaveBeenCalledWith(
        'An invalid album id was entered. Please try again.'
      );
      expect(svc['albumId']).toBe(AlbumStatus.NoAlbumSelected);
    });
  });

  describe('clearScreen', () => {
    it('should call logger.clear', () => {
      // ACT
      svc['clearScreen']();

      // ASSERT
      expect(logger.clear).toHaveBeenCalled();
    });
  });

  describe('printHeader', () => {
    it('should call clearScreen', () => {
      // ARRANGE
      const stub = spyOn(svc as any, 'clearScreen');

      // ACT
      svc['printHeader']();

      // ASSERT
      expect(stub).toHaveBeenCalled();
    });

    it('should call log nine times', () => {
      // ARRANGE
      const stub = spyOn(svc as any, 'log');

      // ACT
      svc['printHeader']();

      // ASSERT
      expect(stub).toHaveBeenCalledTimes(9);
    });
  });

  describe('prompt', () => {
    it('should call readline.question', (done) => {
      // ACT
      svc['prompt']('test input');
      done();

      // ASSERT
      expect(readLine.question).toHaveBeenCalled();
    });
  });

  describe('getAlbumData', () => {
    it('should call http.get', (done) => {
      // ACT
      svc['getAlbumData'](1);
      done();

      // ASSERT
      expect(http.get).toHaveBeenCalled();
    });
  });

  describe('log', () => {
    it('should call the log method', () => {
      // ACT
      svc['log']('test string');

      // ASSERT
      expect(logger.log).toHaveBeenCalledWith('test string');
    });
  });
});

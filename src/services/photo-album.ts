import { Interface } from 'readline';
import { IHttp } from '../interfaces/http';
import { ILogger } from '../interfaces/logger';
import { Album } from '../models/album';

export class PhotoAlbumService {
  constructor(
    private readLine: Interface,
    private logger: ILogger,
    private http: IHttp
  ) {}

  private nextCommand = '';
  private albumId = 0;
  private results = new Array<Album>();
  private page = 1;
  private resultsPerPage = 10;

  public go(): void {
    this.printHeader();
    if (this.albumId === AlbumStatus.EmptyAlbum) {
      this.log(
        "The album you selected didn't have any data. Please try again."
      );
      this.albumId = AlbumStatus.NoAlbumSelected;
    }
    if (this.albumId === AlbumStatus.InvalidAlbumId) {
      this.log('An invalid album id was entered. Please try again.');
      this.albumId = AlbumStatus.NoAlbumSelected;
    }
    if (this.albumId === AlbumStatus.NoAlbumSelected) {
      this.prompt('What album id would you like to see? ').then(
        (id: string) => {
          const tmpAlbumId = Number.parseInt(id);

          if (isNaN(tmpAlbumId)) {
            this.albumId = AlbumStatus.InvalidAlbumId;
            this.go();
          } else {
            this.albumId = tmpAlbumId;
            this.log('Retrieving Album...');
            this.getAlbumData(parseInt(id)).then((a: Array<Album>) => {
              this.printHeader();
              this.page = 1;
              this.results = a;

              if (this.results.length === 0) {
                this.albumId = AlbumStatus.EmptyAlbum;
                this.go();
              } else {
                this.displayResults().then((c) => {
                  this.nextCommand = c;
                  this.go();
                });
              }
            });
          }
        }
      );
    } else {
      switch (this.nextCommand.toLowerCase()) {
        case 'q':
          this.clearScreen();
          this.readLine.close();
          break;
        case 'n':
          if (this.page * this.resultsPerPage < this.results.length) {
            this.page++;
          }
          this.displayResults().then((c) => {
            this.nextCommand = c;
            this.go();
          });
          break;
        case 'p':
          if (this.page > 1) {
            this.page--;
          }
          this.displayResults().then((c) => {
            this.nextCommand = c;
            this.go();
          });
          break;
        case 'd':
          this.albumId = AlbumStatus.NoAlbumSelected;
          this.go();
          break;
        default:
          this.displayResults().then((c) => {
            this.nextCommand = c;
            this.go();
          });
          break;
      }
    }
  }

  private displayResults(): Promise<string> {
    return new Promise<string>((good) => {
      const startPage =
        this.page === 1 ? 1 : (this.page - 1) * this.resultsPerPage + 1;

      this.log(
        `Displaying results ${startPage} - ${
          startPage + (this.resultsPerPage - 1)
        } of ${this.results.length} in album ${this.albumId}.`
      );

      this.log(`┌─────────┬${'─'.padEnd(104, '─')}┐`);
      this.log(`│  Id     │  ${'Title'.padEnd(102)}│`);
      this.log(`├─────────┼${'─'.padEnd(104, '─')}┤`);

      for (
        let index = startPage - 1;
        index < startPage + (this.resultsPerPage - 1);
        index++
      ) {
        const album = this.results[index];
        this.log(
          `│  ${album.Id.toString().padEnd(5)}  │  ${album.Title.padEnd(102)}│`
        );
      }

      this.log(`└─────────┴${'─'.padEnd(104, '─')}┘`);

      this.log('Choose an option:');
      if (this.page > 1) this.log('[P]revious Page');
      if (this.page * this.resultsPerPage < this.results.length)
        this.log('[N]]ext Page');
      this.log('[D]ifferent Album');
      this.log('[Q]uit');
      this.prompt('').then((command: string) => {
        good(command);
      });
    });
  }

  private clearScreen(): void {
    this.logger.clear();
  }

  private printHeader(): void {
    this.clearScreen();

    this.log(
      ` ____  __ __  ___  ______  ___             ____ _     ____  __ __ ___ ___ `
    );
    this.log(
      `|    \\|  |  |/   \\|      |/   \\           /    | |   |    \\|  |  |   |   |`
    );
    this.log(
      `|  o  |  |  |     |      |     |         |  o  | |   |  o  |  |  | _   _ |`
    );
    this.log(
      `|   _/|  _  |  O  |_|  |_|  O  |         |     | |___|     |  |  |  \\_/  |`
    );
    this.log(
      `|  |  |  |  |     | |  | |     |         |  _  |     |  O  |  :  |   |   |`
    );
    this.log(
      `|  |  |  |  |     | |  | |     |         |  |  |     |     |     |   |   |`
    );
    this.log(
      `|__|  |__|__|\\___/  |__|  \\___/          |__|__|_____|_____|\\__,_|___|___|`
    );

    this.log('');
    this.log('');
  }

  private prompt(text: string): Promise<string> {
    return new Promise<string>((good) => {
      this.readLine.question(text, (answer) => {
        good(answer);
      });
    });
  }

  private getAlbumData(id: number): Promise<Array<Album>> {
    return new Promise<Array<Album>>((good, bad) => {
      this.http.get(
        `https://jsonplaceholder.typicode.com/photos?albumId=${id}`,
        (response) => {
          let responseData = new Array<any>();
          response.on('data', (chunk) => {
            responseData.push(chunk);
          });

          response.on('end', () => {
            const tmp = new Array<Album>();
            Array.from(JSON.parse(responseData.join(''))).forEach((x: any) => {
              tmp.push(
                new Album(x.albumId, x.id, x.title, x.url, x.thumbnailUrl)
              );
            });

            good(tmp);
          });
        }
      );
    });
  }

  private log(txt: string): void {
    this.logger.log(txt);
  }
}

export enum AlbumStatus {
  EmptyAlbum = -2,
  InvalidAlbumId = -1,
  NoAlbumSelected = 0
}

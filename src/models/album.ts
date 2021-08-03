export class Album {
  constructor(
    albumId: number,
    id: number,
    title: string,
    url: string,
    thumbnailUrl: string
  ) {
    this.AlbumId = albumId;
    this.Id = id;
    this.Title = title;
    this.Url = url;
    this.ThumbnailUrl = thumbnailUrl;
  }

  public AlbumId: number;
  public Id: number;
  public Title: string;
  public Url: string;
  public ThumbnailUrl: string;
}

import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

@Pipe({
  name: 'imageId',
})
export class ImageIdPipe implements PipeTransform {
  transform(imageId: number, thumbnail: boolean = false): string {
    return `${environment.serverUrl}/api/Media/${!!thumbnail ? 'GetThumbnail/' : ''}${imageId}`;
  }
}

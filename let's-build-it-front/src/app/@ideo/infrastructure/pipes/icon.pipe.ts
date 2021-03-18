import { Pipe, PipeTransform } from '@angular/core';
import { IdeoIconModel } from '../../../@shared/models/ideo-icon.model';

@Pipe({
    name: 'icon',
})
export class IconPipe implements PipeTransform {
    transform(iconName: keyof IdeoIconModel , extension: string = 'svg'): string {
        return `assets/icons/${iconName}.${extension}`;
    }
}
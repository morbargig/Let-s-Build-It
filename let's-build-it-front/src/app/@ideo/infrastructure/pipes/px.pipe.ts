import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'px',
})
export class PxPipe implements PipeTransform {
    transform(px: number): number {
        if (window.innerWidth < 900) {
            return window.innerWidth / 375 * px
        }
        else {
            return window.innerWidth / 1920 * px
        }
    }
}
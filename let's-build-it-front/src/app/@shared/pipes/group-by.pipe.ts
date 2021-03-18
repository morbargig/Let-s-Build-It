import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../../@core/services/utils.service';

@Pipe({
  name: 'groupBy',
})
export class GroupByPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) {}

  transform(value: any[], field: string): { key: string; values: any[] }[] {
    const results = this.utilsService.groupBy(value, (i) => i[field]);
    return Object.keys(results).map((z) => {
      return {
        key: z,
        values: results[z],
      };
    });
  }
}

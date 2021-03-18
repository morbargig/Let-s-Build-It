import { Subject, Observable } from 'rxjs';
import { ZonePoint } from '../../../../../../@shared/models/partner-zone.model';
export class ZoneTypeField {
    constructor(obj: ZoneTypeField = null) {
        if (!!obj) {
            Object.keys(obj).forEach((key) => (this[key] = obj[key]));
        }
    }

    public query?: Subject<string>;
    public overlayCompleted?: Subject<ZonePoint[]>;
}

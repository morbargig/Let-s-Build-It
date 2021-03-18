export class FormSelect {
  constructor(obj: FormSelect = null) {
    if (!!obj) {
      const keys: string[] = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        this[key] = obj[key];
      }
    }
  }
  public dataKey?: string = null;
  public showClear?: boolean = true;
}

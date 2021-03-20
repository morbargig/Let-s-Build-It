import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageKeysService {
  constructor() {}

  public getItem<T>(key: string): T {
    const storageValue = localStorage.getItem(key);
    return storageValue ? JSON.parse(storageValue) : null;
  }

  public setItem(key: string, obj: any) {
    if (!!key) {
      const valueString = JSON.stringify(obj);
      localStorage.setItem(key, valueString);
    }
  }

  public removeItem(key: string) {
    if (!!key) {
      localStorage.removeItem(key);
    }
  }
}

export class CacheKeys {
  public static TOKEN: string = 'token';
  public static USER: string = 'user';
  public static PERMISSIONS: string = 'permissions';
}

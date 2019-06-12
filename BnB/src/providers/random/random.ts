import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the RandomProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RandomProvider {
  private url: string = "https://localhost:44339/api/";

  constructor(public http: HttpClient) {
    console.log('Hello RandomProvider Provider');
  }

  throw(n: number, m: number): Observable<any[]> {
    return this.http.get<any>(this.url + 'Throw/' + n + '/' + m).map(res => res as any[] || []);
  }

  getMin(array): Observable<any> {
    return this.http.get<any>(this.url + 'Throw/min', array).map(res => res as any);
  }

}

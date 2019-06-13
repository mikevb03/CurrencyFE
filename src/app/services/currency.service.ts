import { Injectable } from '@angular/core';
import { environment} from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  URL = environment.url;

  constructor( private http: HttpClient) { }

  getExchangeRate(base, symbol, wd) {
    let httpParams = new HttpParams()
    .set('base', base)
    .set('symbol', symbol)
    .set('wd', wd);
    return this.http.get(this.URL + '/req', { params: httpParams });
  }
}

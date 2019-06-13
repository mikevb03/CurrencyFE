import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrencyService } from './services/currency.service';
import currencies from '../assets/currencies.json';
import { Chart } from 'chart.js';
import { Subscription, Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CurrencyService]
})

export class AppComponent implements OnInit, OnDestroy {
  loading = false;
  sub = new Subscription();
  currencies = currencies;
  request: any = {};
  LineChart = [];
  LineChartForecast = [];
  bestDay: any = {}
  constructor(private currencyServ: CurrencyService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = !this.loading;
    this.sub = this.currencyServ.getExchangeRate(this.request.base, this.request.symbol, this.request.wd).subscribe(
      res => {
        this.bestDay = _.minBy(res[0].response, 'conv');
        this.bestDay.amount = this.request.amount / this.bestDay.conv;
        this.loading = !this.loading;
        const options = {
          title: {
            text: 'Line Chart',
            display: true
          },
          scales: {
            yAxes: [{
              type: 'linear',
              ticks: {
                beginAtZero: false,
              }
            }],
            xAxes: [{
              type: 'time',
              distribution: 'series'
            }]
          }
        };
        this.LineChart = new Chart('lineChart', {
          type: 'line',
          data: {
            labels: _.map(res[0].query, 'date'),
            datasets: [{
              label: 'Conversion Rate - Previous 25 Weeks',
              data: _.map(res[0].query, 'conv'),
              fill: false,
              lineTension: 0.2,
              borderColor: 'red',
              borderWidth: 1
            }]
          },
          options
        });
        this.LineChartForecast = new Chart('lineChartForecast', {
          type: 'line',
          data: {
            labels: _.map(res[0].response, 'date'),
            datasets: [{
              label: 'Conversion Rate - Waiting Days',
              data: _.map(res[0].response, 'conv'),
              fill: false,
              lineTension: 0.2,
              borderColor: 'blue',
              borderWidth: 1
            }]
          },
          options
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RandomProvider } from '../../providers/random/random';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('barCanvas') barCanvas: ElementRef;
  @ViewChild('lineCanvas') lineCanvas: ElementRef;
  barChart: any;
  lineChart: any;
  private n: number;
  private m: number;
  private result: number[] = [];
  private allResults: any[] = [];
  private min: number;
  private max: number;
  private fullMax: number;
  private avg: number;
  private sum: number = 0;
  private count: number = 0;
  private countArray: number[] = [];
  private fullArray: number[] = [];
  private labels: number[] = [];
  private qTwoAverage: any;
  private qTwoTwiceAverage: any;
  private qTwoPercent: number;
  private qTwoTwicePercent: number;
  private allBins: number;

  constructor(
    public navCtrl: NavController,
    private randomProv: RandomProvider
    ) 
  {

  }

  /**
   * creates labels for line chart
   */
  ionViewWillEnter() 
  {
    for(let i = 0; i < 50; i++)
    {
      this.labels.push(i);
    }
  }

  /**
   * Calls method throw when form is submitted
   */
  onSubmit() {
    this.throw(this.n,this.m);
  }

  /**
   * Does all the calculations once the user has thrown the balls
   * @param n balls
   * @param m bins
   */
  throw(n, m) 
  {
    this.allResults = [];
    this.min = 0;
    this.max = 0;
    this.avg = 0;
    this.sum = 0;
    this.fullMax = 0;
    this.qTwoPercent = 0;
    this.qTwoTwicePercent = 0;
    this.qTwoAverage = n / m;
    this.qTwoTwiceAverage = (2*n) / m;
    this.allBins = m * 50;

    
    for(let i = 0; i < 50; i++) 
    {
      this.result = [];
      this.randomProv.throw(n, m).subscribe((data) => 
      {
        this.result = data;
        this.getCountArray(this.result[0]);
        this.qTwo(this.result[0]);
        this.fullestBin(this.result[0]);
        this.allResults.push(this.result);
      });
    }
    

  }

  /**
   * generates answers for question 2
   */
  qTwo(array) 
  {
    var tempAvgCount = 0;
    var tempTwiceAvgCount = 0;
    for(let i = 0; i < array.length; i++)
    {
      if(array[i] > this.qTwoAverage)
      {
        tempAvgCount++;
      }
    }

    for(let i = 0; i < array.length; i++)
    {
      if(array[i] > this.qTwoTwiceAverage)
      {
        tempTwiceAvgCount++;
      }
    }
    this.qTwoAverage = this.qTwoAverage + tempAvgCount;
    this.qTwoTwiceAverage = this.qTwoTwiceAverage + tempTwiceAvgCount;

    this.qTwoPercent = (this.qTwoAverage / this.allBins) * 100;
    this.qTwoTwicePercent = (this.qTwoTwiceAverage / this.allBins) * 100;
  }

  /**
   * finds the fullest bin and creates graph
   */
  fullestBin(array) 
  {
    var tempMax = 0;
    tempMax = array.reduce((a, b)=>Math.max(a, b));
    this.fullArray.push(tempMax);
    if(this.fullMax < tempMax) 
    {
      this.fullMax = tempMax;
    }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
          labels: this.labels,
          datasets: [
              {
                  label: "Fullest bin",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.fullArray,
                  spanGaps: false,
              }
          ]
      }
    });
  }

  /**
   * calculates count for min max and avg
   */
  getCountArray(array) 
  {
    this.count = 0;
    for(let i = 0; i < array.length; i++)
    {
      if(array[i] == 0)
      {
        this.count++;
      }
    }
    this.sum += this.count;
    this.countArray.push(this.count);
    this.getMinMaxAvg(this.countArray, this.sum);
  }

  /**
   * calculates min max and avg
   */
  getMinMaxAvg(arrayOfCounts, sum) 
  {
    var dataset: number[] = [];
    this.avg = sum / 50; 
    this.max = arrayOfCounts.reduce((a, b)=>Math.max(a, b)); 
    this.min = arrayOfCounts.reduce((a, b)=>Math.min(a, b));
    dataset.push(this.min);
    dataset.push(this.avg);
    dataset.push(this.max);

    
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
          labels: ["Min", "Average", "Max"],
          datasets: [{
              label: 'Balls in Bins',
              data: dataset,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }

  });
  }

}

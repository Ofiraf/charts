import { isNullOrUndefined } from "util";
//const exporter = require('highcharts-export-server');
var request = require('request');
//exporter.initPool();
import * as fs from 'fs';
import * as path from 'path';
import { Marketcap } from "../models/marketcap";

export class ChartService {
    static GenerateCandleChartPost(symbol: string, timeframe:string,candleInfo, ExchangeName:string) {
        return new Promise((resolve, reject) => {
                var  candleData = [];
                var  yaxisFormat;
                var  volumeData:any[] = [];
                var lowest:number=parseFloat(candleInfo[0].Open);
                var highest:number=parseFloat(candleInfo[0].Open);
                var interval:number;

                for (let i = 0; i < candleInfo.length; i += 1) {
                    var candleTime = new Date(candleInfo[i][0]);
                    var tmp=parseFloat(candleInfo[i].Open);
                    var tmp2=parseFloat(candleInfo[i].Close);
               
                    if (tmp < lowest) lowest = tmp;
                    if (tmp2 > highest) highest = tmp2;
                    interval = highest-lowest;
                    candleData.push([
                        candleInfo[i].Date, // the date
                        parseFloat(candleInfo[i].Open), // open
                        parseFloat(candleInfo[i].High), // high
                        parseFloat(candleInfo[i].Low), // low
                        parseFloat(candleInfo[i].Close) // close
                    ]);
                    volumeData.push([
                        candleInfo[i].Date,
                        parseFloat(candleInfo[i].Volume) // the volume
                    ]);
                }
                if(interval>4 && candleInfo[0].Open>12)
                {
                    interval=Math.round(interval/4);
                    yaxisFormat='{value:.0f}';
                }
                else
                {
                    interval=interval/4;
                    var e = 1, p = 0;
                    while (Math.round(candleInfo[0].Open * e) / e !== candleInfo[0].Open) { e *= 10; p++; }
                    if(p>7) p =7
;                    yaxisFormat='{value:.'+p+'f}';
                }
          
            var exportSettings = {
                type: 'image/png',
                async:true,
                options: {
                    plotOptions: {
                        candlestick: {
                                   color: 'red',
                                   lineColor : 'red',
                                   upLineColor:'green',
                                   upColor: 'green'
                               }
                           },
                    xAxis: [{
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            day: '%e of %b'
                        },
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                    }],
                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: -5,
                            style: {
                                color: 'white',
                            },

                            lineWidth: 1,
                            format: yaxisFormat
                        },
                        tickInterval:interval,
                        height: '70%',
                        title: {
                            text: null,
                            style:{  
                                fontFamily:"Verdana",
                                color:"white",
                            }
                        },
                        lineWidth: 1
                    },
                    {
                        labels: {
                            align: 'right',
                            x: -3,
                            style: {
                                color: 'white',
                            },
                        },
                        top: '80%',
                        height: '20%',
                        offset: 0,
                        align:'right',
                        title: {
                            text: "",
                            style:{  
                                fontFamily:"Verdana",
                                color:"white",
                            }
                        },
                        lineWidth: 1
                    },
                    {
                    title: {
                        text: null,
                    },
                    height: '70%',
                    lineWidth: 1,
                    opposite:true,
                    offset: 0
                    }
                    , {
                        title: {
                            text: null,
                        },
                        top: '80%',
                        height: '20%',
                        offset: 0,
                        opposite:true,
                        lineWidth: 1
                    }
                ],
                title: {
                        text: symbol + ' '+ExchangeName+' '+timeframe+' Chart - Generated by @WCSEBot',
                        style:{  
                            color:"white",
                            fontSize:"14px",
                            fontWeight:"bold",
                            fontStyle:"normal"
                            
                         }
                 },
                 chart:{  
                        backgroundColor:"black",
                        spacing: 30,
                        width:600,
                        style:{  
                           fontStyle:"normal",
                           borderColor: 'white'
 
                        }
                },
                series: [{
                        type: 'candlestick',
                        showInLegend:false,
                        data: candleData,
                        plotBorderWidth: 1,
                        labels: {
                        color:'white',
                        },
                        yAxis: 0,
                    }, {
                        type: 'column',
                        showInLegend:false,
                        data: volumeData,
                        yAxis: 1,
                        color:'blue',

    
                    }]
                }
            };
           // console.log(JSON.stringify(exportSettings));
            request({
                url: "http://export.highcharts.com",
                method: "POST",
                json: true, 
                body: exportSettings
            }, function (error, response, body){
                resolve("http://export.highcharts.com/"+response.body);
            });
        });
    }

    static GeneratePieChartPost(Name:string,HoldingInfo) {
        return new Promise((resolve, reject) => {
            var categories = [];
            for (let i = 0; i < HoldingInfo.length; i += 1) {
                 if(HoldingInfo[i].name!='BTC')
                 categories.push(HoldingInfo[i].name);
            }
            var exportSettings = {
                type: 'png',
                async:true,
                options: {
                    title: {
                        text: Name+'  Portfolio Holdings',
                        style:{  
                            color:"white",
                            fontSize:"14px",
                            fontWeight:"bold",
                            fontStyle:"normal"
                            
                         }
                    },
                    yAxis: {
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                        title: {
                            color: 'white',
                        }
                    },
                    xAxis: {
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                        title: {
                            color: 'white',
                        }
                    },
                    labels: {
                        items: [{
                            style: {
                                left: '50px',
                                top: '13px',
                                color: 'white'
                            }
                        }]
                    },
                    chart:{
                        zoomType:'x',
                        backgroundColor:"black"
                     },
                    series: [
                    {
                        type: 'pie',
                        data: HoldingInfo,
                        showInLegend: false,
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                            distance: 25,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            },
                            style: {
                                color: 'white',
                            },
                        }
                    }]
                }};
           
            //console.log(JSON.stringify(exportSettings));
            request({
                url: "http://export.highcharts.com",
                method: "POST",
                json: true, 
                body: exportSettings
            }, function (error, response, body){
                resolve("http://export.highcharts.com/"+response.body);
            });
            
        
        });
     

    }
    static GenerateStatusBarsChartPost(Name:string,HoldingStats) {
        return new Promise((resolve, reject) => {
            var categories = [];
            var profits = [];
            for (let i = 0; i < HoldingStats.length; i += 1) {
                 categories.push(HoldingStats[i].name);
                 profits.push(parseFloat(HoldingStats[i].y));
            }
            var exportSettings = {
                type: 'png',
                async:true,
                options: {
                    title: {
                        text: Name+' Portfolio Status',
                        style:{  
                            color:"white",
                            fontSize:"14px",
                            fontWeight:"bold",
                            fontStyle:"normal"
                            
                         }
                    },
                    xAxis: {
                        categories: categories,
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                    },
                    yAxis: {
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                    },
                    labels: {
                        items: [{
                            style: {
                                left: '50px',
                                top: '13px',
                                color: 'white'
                            }
                        }]
                    },
                    chart:{
                        backgroundColor:"black"
                     },
                    series: [
                    {
                        type: 'column',
                        name: 'Profits',
                        pointWidth:30,
                        negativeColor:'red',
                        data: profits,
                        showInLegend: false,
                    }]
                }
            };
           
            console.log(JSON.stringify(exportSettings));
            request({
                url: "http://export.highcharts.com",
                method: "POST",
                json: true, 
                body: exportSettings
            }, function (error, response, body){
                resolve("http://export.highcharts.com/"+response.body);
            });
            
        
        });
     

    }
    static GeneratePieChartStatusPost(Name:string,HoldingInfo) {
        return new Promise((resolve, reject) => {
            var categories = [];
            for (let i = 0; i < HoldingInfo.length; i += 1) {
                 if(HoldingInfo[i].name!='BTC')
                 categories.push(HoldingInfo[i].name);
            }
            var exportSettings = {
                type: 'png',
                async:true,
                options: {
                    title: {
                        text: 'Portfolio Holdings',
                        style:{  
                            color:"white",
                            fontSize:"14px",
                            fontWeight:"bold",
                            fontStyle:"normal"
                            
                         }
                    },
                    yAxis: {
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                        title: {
                            color: 'white',
                        }
                    },
                    xAxis: {
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                        title: {
                            color: 'white',
                        }
                    },
                    labels: {
                        items: [{
                            style: {
                                left: '50px',
                                top: '13px',
                                color: 'white'
                            }
                        }]
                    },
                    chart:{
                        zoomType:'x',
                        backgroundColor:"black"
                     },
                    series: [
                    {
                            type: 'pie',
                            data: HoldingInfo[0],
                            center: [70, null],
                            size: 90,
                            showInLegend: false,
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                                distance: 5,
                                filter: {
                                    property: 'percentage',
                                    operator: '>',
                                    value: 4
                                },
                                style: {
                                    color: 'white',
                                },
                            }
                        },
                        {
                            type: 'pie',
                            data: HoldingInfo[1],
                            center: [270, null],
                            size: 90,
                            showInLegend: false,
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                                distance: 5,
                                filter: {
                                    property: 'percentage',
                                    operator: '>',
                                    value: 4
                                },
                                style: {
                                    color: 'white',
                                },
                            }
                        },
                        {
                        type: 'pie',
                        data: HoldingInfo[2],
                        center: [470, null],
                        size: 90,
                        showInLegend: false,
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                           distance: 5,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            },
                            style: {
                                color: 'white',
                            },
                        }
                    },
                ]
                }};
           
            console.log(JSON.stringify(exportSettings));
            request({
                url: "http://export.highcharts.com",
                method: "POST",
                json: true, 
                body: exportSettings
            }, function (error, response, body){
                resolve("http://export.highcharts.com/"+response.body);
            });
            
        
        });
     

    }
    static GenerateOBChart(symbol: string,orderData) {
        return new Promise((resolve, reject) => {
            var OrderBid=[];
            var OrderAsk=[];
                for (let i = 0; i < orderData.Bids.length; i += 1) {
                   
                    OrderBid.push([
                        parseFloat(orderData.Bids[i].Price),parseFloat(orderData.Bids[i].Quantity)
                  
                    ]);
                    OrderAsk.push([
                        orderData.Asks[i].Price,orderData.Asks[i].Quantity
                    ]);
                }
            var exportSettings = {
            type: 'png',
            async:true,
                options: {
                    type: 'area',
                    title: {
                        text: symbol + ' Order Book Chart - Generated by @WCSEBot',
                            style:{  
                            color:"white",
                            fontSize:"14px",
                            fontWeight:"bold",
                            fontStyle:"normal"
                            
                         }
                    },
                    chart:{  
                        backgroundColor:"black"
                    },
                    
                    series: [{
                        pointStart: OrderAsk[0].Price,
                        type: 'area',
                        color:'red',
                        showInLegend:false,
                        data:  OrderAsk
                
                    },
                    {
                        pointStart: OrderBid[0].Price,
                        type: 'area',
                        color:'green',
                        showInLegend:false,
                        data:  OrderBid
                
                    }
                    
                ],    
                      yAxis: [{
                        labels: {
                            align: 'right',
                            x: -3,
                            style: {
                                color: 'white'
                            }
                        },
                        title: {
                            text: ''
                        }
                      
                    }],
                    xAxis: [{
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                    }],
                }
                
            };

          //  console.log(JSON.stringify(exportSettings));
            request({
                url: "http://export.highcharts.com",
                method: "POST",
                json: true, 
                body: exportSettings
            }, function (error, response, body){
                resolve("http://export.highcharts.com/"+response.body);
            });
            }
    )};

    static GenerateCapitalChart3(CapitalData:any, VolumeData:any) {
        return new Promise((resolve, reject) => {
            var MarketCap:any[] = [];
            var VolumeCap:any[] = [];

            var CapDate=[];
            for (let i = 0; i < CapitalData.Cap.length; i += 1) {
                MarketCap.push(
                   
                    parseFloat(CapitalData.Cap[i][0]),   
                    CapitalData.Cap[i][1], // the date
                   
            );
                VolumeCap.push([
                  
                    parseFloat(CapitalData.Volume[i][0]), // the volume
                    VolumeData[i][1], // the date
                ]);
            }

            var exportSettings = {
                type: 'png',
                async:true,
                    options: {
                        title: {
                            text: ' Market Cap Chart (1 days) - Generated by @WCSEBot',
                                style:{  
                                color:"white",
                                fontSize:"14px",
                                fontWeight:"bold",
                                fontStyle:"normal"
                                
                             }
                        },
                        chart:{  
                            backgroundColor:"black"
                        },
                        
                        series: [{
                            type: 'line',
                            color:'blue',
                            showInLegend:false,
                            data:  MarketCap
    
                        }
                        
                    ],    
                          yAxis: [{
                            labels: {
                                align: 'right',
                                x: 0,
                                style: {
                                    color: 'white'
                                },
                                formatter: function () {//use formatter to break word.
                                    return this.value.substring(0, 3)+'B'
           
                                }
                             
                               
                            },
                            title: {
                                text: ''
                            }
                          
                        }],
                        xAxis: [{
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                day: '%e of %b'
                            },
                            labels: {
                                style: {
                                    color: 'white'
                                }
                            },
                        }],
                    }
                    
                };
           // console.log(JSON.stringify(exportSettings));
            request({
                url: "http://export.highcharts.com",
                method: "POST",
                json: true, 
                body: exportSettings
            }, function (error, response, body){
                resolve("http://export.highcharts.com/"+response.body);
            });
        });
    }
    static GenerateCapitalChart(CapitalData) {
        return new Promise((resolve, reject) => {
            console.log(CapitalData);
            const marketCap:Marketcap = CapitalData;
            console.log(marketCap);

            var CapDate=[];
            for (let i = 0; i < CapitalData.length; i += 1) {
                marketCap.volume.push([
                   
                    parseFloat(CapitalData[i][0]), // open
                    CapitalData[i][1], // the date
                   
                ]);
            }
            var exportSettings = {
            type: 'png',
            async:true,
                options: {
                    title: {
                        text: ' Market Cap Chart (1 days) - Generated by @WCSEBot',
                            style:{  
                            color:"white",
                            fontSize:"14px",
                            fontWeight:"bold",
                            fontStyle:"normal"
                            
                         }
                    },
                    chart:{  
                        backgroundColor:"black"
                    },
                    
                    series: [{
                        type: 'line',
                        color:'blue',
                        showInLegend:false,
                        data:  marketCap

                    }
                    
                ],    
                      yAxis: [{
                        labels: {
                            align: 'right',
                            x: 0,
                            style: {
                                color: 'white'
                            },
                            formatter: function () {//use formatter to break word.
                                return this.value.substring(0, 3)+'B'
       
                            }
                         
                           
                        },
                        title: {
                            text: ''
                        }
                      
                    }],
                    xAxis: [{
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            day: '%e of %b'
                        },
                        labels: {
                            style: {
                                color: 'white'
                            }
                        },
                    }],
                }
                
            };

          //  console.log(JSON.stringify(exportSettings));
            request({
                url: "http://export.highcharts.com",
                method: "POST",
                json: true, 
                body: exportSettings
            }, function (error, response, body){
                resolve("http://export.highcharts.com/"+response.body);
            });
            }
    )};
      

      

    

}
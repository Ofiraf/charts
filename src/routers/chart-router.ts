import { Request, Response, NextFunction, Router, IRouter } from 'express';
import { ChartService } from '../services/chart-service';

import * as fs from 'fs';
import * as path from 'path';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { Marketcap } from '../models/marketcap';

export class ChartRouter {
    static routes(): Router {
        const router = Router();
            router
            .post('/obChart/:symbol', (request: Request, response: Response, next: NextFunction) => {
                var orderBook = request.body;
                ChartService.GenerateOBChart(request.params.symbol,orderBook)
                .then(res => {
                    var data = res as string;
                    response.send(data);
                });
            });
            router
            .post('/McapChart', (request: Request, response: Response, next: NextFunction) => {
                ChartService.GenerateCapitalChart(request.body)
                .then(res => {
                    var data = res as string;
                    response.send(data);
                });
            });
            router
            .post('/pieChart/:name', (request: Request, response: Response, next: NextFunction) => {
                var holdings = request.body;
                ChartService.GeneratePieChartPost(request.params.name,holdings)
                .then(res => {
                    var data = res as string;
                    response.send(data);
                });
            });
            router
            .post('/pieChartAll/:name', (request: Request, response: Response, next: NextFunction) => {
                var holdings = request.body;
                ChartService.GeneratePieChartStatusPost(request.params.name,holdings)
                .then(res => {
                    var data = res as string;
                    response.send(data);
                });
            });
        
            router
            .post('/statsChart/:name', (request: Request, response: Response, next: NextFunction) => {
                var holdings = request.body;
                ChartService.GenerateStatusBarsChartPost(request.params.name,holdings)
                .then(res => {
                    var data = res as string;
                    response.send(data);
                });
            });

        router.post('/candleChart/:symbol/:time/:exchange', (request: Request, response: Response, next: NextFunction) => {
            var candels = request.body;
            ChartService.GenerateCandleChartPost(request.params.symbol,request.params.time,candels,request.params.exchange)
            .then(res => {
                var data = res as string;
                response.send(data);
            });
        });
           

        return router;
    }
}

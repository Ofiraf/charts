import { Request, Response, NextFunction, Router, IRouter } from 'express';
import { ChartService } from '../services/chart-service';

import * as fs from 'fs';
import * as path from 'path';
import { ADDRGETNETWORKPARAMS } from 'dns';

export class ExampleRouter {
    static routes(): Router {
        const router = Router();
        /*    router
            .post('/:symbol', (request: Request, response: Response, next: NextFunction) => {
                var orderBook = request.body;
                ChartService.GenerateOBChart(request.params.symbol,orderBook)
                .then(res => {
                    var data = res as string;
                    var symbol =request.params.symbol;
                    data = data.replace(/^data:image\/png;base64,/, '');

                    fs.writeFile(path.resolve(__dirname, '../tmp/'+symbol+'.png'), data, 'base64', function(err) {
                    });


                var pathCHart=path.resolve(__dirname, '../tmp/'+symbol+'.png');

                    response.send(pathCHart);
                });
            });*/

            router
            .post('/pieChart/:name', (request: Request, response: Response, next: NextFunction) => {
                var holdings = request.body;
                ChartService.GeneratePieChartPost(request.params.name,holdings)
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

import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
@Injectable()
export class ApiSoap2Service {
  private soapClient: any;
  private wsdlUrl = 'http://www.dneonline.com/calculator.asmx?wsdl';

  constructor() {
    soap.createClient(this.wsdlUrl, (err, client) => {
      if (err) throw new Error('SOAP Client Error');
      this.soapClient = client;
    });
  }

  async add(intA: number, intB: number): Promise<any> {
    const args = { intA, intB };
    return new Promise((resolve, reject) => {
      this.soapClient.Add(args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      // this.soapClient.Multiply(args, (err, result) => {
      //   if (err) return reject(err);
      //   resolve(result);
      // });
    });
  }
}

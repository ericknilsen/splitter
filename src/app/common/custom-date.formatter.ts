import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Util } from "./util";

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  
  parse(value: string): NgbDateStruct | null {
    return this.parse(value);
  }

  format(date: NgbDateStruct | null): string {
    return Util.formatDate(date);
  }
}
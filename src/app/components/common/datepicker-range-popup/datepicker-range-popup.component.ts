import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-datepicker-range-popup',
  templateUrl: './datepicker-range-popup.component.html',
  styleUrls: ['./datepicker-range-popup.component.css']
})
export class DatepickerRangePopupComponent implements OnInit {

  @Input()
  defaultDateInterval!: any;

  @Output() 
  dateIntervalSelected: EventEmitter<string> = new EventEmitter();

  @ViewChild('datepicker')
  datepicker!: NgbInputDatepicker;

  hoveredDate: NgbDate | null = null;

  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;

  dateInterval!: any;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
  }

  initNgbDateInterval() {
    if (this.defaultDateInterval) {
      const {firstDay, lastDay} = this.defaultDateInterval;

      this.fromDate = new NgbDate(firstDay.getFullYear(), firstDay.getMonth()+1, firstDay.getDate());
      this.toDate = new NgbDate(lastDay.getFullYear(), lastDay.getMonth()+1, lastDay.getDate());
    }
  }

  ngOnInit(): void {
    this.initNgbDateInterval();
    this.setDateInterval();
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.datepicker.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.setDateInterval();
  }

  private setDateInterval() {
    this.dateInterval = this.formatter.format(this.fromDate)+' - '+this.formatter.format(this.toDate);
    if (this.fromDate && this.toDate) {
      const dateParams: any = {};
      dateParams.startDate = this.formatNgbDate(this.fromDate);
      dateParams.endDate = this.formatNgbDate(this.calendar.getNext(this.toDate, 'd', 1));
      this.dateIntervalSelected.emit(dateParams);
    } 
  }

  private formatNgbDate(ngbDate: NgbDate) {
    return `${ngbDate.year}-${String(ngbDate.month).padStart(2, '0')}-${String(ngbDate.day).padStart(2, '0')}`;
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}

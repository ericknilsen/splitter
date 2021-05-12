import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Util } from 'src/app/common/util';
import { UserGroupService } from 'src/app/services/user-groups.service';
@Component({
  selector: 'app-charts-search',
  templateUrl: './charts-search.component.html',
  styleUrls: ['./charts-search.component.css']
})
export class ChartsSearchComponent implements OnInit {

  @Input()
  displayParamsMap!: Map<string, boolean>;

  @Output()
  searchChanges: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  user: any;
  users: any[] = [];
  dateInterval: any; 
  compareDateInterval: any; 

  constructor(private fb: FormBuilder,
              private userGroupService: UserGroupService,) {
    this.form = this.initForm();
  }

  private initForm() {
    return this.fb.group({
      'user': new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initCurrentUser();
    this.selectParams();
  }

  //n === 0 -> current month
  //n === 1 -> previous month
  getDefaultDateInterval(n: number) {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth() - n, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1 - n, 0);

    return {firstDay, lastDay};
  }

  selectParams() {
    this.emitSearchChanges();
  }
  
  private emitSearchChanges() {
    this.listUserGroupOfUser();
  }

  private listUserGroupOfUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(userGroup => {
      this.users = userGroup.users;
      this.searchChanges.emit({searchParams: this.form.value, users: userGroup.users, dateInterval: this.dateInterval, compareDateInterval: this.compareDateInterval});
    })
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  setDateInterval(dateInterval: any) {
    this.dateInterval = dateInterval;
    this.selectParams();
  }

  setCompareDateInterval(compareDateInterval: any) {
    this.compareDateInterval = compareDateInterval;
    this.selectParams();
  }

  get f() { return this.form.controls; }

}

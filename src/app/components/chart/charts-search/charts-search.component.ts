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
  months: Map<string, string> = new Map();
  monthsList: string[] = [];

  constructor(private fb: FormBuilder,
              private userGroupService: UserGroupService,) {
    this.form = this.initForm();
  }

  private initForm() {
    return this.fb.group({
      'month': new FormControl(''),
      'compareMonth': new FormControl(''),
      'user': new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initMonths();
    this.initCurrentUser();
    this.selectParams();
  }

  private initMonths() {
    this.months = Util.getMonths();
    this.monthsList = Array.from(this.months.keys());
    this.form.patchValue({'month': Util.getCurrentMonth()});
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
      this.searchChanges.emit({searchParams: this.form.value, users: userGroup.users});
    })
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  get f() { return this.form.controls; }

}

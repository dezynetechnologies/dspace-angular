import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'ds-my-dashboard',
  standalone:true,
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss'],
  imports: [SharedModule]
})
export class MyDashboardComponent {
  showSubmit: boolean = false;

  constructor(private cdr: ChangeDetectorRef, public router:Router) {}

  Search(){
    this.router.navigate(['/search']);
  }
  Manage(){}
  Browse(){}
  Submit() {
    // this.showSubmit = true;
    // console.log(this.showSubmit);
  }
}

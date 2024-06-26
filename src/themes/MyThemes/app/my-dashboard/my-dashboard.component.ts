import { ChangeDetectorRef, Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';

export const MYDASHBOARD_ROUTE = '/myDashboard';
@Component({
  selector: 'ds-my-dashboard',
  standalone:true,
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss'],
  imports: [SharedModule, RouterModule]
})

export class MyDashboardComponent {
  showSubmit: boolean = false;


  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      console.log(this.authService.isAuthenticated());
      this.router.navigate(['/home2']);
    } 
  }

  constructor(private cdr: ChangeDetectorRef, public router:Router, public authService: AuthService) {
    
  }

  Search(){
    this.router.navigate(['/admin/search']);
  }
  Browse(){
    this.router.navigate(['/community-list']);
  }
  SamvadAISearch(){
    this.router.navigate(['/admin/samvad-ai']);
  }
  Submit() {
    this.router.navigate(['/mydspace']);
  }
}

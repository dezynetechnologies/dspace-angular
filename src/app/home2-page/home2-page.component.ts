import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'ds-home2-page',
  styleUrls: ['./home2-page.component.scss'],
  templateUrl: './home2-page.component.html'
})
export class Home2PageComponent implements OnInit {

  site$: Observable<Site>;
  recentSubmissionspageSize: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService
  ) {
    this.recentSubmissionspageSize = environment.homePage.recentSubmissions.pageSize;
  }

  ngOnInit(): void {
    let b:boolean = true;

    this.authService.isAuthenticated().subscribe((res) => {
      b = res;
    });
    if(b){
      console.log("We are inside home2 authenticate");
      this.router.navigate(['/myDashboard']);
    }
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { environment } from '../../environments/environment';
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
  ) {
    this.recentSubmissionspageSize = environment.homePage.recentSubmissions.pageSize;
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompanyService } from '../company-service';
import { Observable, switchMap, of } from 'rxjs';
import { Company } from '../company.model';

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-view.html',
  styleUrl: './company-view.css'
})
export class CompanyViewComponent implements OnInit {

  company$!: Observable<Company | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {
    this.loading$ = this.companyService.loading$;
    this.error$ = this.companyService.error$;
  }

  ngOnInit(): void {
    this.company$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.companyService.getCompany(id) : of(null);
      })
    );
  }
}

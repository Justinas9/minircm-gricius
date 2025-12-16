import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../company-service';
import { Observable } from 'rxjs';
import { Company } from '../company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyListComponent implements OnInit {

  companies$: Observable<Company[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private companyService: CompanyService) {
    this.companies$ = this.companyService.companies$;
    this.loading$ = this.companyService.loading$;
    this.error$ = this.companyService.error$;
  }

  ngOnInit(): void {
    this.companyService.loadCompanies().subscribe();
  }

  deleteCompany(id?: string): void {
    if (!id) return;

    if (confirm('Ar tikrai norite ištrinti šią įmonę?')) {
      this.companyService.deleteCompany(id).subscribe();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from './company.model';
import { BehaviorSubject, Observable, map, tap, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesSubject = new BehaviorSubject<Company[]>([]);
  private apiURL = "https://minicrm-cb156-default-rtdb.europe-west1.firebasedatabase.app/";
  private isLoading = false;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  companies$ = this.companiesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}


  loadCompanies(): Observable<Company[]> {
    if (this.isLoading) {
      return of(this.companiesSubject.getValue());
    }

    this.isLoading = true;
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<{[key: string]: Company}>(`${this.apiURL}/companies.json`)
      .pipe(
        map(response => {
          const companies: Company[] = [];
          if (response) {
            for (const key in response) {
              if (response.hasOwnProperty(key)) {
                companies.push({
                  ...response[key],
                  id: key
                });
              }
            }
          }
          this.companiesSubject.next(companies);
          this.isLoading = false;
          this.loadingSubject.next(false);
          return companies;
        }),
        catchError(error => {
          this.isLoading = false;
          this.loadingSubject.next(false);
          this.errorSubject.next('Nepavyko užkrauti įmonių duomenų');
          console.error('Error loading companies:', error);
          return of([]);
        })
      );
  }

  getCompany(id: string): Observable<Company | null> {
    return this.http.get<Company>(`${this.apiURL}/companies/${id}.json`)
      .pipe(
        map(company => {
          if (company) {
            return { ...company, id };
          }
          return null;
        }),
        catchError(error => {
          this.errorSubject.next('Nepavyko užkrauti įmonės duomenų');
          console.error('Error loading company:', error);
          return of(null);
        })
      );
  }

  addCompany(company: Omit<Company, 'id'>): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post(`${this.apiURL}/companies.json`, company)
      .pipe(
        tap(response => {
          const currentCompanies = this.companiesSubject.getValue();
          const companyWithId: Company = {
            ...company,
            id: (response as {name: string}).name
          };
          this.companiesSubject.next([...currentCompanies, companyWithId]);
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next('Nepavyko išsaugoti įmonės duomenų');
          console.error('Error adding company:', error);
          throw error;
        })
      );
  }

  deleteCompany(id: string): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.delete(`${this.apiURL}/companies/${id}.json`)
      .pipe(
        tap(() => {
          const currentCompanies = this.companiesSubject.getValue();
          const updatedCompanies = currentCompanies.filter(company => company.id !== id);
          this.companiesSubject.next(updatedCompanies);
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next('Nepavyko ištrinti įmonės');
          console.error('Error deleting company:', error);
          throw error;
        })
      );
  }

  updateCompany(id: string, updatedData: Partial<Company>): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.patch(`${this.apiURL}/companies/${id}.json`, updatedData)
      .pipe(
        tap(() => {
          const currentCompanies = this.companiesSubject.getValue();
          const updatedCompanies = currentCompanies.map(company =>
            company.id === id ? { ...company, ...updatedData } : company
          );
          this.companiesSubject.next(updatedCompanies);
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next('Nepavyko atnaujinti įmonės duomenų');
          console.error('Error updating company:', error);
          throw error;
        })
      );
  }
}

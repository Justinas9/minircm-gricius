import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CompanyService } from '../company-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.html',
  styleUrl: './company-form.css'
})
export class CompanyFormComponent {
  companyForm: FormGroup;
  isLoading = false;
  isError = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      companyName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]],
      companyCode: ['', [
        Validators.pattern('^[0-9]*$')
      ]],
      vatCode: ['', [
        Validators.pattern('^(LT)?[0-9]+$')
      ]],
      address: [''],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.pattern('^\\+370[0-9]{8}$'),
        Validators.minLength(10),
        Validators.maxLength(12)
      ]],
      contacts: this.fb.array([this.createContact()])
    });
  }

  createContact(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      position: [''],
      phoneNumber: ['', [
        Validators.pattern('^\\+370[0-9]{8}$'),
        Validators.minLength(10),
        Validators.maxLength(12)
      ]]
    });
  }

  get contacts(): FormArray {
    return this.companyForm.get('contacts') as FormArray;
  }

  addContact(): void {
    this.contacts.push(this.createContact());
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  submitForm(): void {
    if (this.companyForm.valid) {
      this.isLoading = true;
      this.isError = false;
      this.errorMessage = '';
      this.successMessage = '';

      console.log(this.companyForm.value);

      this.companyService.addCompany(this.companyForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Įmonė sėkmingai užregistruota!';
          console.log('Įmonė išsaugota su ID:', (response as {name: string}).name);

          setTimeout(() => {
            this.router.navigate(['/companies']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = 'Nepavyko išsaugoti įmonės duomenų. Patikrinkite interneto ryšį ir bandykite dar kartą.';
          console.error('Klaida saugant įmonę:', error);
        }
      });
    } else {
      this.isError = true;
      this.errorMessage = 'Prašome užpildyti visus privalomus laukus teisingai';
      setTimeout(() => {
        this.isError = false;
      }, 3000);

      Object.keys(this.companyForm.controls).forEach(key => {
        this.companyForm.get(key)?.markAsTouched();
      });

      this.contacts.controls.forEach(contact => {
        Object.keys((contact as FormGroup).controls).forEach(key => {
          contact.get(key)?.markAsTouched();
        });
      });
    }
  }
}

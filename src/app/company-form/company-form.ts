import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
      console.log(this.companyForm.value);

      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        alert('f12');
        this.companyForm.reset();
        while (this.contacts.length > 1) {
          this.contacts.removeAt(1);
        }
      }, 1000);
    } else {
      this.isError = true;
      this.errorMessage = 'Prašome užpildyti visus privalomus laukus';
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

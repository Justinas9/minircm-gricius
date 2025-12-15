import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompanyFormComponent } from './company-form/company-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CompanyFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('minircm-gricius');
}

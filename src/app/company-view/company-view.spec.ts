import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyViewComponent } from './company-view';

describe('CompanyViewComponent', () => {
  let component: CompanyViewComponent;
  let fixture: ComponentFixture<CompanyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

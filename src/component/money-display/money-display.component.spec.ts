import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyDisplayComponent } from './money-display.component';

describe('MoneyDisplayComponent', () => {
  let component: MoneyDisplayComponent;
  let fixture: ComponentFixture<MoneyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

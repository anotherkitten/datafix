import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupShelfComponent } from './popup-shelf.component';

describe('PopupShelfComponent', () => {
  let component: PopupShelfComponent;
  let fixture: ComponentFixture<PopupShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementalScreenComponent } from './incremental-screen.component';

describe('IncrementalScreenComponent', () => {
  let component: IncrementalScreenComponent;
  let fixture: ComponentFixture<IncrementalScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncrementalScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncrementalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

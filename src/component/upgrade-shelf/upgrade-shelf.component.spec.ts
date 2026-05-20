import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeShelfComponent } from './upgrade-shelf.component';

describe('UpgradeShelfComponent', () => {
  let component: UpgradeShelfComponent;
  let fixture: ComponentFixture<UpgradeShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

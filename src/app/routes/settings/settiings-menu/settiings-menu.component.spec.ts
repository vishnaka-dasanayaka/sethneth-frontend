import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettiingsMenuComponent } from './settiings-menu.component';

describe('SettiingsMenuComponent', () => {
  let component: SettiingsMenuComponent;
  let fixture: ComponentFixture<SettiingsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettiingsMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettiingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherDialogComponent } from './researcher-dialog.component';

describe('ResearcherDialogComponent', () => {
  let component: ResearcherDialogComponent;
  let fixture: ComponentFixture<ResearcherDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

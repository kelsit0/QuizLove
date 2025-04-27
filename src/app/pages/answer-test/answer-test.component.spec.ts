import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerTestComponent } from './answer-test.component';

describe('AnswerTestComponent', () => {
  let component: AnswerTestComponent;
  let fixture: ComponentFixture<AnswerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxbForgotPasswordComponent } from './forgot-password.component';

describe('ChangePasswordComponent', () => {
    let component: PxbForgotPasswordComponent;
    let fixture: ComponentFixture<PxbForgotPasswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PxbForgotPasswordComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PxbForgotPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PasswordRequirement } from '../../../../components/password-strength-checker/pxb-password-strength-checker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PxbAuthConfig } from '../../../../services/config/auth-config';
import { PxbFormsService } from '../../../../services/forms/forms.service';
import { CrossFieldErrorMatcher } from '../../../../util/matcher';
import { makeEverythingUnique } from '../../../../util/filters';
import { isEmptyView } from '../../../../util/view-utils';

@Component({
    selector: 'pxb-create-account-create-password-step',
    template: `
        <div class="mat-title pxb-auth-title">
            <ng-container *ngIf="isEmpty(createPasswordTitleEl)">
                {{ createPasswordTitle }}
            </ng-container>
            <div #createPasswordTitleVC><ng-content select="[pxb-create-password-title]"></ng-content></div>
        </div>
        <p class="mat-body-1" style="margin-bottom: 24px;">
            <ng-container *ngIf="isEmpty(createPasswordInstructionsEl)">
                {{ createPasswordInstructions }}
            </ng-container>
        </p>
        <div #createPasswordInstructionsVC><ng-content select="[pxb-create-password-instructions]"></ng-content></div>
        <mat-divider class="pxb-auth-divider" style="margin-top: 16px; margin-bottom: 32px;"></mat-divider>
        <div class="pxb-auth-full-height">
            <form [formGroup]="passwordFormGroup">
                <mat-form-field appearance="fill" style="width: 100%;">
                    <mat-label>{{ passwordFormLabel }}</mat-label>
                    <input
                        id="pxb-password"
                        name="password"
                        matInput
                        [placeholder]="passwordFormLabel"
                        required
                        formControlName="newPassword"
                        [type]="newPasswordVisible ? 'text' : 'password'"
                        (ngModelChange)="updatePassword(passwordFormGroup.value.newPassword)"
                        (keyup.enter)="pxbFormsService.advanceToNextField(confirmInputElement)"
                    />
                    <button type="button" mat-icon-button matSuffix (click)="toggleNewPasswordVisibility()">
                        <mat-icon>{{ newPasswordVisible ? 'visibility' : 'visibility_off' }}</mat-icon>
                    </button>
                </mat-form-field>
                <pxb-password-strength-checker
                    [requirements]="passwordRequirements"
                    [formValue]="passwordFormGroup.value.newPassword"
                    [(meetsRequirements)]="passesStrengthCheck"
                >
                </pxb-password-strength-checker>
                <mat-form-field appearance="fill" style="width: 100%;">
                    <mat-label>{{ confirmPasswordFormLabel }} </mat-label>
                    <input
                        #pxbConfirm
                        id="pxb-confirm"
                        name="confirm"
                        matInput
                        [placeholder]="confirmPasswordFormLabel"
                        required
                        formControlName="confirmPassword"
                        [type]="confirmPasswordVisible ? 'text' : 'password'"
                        (focus)="confirmPasswordFocused = true"
                        (blur)="confirmPasswordFocused = false"
                        (ngModelChange)="updatePassword(passwordFormGroup.value.confirmPassword)"
                        [errorStateMatcher]="errorMatcher"
                        (keyup.enter)="advance.emit(true)"
                    />
                    <button type="button" mat-icon-button matSuffix (click)="toggleConfirmPasswordVisibility()">
                        <mat-icon>{{ confirmPasswordVisible ? 'visibility' : 'visibility_off' }}</mat-icon>
                    </button>
                    <mat-error *ngIf="!confirmPasswordFocused && passwordFormGroup.hasError('passwordsDoNotMatch')"
                        >{{ passwordMismatchError }}
                    </mat-error>
                </mat-form-field>
            </form>
        </div>
    `,
})
export class PxbCreatePasswordComponent {
    @Input() password: string;
    @Input() passwordMeetsRequirements: boolean;
    @Input() createPasswordTitle: string;
    @Input() createPasswordInstructions: string;
    @Input() passwordFormLabel: string;
    @Input() confirmPasswordFormLabel: string;
    @Input() passwordMismatchError: string;

    @ViewChild('createPasswordTitleVC') createPasswordTitleEl;
    @ViewChild('createPasswordInstructionsVC') createPasswordInstructionsEl;

    @Output() passwordChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() passwordMeetsRequirementsChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() advance: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('pxbConfirm') confirmInputElement: ElementRef;

    newPasswordVisible = false;
    passesStrengthCheck = false;
    confirmPasswordVisible = false;
    confirmPasswordFocused = false;
    isEmpty = (el: ElementRef): boolean => isEmptyView(el);

    passwordFormGroup: FormGroup;
    errorMatcher = new CrossFieldErrorMatcher();
    passwordRequirements: PasswordRequirement[];

    constructor(
        private readonly _pxbAuthConfig: PxbAuthConfig,
        private readonly _formBuilder: FormBuilder,
        public pxbFormsService: PxbFormsService
    ) {}

    ngOnInit(): void {
        this.setDefaultLabels();
        this.passwordRequirements = makeEverythingUnique(this._pxbAuthConfig.passwordRequirements, 'description');
        this.passwordFormGroup = this._formBuilder.group(
            {
                newPassword: ['', Validators.required],
                confirmPassword: ['', Validators.required],
            },
            {
                validator: this._checkPasswords,
            }
        );
        setTimeout(() => {
            this.passwordMeetsRequirements = false;
            this.passwordMeetsRequirementsChange.emit(false);
        });
    }

    setDefaultLabels(): void {
        if (this.createPasswordTitle === undefined) {
            this.createPasswordTitle = 'Create Password';
        }
        if (this.createPasswordInstructions === undefined) {
            this.createPasswordInstructions = 'Please select a password. Make sure that your password meets the necessary complexity requirements outlined below.';
        }
        if (this.passwordFormLabel === undefined) {
            this.passwordFormLabel = 'Password';
        }
        if (this.confirmPasswordFormLabel === undefined) {
            this.confirmPasswordFormLabel = 'Confirm Password';
        }
        if (this.passwordMismatchError === undefined) {
            this.passwordMismatchError = 'Passwords do not match';
        }

    }

    toggleNewPasswordVisibility(): void {
        this.newPasswordVisible = !this.newPasswordVisible;
    }

    toggleConfirmPasswordVisibility(): void {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }

    updatePassword(newPassword: string): void {
        this.password = newPassword;
        this.passwordChange.emit(newPassword);
        this.passwordMeetsRequirements = this._passwordValid();
        this.passwordMeetsRequirementsChange.emit(this._passwordValid());
    }

    private _passwordValid(): boolean {
        return this.passesStrengthCheck && this.passwordFormGroup.valid;
    }

    private _checkPasswords(group: FormGroup): any {
        const pass = group.get('newPassword').value;
        const confirmPass = group.get('confirmPassword').value;
        return pass === confirmPass ? null : { passwordsDoNotMatch: true };
    }
}

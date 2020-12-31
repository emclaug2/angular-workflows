import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PxbFormsService } from '../../../../services/forms/forms.service';
import { isEmptyView } from '../../../../util/view-utils';

@Component({
    selector: 'pxb-create-account-account-details-step',
    template: `
        <div class="mat-title pxb-auth-title">
            {{ accountDetailsTitle }}
        </div>
        <div class="pxb-auth-full-height">
            <p class="mat-body-1" style="margin-bottom: 24px;">
                <ng-container *ngIf="isEmpty(accountDetailsInstructionsEl)">
                    {{ accountDetailsInstructions }}
                </ng-container>
            </p>
            <div #accountDetailsInstructionsVC>
                <ng-content select="[pxb-account-details-instructions]"></ng-content>
            </div>
            <mat-divider class="pxb-auth-divider" style="margin-top: 16px; margin-bottom: 32px;"></mat-divider>
            <div style="display: flex; flex: 1 1 0px; overflow: auto;">
                <ng-container *ngIf="!useDefaultAccountDetails">
                    <ng-content select="[pxb-account-details-form]"></ng-content>
                </ng-container>
                <form *ngIf="useDefaultAccountDetails">
                    <mat-form-field appearance="fill" [style.width.%]="100" [style.marginBottom.px]="8">
                        <mat-label>First Name</mat-label>
                        <input
                            #pxbFirst
                            id="pxb-first"
                            name="first"
                            matInput
                            [formControl]="firstNameFormControl"
                            required
                            (ngModelChange)="emitIfValid()"
                            (keyup.enter)="pxbFormsService.advanceToNextField(lastNameInputElement)"
                        />
                        <mat-error *ngIf="firstNameFormControl.hasError('required')">
                            First Name is <strong>required</strong>
                        </mat-error>
                    </mat-form-field>
                    <mat-form-field appearance="fill" [style.width.%]="100" [style.marginBottom.px]="8">
                        <mat-label>Last Name</mat-label>
                        <input
                            matInput
                            #pxbLast
                            id="pxb-last"
                            name="last"
                            [formControl]="lastNameFormControl"
                            required
                            (ngModelChange)="emitIfValid()"
                            (keyup.enter)="pxbFormsService.advanceToNextField(phoneInputElement)"
                        />
                        <mat-error *ngIf="lastNameFormControl.hasError('required')">
                            Last Name is <strong>required</strong>
                        </mat-error>
                    </mat-form-field>
                    <mat-form-field appearance="fill" [style.width.%]="100" [style.marginBottom.px]="8">
                        <mat-label>Phone Number (optional)</mat-label>
                        <input
                            #pxbPhone
                            id="pxb-phone"
                            name="phone"
                            matInput
                            [formControl]="phoneNumberFormControl"
                            (keyup.enter)="advance.emit(true)"
                        />
                    </mat-form-field>
                </form>
            </div>
        </div>
    `,
})
/* Default Account Details consists of a First/Last Name (required) and a phone number (optional). */
export class PxbAccountDetailsComponent {
    @Input() useDefaultAccountDetails = false;
    @Input() accountDetailsTitle: string;
    @Input() accountDetailsInstructions: string;

    @Output() accountDetailsChange = new EventEmitter<FormControl[]>();
    @Output() validAccountDetailsChange = new EventEmitter<boolean>();
    @Output() advance: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('pxbLast') lastNameInputElement: ElementRef;
    @ViewChild('pxbPhone') phoneInputElement: ElementRef;
    @ViewChild('accountDetailsInstructionsVC') accountDetailsInstructionsEl: ElementRef;

    firstNameFormControl: FormControl;
    lastNameFormControl: FormControl;
    phoneNumberFormControl: FormControl;
    isEmpty = (el: ElementRef): boolean => isEmptyView(el);

    constructor(public pxbFormsService: PxbFormsService) {}

    ngOnInit(): void {
        this.setDefaultLabels();
        if (this.useDefaultAccountDetails) {
            this.firstNameFormControl = new FormControl('', Validators.required);
            this.lastNameFormControl = new FormControl('', Validators.required);
            this.phoneNumberFormControl = new FormControl('');
            this.accountDetailsChange.emit([
                this.firstNameFormControl,
                this.lastNameFormControl,
                this.phoneNumberFormControl,
            ]);
        }
    }

    setDefaultLabels(): void {
        if (this.accountDetailsTitle === undefined) {
            this.accountDetailsTitle = 'Account Details';
        }
        if (this.accountDetailsInstructions === undefined) {
            this.accountDetailsInstructions = 'Enter your details below to complete account creation.';
        }
    }

    /* If we are using the default account details, we need to provide the input validation required for the 'NEXT' button. */
    emitIfValid(): void {
        this.validAccountDetailsChange.emit(
            this.firstNameFormControl.value &&
                this.firstNameFormControl.valid &&
                this.lastNameFormControl.value &&
                this.lastNameFormControl.valid
        );
    }
}

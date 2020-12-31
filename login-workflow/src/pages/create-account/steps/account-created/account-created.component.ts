import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { isEmptyView } from '../../../../util/view-utils';

@Component({
    selector: 'pxb-create-account-account-created-step',
    template: `
        <div class="mat-title pxb-auth-title">{{ accountCreatedStepTitle }}</div>
        <div class="pxb-auth-full-height" style="justify-content: center;">
            <pxb-empty-state>
                <mat-icon pxb-empty-icon class="pxb-account-created-empty-state">check_circle</mat-icon>
                <div pxb-title>
                    <div *ngIf="isEmpty(successTitleEl)">{{ successTitle }}</div>
                    <div #successTitleVC>
                        <ng-content select="[pxb-account-created-success-title]"></ng-content>
                    </div>
                </div>
                <div pxb-description>
                    <div *ngIf="isEmpty(successDescriptionEl)">
                        {{ successDescription }}
                    </div>
                    <div #successDescriptionVC>
                        <ng-content select="[pxb-account-created-success-description]"></ng-content>
                    </div>
                </div>
            </pxb-empty-state>
        </div>
    `,
    styleUrls: ['./account-created.component.scss'],
})
export class PxbAccountCreatedComponent implements OnInit {
    @Input() email: string;
    @Input() userName: string;
    @Input() accountCreatedStepTitle: string;
    @Input() successTitle: string;
    @Input() successDescription: string;

    @ViewChild('successTitleVC') successTitleEl;
    @ViewChild('successDescriptionVC') successDescriptionEl;

    isEmpty = (el: ElementRef): boolean => isEmptyView(el);

    ngOnInit(): void {
        if (this.accountCreatedStepTitle === undefined) {
            this.accountCreatedStepTitle = 'Account Created';
        }
        if (this.successDescription === undefined) {
            this.successDescription = this.getSuccessEmptyStateDescription();
        }
        if (this.successTitle === undefined) {
            this.successTitle = this.getSuccessEmptyStateTitle();
        }
    }

    getSuccessEmptyStateTitle(): string {
        if (this.userName && this.userName.trim()) {
            return `Welcome, ${this.userName}!`;
        }
        return `Welcome!`;
    }

    getSuccessEmptyStateDescription(): string {
        let firstSentence: string;
        if (this.email && this.email.trim()) {
            firstSentence = `Your account has been successfully created with the email ${this.email}.`;
        } else {
            firstSentence = `Your account has been successfully created.`;
        }
        return `${firstSentence} Your account has already been added to the organization. Press Continue below to finish.`;
    }
}

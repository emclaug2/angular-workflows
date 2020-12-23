import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {isEmptyView} from "../../../../util/view-utils";

@Component({
    selector: 'pxb-create-account-account-created-step',
    template: `
        <div class="mat-title pxb-auth-title">
            <ng-container *ngIf="isEmpty(accountCreatedTitleEl)">
                {{ accountCreatedTitle }}
            </ng-container>
            <div #accountCreatedTitleVC><ng-content select="[pxb-account-created-title]"></ng-content></div>
        </div>
        <div class="pxb-auth-full-height" style="justify-content: center;">
            <pxb-empty-state
                class="pxb-account-created-empty-state"
                [title]="getSuccessEmptyStateTitle()"
                [description]="getSuccessEmptyStateDescription()"
            >
                <mat-icon pxb-empty-icon class="pxb-account-created-icon">check_circle</mat-icon>
            </pxb-empty-state>
        </div>
    `,
    styleUrls: ['./account-created.component.scss'],
})
export class PxbAccountCreatedComponent implements OnInit {
    @Input() email;
    @Input() userName;
    @Input() accountCreatedTitle;

    @ViewChild('accountCreatedTitleVC') accountCreatedTitleEl;

    isEmpty = (el: ElementRef): boolean => isEmptyView(el);

    ngOnInit(): void {
        if (this.accountCreatedTitle === undefined) {
            this.accountCreatedTitle = 'Account Created';
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

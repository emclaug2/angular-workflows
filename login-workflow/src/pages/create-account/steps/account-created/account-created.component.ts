import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { PxbAuthConfig } from '../../../../services/config/auth-config';
import { PxbAuthTranslations } from '../../../../translations/auth-translations';
import {isEmptyView} from "../../../../util/view-utils";

@Component({
    selector: 'pxb-create-account-account-created-step',
    template: `
        <div class="mat-title pxb-auth-title" [innerHTML]="translate.CREATE_ACCOUNT.ACCOUNT_CREATED.TITLE"></div>
        <div class="pxb-auth-full-height" style="justify-content: center;">
            <pxb-empty-state *ngIf="isEmpty(customContentEl)" class="pxb-account-created-empty-state">
                <div pxb-title>
                    <div [innerHTML]="translate.CREATE_ACCOUNT.ACCOUNT_CREATED.WELCOME_MESSAGE_TITLE(userName)"></div>
                </div>
                <div pxb-description>
                    <div
                        [innerHTML]="translate.CREATE_ACCOUNT.ACCOUNT_CREATED.WELCOME_MESSAGE_DESCRIPTION(email)"
                    ></div>
                </div>
                <mat-icon pxb-empty-icon class="pxb-account-created-icon" color="primary">check_circle</mat-icon>
            </pxb-empty-state>
            <div #customContent>
                <ng-template [ngTemplateOutlet]="accountCreatedScreen"></ng-template>
            </div>
        </div>
    `,
    styleUrls: ['./account-created.component.scss'],
})
export class PxbAccountCreatedComponent implements OnInit {
    @Input() userName;
    @Input() email;
    @ViewChild('customContent') customContentEl: ElementRef;
    @Input() accountCreatedScreen: TemplateRef<any>;

    translate: PxbAuthTranslations;
    isEmpty = (el: ElementRef): boolean => isEmptyView(el);

    constructor(private readonly _pxbAuthConfig: PxbAuthConfig,
                private readonly _changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.translate = this._pxbAuthConfig.getTranslations();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }
}

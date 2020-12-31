import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PxbAuthConfig } from './../../../../services/config/auth-config';
import { PxbRegisterUIService } from '../../../../services/api/register-ui.service';
import { PxbAuthSecurityService, SecurityContext } from '../../../../services/state/auth-security.service';
import * as Colors from '@pxblue/colors';
import { isEmptyView } from '../../../../util/view-utils';

@Component({
    selector: 'pxb-create-account-eula-step',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="mat-title pxb-auth-title">
            {{ eulaTitle }}
        </div>
        <div
            *ngIf="eula"
            class="pxb-auth-full-height"
            style="overflow: auto"
            (scroll)="checkScrollDistance($event)"
            [innerHTML]="sanitizer.sanitize(1, eula)"
        ></div>
        <pxb-empty-state
            *ngIf="!eula && !isLoading"
            class="pxb-auth-full-height"
            title="Error"
            description="License Agreement Failed To Load"
        >
            <mat-icon pxb-empty-icon [style.color]="colors.red[500]">error</mat-icon>
            <button pxb-actions mat-raised-button color="primary" (click)="getEULA()">
                <mat-icon>replay</mat-icon>
                Reload
            </button>
        </pxb-empty-state>
        <div *ngIf="eula" class="pxb-eula-confirm-agreement">
            <mat-checkbox
                class="pxb-eula-checkbox"
                [disabled]="!userScrolledBottom"
                [(ngModel)]="userAcceptsEula"
                (change)="userAcceptsEulaChange.emit(userAcceptsEula)"
                ngDefaultControl
            >
                <ng-container *ngIf="isEmpty(eulaConfirmReadEl)">
                    {{ eulaConfirmRead }}
                </ng-container>
                <div #eulaConfirmReadVC><ng-content select="[pxb-eula-confirm-read]"></ng-content></div>
            </mat-checkbox>
        </div>
    `,
    styles: [
        `
            .pxb-eula-confirm-agreement {
                margin: 24px 0;
            }
            ::ng-deep .pxb-eula-checkbox .mat-checkbox-inner-container {
                width: 18px;
                height: 18px;
            }
            ::ng-deep .pxb-empty-state-description {
                color: #424e54 !important;
            }
        `,
    ],
})
export class PxbEulaComponent implements OnInit {
    @Input() eulaTitle: string;
    @Input() eulaConfirmRead: string;
    @Input() userAcceptsEula: boolean;
    @Output() userAcceptsEulaChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('eulaConfirmReadVC') eulaConfirmReadEl;

    eula: string;
    isLoading: boolean;
    userScrolledBottom = false;
    colors = Colors;

    isEmpty = (el: ElementRef): boolean => isEmptyView(el);

    constructor(
        public sanitizer: DomSanitizer,
        private readonly _pxbAuthConfig: PxbAuthConfig,
        private readonly _pxbRegisterService: PxbRegisterUIService,
        private readonly _pxbSecurityService: PxbAuthSecurityService
    ) {
        this._pxbSecurityService.securityStateChanges().subscribe((state: SecurityContext) => {
            this.isLoading = state.isLoading;
        });
    }

    ngOnInit(): void {
        this.setDefaultLabels();
        // Configurable option to require users to scroll to bottom of EULA before accepting.
        if (!this._pxbAuthConfig.eulaScrollLock) {
            this.userScrolledBottom = true;
        }
        // User has already scrolled to the bottom and accepted the EULA.
        if (this.userAcceptsEula) {
            this.userScrolledBottom = true;
        }
        this.getEULA();
    }

    setDefaultLabels(): void {
        if (this.eulaTitle === undefined) {
            this.eulaTitle = 'License Agreement';
        }
        if (this.eulaConfirmRead === undefined) {
            this.eulaConfirmRead = 'I have read and agree to the Terms & Conditions';
        }
    }

    getEULA(): void {
        if (this._pxbAuthConfig.eula) {
            this.eula = this._pxbAuthConfig.eula;
            this._pxbSecurityService.setLoading(false);
        } else {
            this._pxbSecurityService.setLoading(true);
            this._pxbRegisterService
                .loadEULA()
                .then((eula: string) => {
                    this.eula = eula;
                    this._pxbSecurityService.setLoading(false);
                })
                .catch(() => {
                    this._pxbSecurityService.setLoading(false);
                });
        }
    }

    checkScrollDistance(e: Event): void {
        if (this.userScrolledBottom) {
            return;
        }
        const el = e.target as HTMLElement;
        this.userScrolledBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1;
    }
}

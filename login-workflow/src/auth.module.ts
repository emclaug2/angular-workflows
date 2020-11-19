import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PxbLoginComponent } from './pages/login/login.component';
import { PxbForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PxbResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PxbCreateAccountComponent } from './pages/create-account/create-account.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PxbAuthComponent } from './auth/auth.component';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { EmptyStateModule, SpacerModule } from '@pxblue/angular-components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { PasswordStrengthCheckComponent } from './components/password-strength-checker/password-strength-checker.component';
import { DotStepperComponent } from './components/dot-stepper/dot-stepper.component';
import { CommonModule } from '@angular/common';
import { PxbContactSupportComponent } from './pages/contact-support/contact-support.component';
import { PxbCreateAccountInviteComponent } from './pages/create-account-invite/create-account-invite.component';
import { PxbChangePasswordComponent } from './pages/change-password/change-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PxbChangePasswordDialogComponent } from './pages/change-password/dialog/change-password-dialog.component';
import { PxbLoginErrorDialogComponent } from './pages/login/dialog/login-error-dialog.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { PxbChangePasswordErrorDialogComponent } from './pages/change-password/dialog/change-password-error-dialog.component';
import { PxbForgotPasswordErrorDialogComponent } from './pages/forgot-password/dialog/forgot-password-error-dialog.component';
import { PxbCreateAccountInviteDialogComponent } from './pages/create-account-invite/dialog/create-account-invite-error-dialog.component';
@NgModule({
    declarations: [
        PxbLoginComponent,
        PxbForgotPasswordComponent,
        PxbResetPasswordComponent,
        PxbCreateAccountComponent,
        PxbAuthComponent,
        PxbContactSupportComponent,
        PxbCreateAccountInviteComponent,
        PxbChangePasswordComponent,
        PxbChangePasswordDialogComponent,
        PxbLoginErrorDialogComponent,
        PxbChangePasswordErrorDialogComponent,
        PxbForgotPasswordErrorDialogComponent,
        PxbCreateAccountInviteDialogComponent,

        PasswordStrengthCheckComponent,
        DotStepperComponent,
        LoadingOverlayComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        MatProgressSpinnerModule,
        SpacerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MatCheckboxModule,
        MatIconModule,
        MatDividerModule,
        EmptyStateModule,
        MatListModule,
        MatDialogModule,
    ],
    entryComponents: [
        PxbForgotPasswordErrorDialogComponent,
        PxbLoginErrorDialogComponent,
        PxbChangePasswordErrorDialogComponent,
        PxbChangePasswordDialogComponent,
        PxbCreateAccountInviteDialogComponent,
    ],
    exports: [
        PxbAuthComponent,
        PxbLoginComponent,
        PxbForgotPasswordComponent,
        PxbCreateAccountComponent,
        PxbResetPasswordComponent,
        PxbContactSupportComponent,
        PxbCreateAccountInviteComponent,
        PxbChangePasswordComponent,
    ],
})
export class PxbAuthModule {}

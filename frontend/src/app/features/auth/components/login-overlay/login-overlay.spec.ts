import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginOverlay } from './login-overlay';
import { AuthService } from '../../../../core/auth/auth.service';

describe('LoginOverlay', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<LoginOverlay>>;
  let component: LoginOverlay;
  let authService: { login: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      login: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [LoginOverlay],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    });

    fixture = TestBed.createComponent(LoginOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the welcome heading', () => {
    const heading = fixture.nativeElement.querySelector('h2');

    expect(heading.textContent.trim()).toBe('Welcome back!');
  });

  it('should render the login description', () => {
    const paragraph = fixture.nativeElement.querySelector('p');

    expect(paragraph.textContent.trim()).toBe('Your next cosmic adventure starts here.');
  });

  it('should render the login button', () => {
    const button = fixture.nativeElement.querySelector('.btn-primary');

    expect(button).not.toBeNull();
  });

  it('should display the Keycloak login button text', () => {
    const button = fixture.nativeElement.querySelector('.btn-primary');

    expect(button.textContent).toContain('Continue with Keycloak');
  });

  it('should render the login footer', () => {
    const footer = fixture.nativeElement.querySelector('.login-footer');

    expect(footer.textContent.trim()).toBe('SECURE LOGIN · SPACE DONUTS');
  });

  it('should call AuthService.login when the login button is clicked', () => {
    const button = fixture.nativeElement.querySelector('.btn-primary');

    button.click();

    expect(authService.login).toHaveBeenCalledTimes(1);
  });

  it('should not call AuthService.login without clicking the button', () => {
    expect(authService.login).not.toHaveBeenCalled();
  });
});

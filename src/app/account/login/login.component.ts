import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private accountService: AccountService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.loaderService.loader();
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        console.log('login success');
        this.loaderService.hidingLoader();
      },
      error: (err) => {
        console.error(err);
        this.loaderService.hidingLoader();
      },
    });
  }
}

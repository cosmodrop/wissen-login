import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
/**
 * Modify the login component and the login template to collect login details and add the validators as necessary
 */
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  submitted = false;
  isChecked = false;
  isShowError = false;
  isShowSuccess = false;
  isLogin = true;
  userList: any;
  passwordType = 'password';
  loginForm: FormGroup = new FormGroup({});
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.buildForm();
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      term: [false],
      email: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    const obj = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.login(obj).subscribe(
      (response) => {
        this.isShowError = false;
        this.isShowSuccess = true;
        console.log(response);
        this.getUserDetails(response?.token).subscribe((res) => {
          this.isLogin = false;
          this.userList = res.data;
          console.log('list of users', res.data);
        }, (err) => {
          //
        });
      },
      (error) => {
        console.log('err', error);
        this.isShowError = true;
        this.isShowSuccess = false;
      }
    );
  }

  login(obj: any): Observable<any> {
    return this.http.post<any>('https://reqres.in/api/login', obj);
  }

  getUserDetails(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    });
    return this.http.get<any>(`https://reqres.in/api/${token}`, { headers });
  }

  onCheck(): void {
    this.isChecked = this.loginForm.value.term;
  }

  showPassword(): void {
    this.passwordType = 'text';
  }
}

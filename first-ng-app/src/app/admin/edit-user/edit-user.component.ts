import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserApiService} from "../../core/api/user-api.service";
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  //表单提交按钮显示
  formDisabled: boolean = true;
  registerForm: FormGroup;
  submitted = false;
  uid="0";
  genderOpts = [{label: 'Male', value: 1}, {label: 'Female', value: 2}, {label: 'Other', value: 3}];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly userApiClient: UserApiService,
              private readonly router: Router) {

    this.registerForm = this.formBuilder.group(
      {
        username: ['', null],
        name: ['', Validators.required],
        gender: [1, Validators.required],
        birthday: ['', Validators.required],
        phoneNum: ['', Validators.required],
        homeAddress: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        isAdmin: [false, Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {disable: this.formDisabled}
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    // loading existing user data by given id
    const url = window.location.href;
    const userId = url.split('user/')[1];
    this.uid=userId;
    if (userId === 'new') {
      this.formDisabled = false;
      return;
    }
    //
    this.userApiClient.getUserById(+userId).subscribe(user => {
      this.registerForm.patchValue(user);
      //关闭表单输入
      // this.registerForm.disable();
    });

  }
  onSubmit() {
      let WarringMessage="User created success";
      this.submitted = true;
      // stop here if form is invalid
      if (this.registerForm.invalid) {
        Object.keys(this.registerForm.controls).forEach(key => {
          this.registerForm.controls[key].markAsDirty();
        });
        this.registerForm.updateValueAndValidity();
        return;
      }
    if (this.formDisabled==true) {
      alert(this.uid);
      this.userApiClient.delete(Number(this.uid)).subscribe({
        next: () => {
          // reload user list
          this.ngOnInit();
        },
        error: (message) => {
          alert(JSON.stringify(message));
        }
      })
      WarringMessage="User update success";
    }
      this.userApiClient.create(this.registerForm.value).subscribe(() => {
        alert(WarringMessage);
      });

  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

}

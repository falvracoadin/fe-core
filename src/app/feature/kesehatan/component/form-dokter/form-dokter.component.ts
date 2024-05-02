import { Component, OnInit } from '@angular/core';

// import Stepper from 'bs-stepper';


@Component({
  selector: 'app-form-dokter',
  templateUrl: './form-dokter.component.html',
  styleUrls: ['./form-dokter.component.scss']
})

export class FormDokterComponent implements OnInit {
  // private stepper: Stepper;
  currentStep: number = 1;
  stepWidths = [15, 40, 65, 100];

  constructor() { }


  ngOnInit() {
    // this.stepper = new Stepper(document.querySelector('#stepper1'), {
    //   linear: true,
    //   animation: true
    // })
  }

  nextStep(step: number) {
    this.updateNextStep(this.currentStep);
    this.currentStep = step;
    // this.stepper.next();
  }

  prevStep(step: number) {
    this.updatePrevStep(this.currentStep);
    this.currentStep = step;
    // this.stepper.previous();
  }

  onSubmit() {
    return false;
  }

  updateNextStep(step: number) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((el, index) => {
      if (index === step - 1) {
        console.log('next');
        el.classList.add('prev-step');
      }
    });
  }

  updatePrevStep(step: number) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((el, index) => {
      if (index === step - 2) {
        console.log('prev');
        el.classList.remove('prev-step');
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';

import { LoaderService } from '../../core/services/loader-service/loader.service';

@Component({
  selector: 'app-loader',
  template: `
        <div class="progress-loader" [hidden]="!loading">
            <div class="loading-spinner">
                <img src="assets/images/loader.svg">
                <span class="loading-message">Please wait...</span>
            </div>
        </div>
  `,
  styles: [`
        .loading-spinner{    
            background-color: #ffffff00;
            position: fixed;
            width: 100%;
            top: 0px;
            left: 0px;
            z-index: 1100;
            height: 100vh;
            align-items: center;
            justify-content: center;
            display: grid;
        }

        .loading-spinner img{
            align-self: end;
        }

        .loading-message{
            text-align: center;
            align-self: start;
        }`
    ]
})
export class AppLoaderComponent implements OnInit {

  loading!: boolean;

  constructor(private loaderService: LoaderService) {

    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}
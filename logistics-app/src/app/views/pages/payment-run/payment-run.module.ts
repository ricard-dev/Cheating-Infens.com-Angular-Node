import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeApiService } from '../../../core/_base/layout';
import { NgxPermissionsModule } from 'ngx-permissions';
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';

import { PaymentRunRoutingModule } from './payment-run-routing.module';
import { PaymentRunComponent } from './payment-run.component';

import { ApplicationPipesModule } from './../application-pipes.module';
import { DataTablesModule } from 'angular-datatables';
import { Daterangepicker } from 'ng2-daterangepicker';
import {NgxMaskModule} from 'ngx-mask'
import { NgxCurrencyModule } from "ngx-currency";



export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: true
};

@NgModule({
  imports: [
      MatDialogModule,
      CommonModule,
      HttpClientModule,
      PartialsModule,
      NgxPermissionsModule.forChild(),
      FormsModule,
      ReactiveFormsModule,
      TranslateModule.forChild(),
      MatButtonModule,
      MatMenuModule,
      MatSelectModule,
      MatInputModule,
      MatTableModule,
      MatAutocompleteModule,
      MatRadioModule,
      MatIconModule,
      MatNativeDateModule,
      MatProgressBarModule,
      MatDatepickerModule,
      MatCardModule,
      MatPaginatorModule,
      MatSortModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatSnackBarModule,
      MatTabsModule,
	  MatTooltipModule,
	  MatSlideToggleModule,
      NgbProgressbarModule,
      environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false
      }) : [],
      PartialsModule,
      CoreModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}
      }),
      NgbModule,
      ApplicationPipesModule,
    DataTablesModule,
    Daterangepicker,
    NgxMaskModule,
	NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
	PaymentRunRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
  declarations: [
	PaymentRunComponent
  ]
})
export class PaymentRunModule { }


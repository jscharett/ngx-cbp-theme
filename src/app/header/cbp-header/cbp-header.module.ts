import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CBPHeaderComponent} from './cbp-header.component';
import {MdIconModule, MdListModule, MdMenuModule, MdToolbarModule, MdButtonModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CBPUserModule} from '../../user/user.module';
import {CBPApplicationsModule} from '../../applications/applications.module';


@NgModule({
  imports: [
      CommonModule,
      MdListModule,
      MdMenuModule,
      MdToolbarModule,
      FlexLayoutModule,
      MdIconModule,
      MdButtonModule,
      CBPUserModule,
      CBPApplicationsModule
  ],
  declarations: [CBPHeaderComponent],
  exports: [CBPHeaderComponent, MdButtonModule, CBPUserModule, CBPApplicationsModule]
})
export class CBPHeaderModule { }

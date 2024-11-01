import { NgModule } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { GifContainerComponent } from './components/gif-container/gif-container.component';
import { UploadInfoComponent } from './components/upload-info/upload-info.component';
import { MainComponent } from './main.component';
import { routes } from './main.routes';

@NgModule({
  declarations: [MainComponent],
  imports: [
    NgIf,
    RouterModule.forChild(routes),
    ButtonComponent,
    NgForOf,
    GifContainerComponent,
    UploadInfoComponent,
  ],
})
export class MainModule {}

import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { NgForOf, AsyncPipe } from '@angular/common';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { GifContainerComponent } from '../gif-container/gif-container.component';
import { UploadInfoComponent } from '../upload-info/upload-info.component';
import { GifService } from '../../../../core/services/gif.service';
import { IButton } from '../../../../core/interfaces/button.interface';
import { buttonConfig } from '../../../../core/constants/button.constant';
import { IGif } from '../../../../core/interfaces/gif.interface';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ButtonComponent,
    GifContainerComponent,
    NgForOf,
    UploadInfoComponent,
    AsyncPipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnDestroy {
  public gifService: GifService = inject(GifService);
  public renderer2: Renderer2 = inject(Renderer2);
  public gif$: Observable<IGif> = new Observable<IGif>();
  public errorMessage: string = '';
  public file: File | undefined = undefined;
  public buttonMap: IButton[] = buttonConfig;
  public loading: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('fileUpload') fileUploadRef: ElementRef<HTMLInputElement>;

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public downloadFile(): void {
    this.renderer2.selectRootElement(this.fileUploadRef.nativeElement).click();
  }

  public onFileSelected(event: Event): void {
    const file: File | undefined = (event.target as HTMLInputElement)
      .files?.[0];

    if (!file) return;

    const allowedTypes = ['video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      this.renderer2.setProperty(this.fileUploadRef.nativeElement, 'value', '');
      this.errorMessage = 'Invalid file type. Please upload an MP4 video.';
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    const videoElement = this.renderer2.createElement('video');
    this.renderer2.setAttribute(videoElement, 'src', videoUrl);
    this.renderer2.listen(videoElement, 'loadedmetadata', () => {
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;
      const videoDuration = videoElement.duration;

      if (videoWidth > 1024 || videoHeight > 768) {
        this.renderer2.setProperty(
          this.fileUploadRef.nativeElement,
          'value',
          ''
        );
        this.errorMessage = 'Video dimensions exceed 1024x768.';
        return;
      }

      if (videoDuration > 10) {
        this.renderer2.setProperty(
          this.fileUploadRef.nativeElement,
          'value',
          ''
        );
        this.errorMessage = 'Video duration exceeds 10 seconds.';
        return;
      }

      this.file = file;
      this.errorMessage = '';
    });

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoUrl);
    };
  }

  public convertToGif(): void {
    this.loading = true;

    if (!this.file) {
      this.errorMessage = 'Please choose a file';
      this.loading = false;
      return;
    }

    this.gifService
      .convertVideoToGIF(this.file)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          const jobId = response.jobId;
          localStorage.setItem('jobId', jobId);
          this.checkJobStatus(jobId);
        },
        error: () => (this.errorMessage = 'Error converting video to GIF.'),
      });
  }

  public checkJobStatus(jobId: string): void {
    const checkStatus = () => {
      if (!localStorage.getItem('jobId')) {
        console.log('Job ID no longer exists. Stopping checks.');
        return;
      }

      this.gifService.getJobStatus(jobId).subscribe({
        next: async (status) => {
          if (status.status !== 'completed') {
            console.log('Job still processing...');
            return;
          }
          this.gif$ = this.gifService.getGif(jobId);
          localStorage.removeItem('jobId');
        },
        error: () => {
          console.error('Error checking job status.');
        },
      });

      setTimeout(checkStatus, 5000);
    };

    checkStatus();
  }

  public trackButton(_: number, button: IButton): string {
    return button.text;
  }

  public downloadGif(gifUrl: string): void {
    const blob: Blob = this.base64ToBlob(gifUrl, 'image/gif');
    const url: string = URL.createObjectURL(blob);

    const a = this.renderer2.createElement('a');
    this.renderer2.setAttribute(a, 'href', url);
    this.renderer2.setAttribute(a, 'download', 'downloaded.gif');

    this.renderer2.appendChild(document.body, a);

    a.click();

    this.renderer2.removeChild(document.body, a);

    URL.revokeObjectURL(url);
  }

  public base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters: string = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);

    for (let i: number = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([byteArray], { type });
  }

  public removeFile(): void {
    this.file = undefined;
    this.renderer2.setProperty(this.fileUploadRef.nativeElement, 'value', '');
  }
}

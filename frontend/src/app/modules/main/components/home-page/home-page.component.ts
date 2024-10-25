import { Component, ElementRef, inject, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { NgForOf } from "@angular/common";

import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { GifContainerComponent } from "../gif-container/gif-container.component";
import { UploadInfoComponent } from "../upload-info/upload-info.component";
import { GifService } from "../../../../core/services/gif.service";
import { IButton } from "../../../../core/interfaces/button.interface";
import { buttonConfig } from "../../../../core/constants/button.constant";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ButtonComponent,
    GifContainerComponent,
    NgForOf,
    UploadInfoComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnDestroy {
  public gifService: GifService = inject(GifService);
  public renderer2: Renderer2 = inject(Renderer2);
  public gifUrl: string | null = null;
  public errorMessage: string = '';
  public file: File | undefined = undefined;
  public buttonMap: IButton[] = buttonConfig;
  public loading: boolean = false;

  private destroy$ = new Subject<void>();

  @ViewChild('fileUpload') fileUploadRef: ElementRef<HTMLInputElement>

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public downloadFile(): void {
    this.renderer2.selectRootElement(this.fileUploadRef.nativeElement).click();
  }

  public onFileSelected(event: Event) {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];

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
        this.renderer2.setProperty(this.fileUploadRef.nativeElement, 'value', '');
        this.errorMessage = 'Video dimensions exceed 1024x768.';
        return;
      }

      if (videoDuration > 10) {
        this.renderer2.setProperty(this.fileUploadRef.nativeElement, 'value', '');
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
      return;
    }

    this.gifService.convertVideoToGIF(this.file)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: blob => {
          const url = URL.createObjectURL(blob);
          this.gifUrl = url;

          const a = this.renderer2.createElement('a');
          this.renderer2.setAttribute(a, 'href', url);
          this.renderer2.setAttribute(a, 'download', 'output.gif');

          this.renderer2.appendChild(document.body, a);
          a.click();
          this.renderer2.removeChild(document.body, a);

          a.addEventListener('click', () => {
            URL.revokeObjectURL(url);
          });
        },
        error: () => this.errorMessage = 'Error converting video to GIF.',
        complete: () => this.loading = false
      });
  }

  public trackButton(_: number, button: IButton): string {
    return button.text;
  }
}

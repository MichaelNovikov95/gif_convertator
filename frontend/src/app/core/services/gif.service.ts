import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.dev';
import { IJobStatusResponse } from '../interfaces/job-status-response.interface';
import { ConvertResponse } from '../interfaces/convert-response.interface';
import { IGif } from '../interfaces/gif.interface';

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private baseUrl: string = environment.BASE_URL;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  convertVideoToGIF(file: File): Observable<ConvertResponse> {
    const formData = new FormData();
    formData.append('video', file, file.name);

    return this.http.post<ConvertResponse>(`${this.baseUrl}/convert`, formData);
  }

  getJobStatus(jobId: string): Observable<IJobStatusResponse> {
    return this.http.get<IJobStatusResponse>(
      `${this.baseUrl}/job-status/${jobId}`
    );
  }

  getGif(jobId: string): Observable<IGif> {
    return this.http.get<IGif>(`${this.baseUrl}/gif/${jobId}`);
  }
}

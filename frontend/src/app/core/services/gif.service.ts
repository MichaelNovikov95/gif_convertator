import { inject, Injectable } from '@angular/core';
import { environment } from "../../../environments/environment.dev";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GifService {
private baseUrl: string = environment.BASE_URL;
private http: HttpClient = inject(HttpClient);

  constructor() { }

  convertVideoToGIF(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('video', file, file.name);

    return this.http.post<Blob>(`${this.baseUrl}/convert`, formData, {
      responseType: 'blob' as 'json'
    });
  }
}

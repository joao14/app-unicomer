import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { throwError } from 'rxjs'



@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private http: HttpClient) { }


  processDocument(formData: FormData) {

    return this.http.post<any>(environment.documentai, formData)
      .toPromise()
      .then(data => data);
  }

}

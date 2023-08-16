import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, retry } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, public toster: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        if (error.error.message || error.error.message === "jwt malformed"
        || error.error.message === "jwt expired") {
          this.router.navigate(['/auth/login'])
          this.toster.error(error.error.message)
          localStorage.removeItem('token')
        }
        throw error;
      })
    );
  }
}

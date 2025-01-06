import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";

export const authInteptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    console.log(req)
    return next(req)
}
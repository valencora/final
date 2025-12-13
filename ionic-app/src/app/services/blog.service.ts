import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Blog {
  id?: number;
  name: string;
  handle: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8080/api/blogs';
  private token: string | null = null;
  private readonly BLOGS_CACHE_KEY = 'cached_blogs';
  private readonly TOKEN_KEY = 'authToken';

  constructor(private http: HttpClient) {
    // Get token from localStorage
    this.token = localStorage.getItem(this.TOKEN_KEY);
  }

  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  private getCachedBlogs(): Blog[] {
    try {
      const cached = localStorage.getItem(this.BLOGS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Error reading cached blogs:', e);
    }
    return [];
  }

  private setCachedBlogs(blogs: Blog[]): void {
    try {
      localStorage.setItem(this.BLOGS_CACHE_KEY, JSON.stringify(blogs));
    } catch (e) {
      console.error('Error caching blogs:', e);
    }
  }

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(blogs => {
        // Guardar en caché cuando se obtienen exitosamente
        this.setCachedBlogs(blogs);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Network error, trying cache:', error);
        // Si hay error de red, intentar usar caché
        const cached = this.getCachedBlogs();
        if (cached.length > 0) {
          return of(cached);
        }
        return throwError(() => error);
      })
    );
  }

  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getBlogByHandle(handle: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/handle/${handle}`, { headers: this.getHeaders() });
  }

  createBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blog, { headers: this.getHeaders() });
  }

  updateBlog(id: number, blog: Blog): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, blog, { headers: this.getHeaders() });
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  login(username: string, password: string): Observable<string> {
    return this.http.post<{ id_token: string }>('http://localhost:8080/api/authenticate', {
      username,
      password
    }).pipe(
      map(response => {
        this.setAuthToken(response.id_token);
        return response.id_token;
      }),
      catchError((error: HttpErrorResponse) => {
        // Si hay un token en caché, usarlo silenciosamente
        const cachedToken = localStorage.getItem(this.TOKEN_KEY);
        if (cachedToken) {
          this.token = cachedToken;
          return of(cachedToken);
        }
        // Si no hay token, fallar silenciosamente (modo offline sin auth)
        console.log('Login no disponible (modo offline)');
        return of('');
      })
    );
  }
}


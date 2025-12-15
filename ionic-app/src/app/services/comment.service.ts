import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Comment {
  id?: number;
  text: string;
  date?: string;
  post?: {
    id?: number;
    title?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';
  private token: string | null = null;
  private readonly COMMENTS_CACHE_KEY = 'cached_comments';
  private readonly TOKEN_KEY = 'authToken';

  constructor(private http: HttpClient) {
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

  private getCachedComments(): Comment[] {
    try {
      const cached = localStorage.getItem(this.COMMENTS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Error reading cached comments:', e);
    }
    return [];
  }

  private setCachedComments(comments: Comment[]): void {
    try {
      localStorage.setItem(this.COMMENTS_CACHE_KEY, JSON.stringify(comments));
    } catch (e) {
      console.error('Error caching comments:', e);
    }
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?eagerload=true`, { headers: this.getHeaders() }).pipe(
      tap(comments => {
        this.setCachedComments(comments);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Network error, trying cache:', error);
        const cached = this.getCachedComments();
        if (cached.length > 0) {
          return of(cached);
        }
        return throwError(() => error);
      })
    );
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.getAllComments().pipe(
      map(comments => comments.filter(comment => comment.post?.id === postId))
    );
  }
}


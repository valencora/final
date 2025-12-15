import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Post {
  id?: number;
  title: string;
  content: string;
  date?: string;
  blog?: {
    id?: number;
    name?: string;
    handle?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';
  private token: string | null = null;
  private readonly POSTS_CACHE_KEY = 'cached_posts';
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

  private getCachedPosts(): Post[] {
    try {
      const cached = localStorage.getItem(this.POSTS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Error reading cached posts:', e);
    }
    return [];
  }

  private setCachedPosts(posts: Post[]): void {
    try {
      localStorage.setItem(this.POSTS_CACHE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Error caching posts:', e);
    }
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?eagerload=true`, { headers: this.getHeaders() }).pipe(
      tap(posts => {
        this.setCachedPosts(posts);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Network error, trying cache:', error);
        const cached = this.getCachedPosts();
        if (cached.length > 0) {
          return of(cached);
        }
        return throwError(() => error);
      })
    );
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getPostsByBlog(blogId: number): Observable<Post[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => post.blog?.id === blogId))
    );
  }
}


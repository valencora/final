import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BlogService, Blog } from '../../services/blog.service';
import { PostService, Post } from '../../services/post.service';
import { CommentService, Comment } from '../../services/comment.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

interface BlogWithPosts extends Blog {
  posts?: PostWithComments[];
  expanded?: boolean;
}

interface PostWithComments extends Post {
  comments?: Comment[];
  expanded?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  blogs: BlogWithPosts[] = [];
  allPosts: Post[] = [];
  allComments: Comment[] = [];
  loading = false;

  constructor(
    private blogService: BlogService,
    private postService: PostService,
    private commentService: CommentService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.login();
    await this.loadAllData();
  }

  async login() {
    try {
      const token = await firstValueFrom(this.blogService.login('admin', 'admin'));
      this.postService.setAuthToken(token);
      this.commentService.setAuthToken(token);
    } catch (error) {
      // Falla silenciosamente - la app puede funcionar offline
      console.log('Login no disponible (modo offline)');
    }
  }

  async loadAllData() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();

    try {
      // Cargar blogs, posts y comentarios en paralelo
      const [blogs, posts, comments] = await Promise.all([
        firstValueFrom(this.blogService.getAllBlogs()).catch(() => []),
        firstValueFrom(this.postService.getAllPosts()).catch(() => []),
        firstValueFrom(this.commentService.getAllComments()).catch(() => [])
      ]);

      this.blogs = blogs || [];
      this.allPosts = posts || [];
      this.allComments = comments || [];

      // Asociar posts con blogs y comentarios con posts
      this.blogs = this.blogs.map(blog => {
        const blogPosts = this.allPosts
          .filter(post => post.blog?.id === blog.id)
          .map(post => {
            const postComments = this.allComments.filter(
              comment => comment.post?.id === post.id
            );
            return {
              ...post,
              comments: postComments,
              expanded: false
            } as PostWithComments;
          });

        console.log(`Blog "${blog.name}" tiene ${blogPosts.length} posts`);
        blogPosts.forEach(post => {
          console.log(`  Post "${post.title}" tiene ${post.comments?.length || 0} comentarios`);
        });

        return {
          ...blog,
          posts: blogPosts,
          expanded: false
        } as BlogWithPosts;
      });
      
      console.log('Total blogs:', this.blogs.length);
      console.log('Total posts:', this.allPosts.length);
      console.log('Total comments:', this.allComments.length);
    } catch (error: any) {
      console.log('Error loading data, usando caché si está disponible');
    } finally {
      await loading.dismiss();
    }
  }

  toggleBlog(blog: BlogWithPosts) {
    console.log('Toggle blog:', blog.name, 'Current expanded:', blog.expanded);
    blog.expanded = !blog.expanded;
    console.log('New expanded:', blog.expanded);
    console.log('Posts count:', blog.posts?.length);
    this.cdr.detectChanges();
  }

  togglePost(post: PostWithComments) {
    console.log('Toggle post:', post.title, 'Current expanded:', post.expanded);
    post.expanded = !post.expanded;
    console.log('New expanded:', post.expanded);
    console.log('Comments count:', post.comments?.length);
    this.cdr.detectChanges();
  }

  async refresh(event: any) {
    await this.loadAllData();
    event.target.complete();
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}


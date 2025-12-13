package com.blog.app.service;

import com.blog.app.domain.Blog;
import com.blog.app.repository.BlogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogServiceTest {

    @Mock
    private BlogRepository blogRepository;

    @InjectMocks
    private BlogService blogService;

    private Blog blog;

    @BeforeEach
    void setUp() {
        blog = new Blog();
        blog.setId(1L);
        blog.setName("Test Blog");
        blog.setHandle("test-blog");
        blog.setDescription("Test Description");
    }

    @Test
    void testSaveBlog() {
        when(blogRepository.save(any(Blog.class))).thenReturn(blog);

        Blog result = blogService.save(blog);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Test Blog");
        assertThat(result.getHandle()).isEqualTo("test-blog");
        verify(blogRepository, times(1)).save(blog);
    }

    @Test
    void testFindAllBlogs() {
        Blog blog2 = new Blog();
        blog2.setId(2L);
        blog2.setName("Another Blog");
        blog2.setHandle("another-blog");

        when(blogRepository.findAll()).thenReturn(Arrays.asList(blog, blog2));

        List<Blog> result = blogService.findAll();

        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);
        assertThat(result).contains(blog, blog2);
        verify(blogRepository, times(1)).findAll();
    }

    @Test
    void testFindOneBlog() {
        when(blogRepository.findById(1L)).thenReturn(Optional.of(blog));

        Optional<Blog> result = blogService.findOne(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getName()).isEqualTo("Test Blog");
        verify(blogRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByHandle() {
        when(blogRepository.findByHandle("test-blog")).thenReturn(Optional.of(blog));

        Optional<Blog> result = blogService.findByHandle("test-blog");

        assertThat(result).isPresent();
        assertThat(result.get().getHandle()).isEqualTo("test-blog");
        verify(blogRepository, times(1)).findByHandle("test-blog");
    }

    @Test
    void testDeleteBlog() {
        doNothing().when(blogRepository).deleteById(1L);

        blogService.delete(1L);

        verify(blogRepository, times(1)).deleteById(1L);
    }
}


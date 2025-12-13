package com.blog.app.service;

import com.blog.app.domain.Blog;
import com.blog.app.repository.BlogRepository;
import com.blog.app.service.dto.BlogDTO;
import com.blog.app.service.mapper.BlogMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogServiceTest {

    @Mock
    private BlogRepository blogRepository;

    @Mock
    private BlogMapper blogMapper;

    @InjectMocks
    private BlogService blogService;

    private Blog blog;
    private BlogDTO blogDTO;

    @BeforeEach
    void setUp() {
        blog = new Blog();
        blog.setId(1L);
        blog.setName("Test Blog");
        blog.setHandle("test-blog");
        blog.setDescription("Test Description");

        blogDTO = new BlogDTO();
        blogDTO.setId(1L);
        blogDTO.setName("Test Blog");
        blogDTO.setHandle("test-blog");
        blogDTO.setDescription("Test Description");
    }

    @Test
    void testSaveBlog() {
        when(blogMapper.toEntity(any(BlogDTO.class))).thenReturn(blog);
        when(blogRepository.save(any(Blog.class))).thenReturn(blog);
        when(blogMapper.toDto(any(Blog.class))).thenReturn(blogDTO);

        BlogDTO result = blogService.save(blogDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Test Blog");
        assertThat(result.getHandle()).isEqualTo("test-blog");
        verify(blogRepository, times(1)).save(any(Blog.class));
    }

    @Test
    void testFindAllBlogs() {
        Blog blog2 = new Blog();
        blog2.setId(2L);
        blog2.setName("Another Blog");
        blog2.setHandle("another-blog");

        BlogDTO blogDTO2 = new BlogDTO();
        blogDTO2.setId(2L);
        blogDTO2.setName("Another Blog");
        blogDTO2.setHandle("another-blog");

        Pageable pageable = Pageable.unpaged();
        Page<Blog> blogPage = new PageImpl<>(Arrays.asList(blog, blog2), pageable, 2);

        when(blogRepository.findAll(pageable)).thenReturn(blogPage);
        when(blogMapper.toDto(blog)).thenReturn(blogDTO);
        when(blogMapper.toDto(blog2)).thenReturn(blogDTO2);

        Page<BlogDTO> result = blogService.findAll(pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent().size()).isEqualTo(2);
        verify(blogRepository, times(1)).findAll(pageable);
    }

    @Test
    void testFindOneBlog() {
        when(blogRepository.findById(1L)).thenReturn(Optional.of(blog));
        when(blogMapper.toDto(blog)).thenReturn(blogDTO);

        Optional<BlogDTO> result = blogService.findOne(1L);

        assertThat(result).isPresent();
        BlogDTO dto = result.orElseThrow();
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getName()).isEqualTo("Test Blog");
        verify(blogRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByHandle() {
        when(blogRepository.findByHandle("test-blog")).thenReturn(Optional.of(blog));
        when(blogMapper.toDto(blog)).thenReturn(blogDTO);

        Optional<BlogDTO> result = blogService.findByHandle("test-blog");

        assertThat(result).isPresent();
        BlogDTO dto = result.orElseThrow();
        assertThat(dto.getHandle()).isEqualTo("test-blog");
        verify(blogRepository, times(1)).findByHandle("test-blog");
    }

    @Test
    void testDeleteBlog() {
        doNothing().when(blogRepository).deleteById(1L);

        blogService.delete(1L);

        verify(blogRepository, times(1)).deleteById(1L);
    }
}


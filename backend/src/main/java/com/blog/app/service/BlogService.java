package com.blog.app.service;

import com.blog.app.domain.Blog;
import com.blog.app.repository.BlogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BlogService {

    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public Blog save(Blog blog) {
        return blogRepository.save(blog);
    }

    @Transactional(readOnly = true)
    public List<Blog> findAll() {
        return blogRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Blog> findOne(Long id) {
        return blogRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Blog> findByHandle(String handle) {
        return blogRepository.findByHandle(handle);
    }

    public void delete(Long id) {
        blogRepository.deleteById(id);
    }
}


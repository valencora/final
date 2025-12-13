package com.blog.app.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BlogTest {

    private Blog blog1;
    private Blog blog2;

    @BeforeEach
    void setUp() {
        blog1 = new Blog();
        blog1.setId(1L);
        blog1.setName("Test Blog");
        blog1.setHandle("test-blog");
        blog1.setDescription("Test Description");

        blog2 = new Blog();
        blog2.setId(1L);
        blog2.setName("Another Blog");
        blog2.setHandle("another-blog");
    }

    @Test
    void testEquals() {
        assertThat(blog1).isEqualTo(blog2);
        assertThat(blog1.hashCode()).isEqualTo(blog2.hashCode());
    }

    @Test
    void testNotEquals() {
        blog2.setId(2L);
        assertThat(blog1).isNotEqualTo(blog2);
    }

    @Test
    void testFluentMethods() {
        Blog blog = new Blog()
            .name("Fluent Blog")
            .handle("fluent-blog")
            .description("Fluent Description");

        assertThat(blog.getName()).isEqualTo("Fluent Blog");
        assertThat(blog.getHandle()).isEqualTo("fluent-blog");
        assertThat(blog.getDescription()).isEqualTo("Fluent Description");
    }

    @Test
    void testToString() {
        String toString = blog1.toString();
        assertThat(toString).contains("Test Blog");
        assertThat(toString).contains("test-blog");
    }
}


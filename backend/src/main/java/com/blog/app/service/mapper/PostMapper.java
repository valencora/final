package com.blog.app.service.mapper;

import com.blog.app.domain.Blog;
import com.blog.app.domain.Post;
import com.blog.app.service.dto.BlogDTO;
import com.blog.app.service.dto.PostDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Post} and its DTO {@link PostDTO}.
 */
@Mapper(componentModel = "spring")
public interface PostMapper extends EntityMapper<PostDTO, Post> {
    @Mapping(target = "blog", source = "blog", qualifiedByName = "blogHandle")
    PostDTO toDto(Post s);

    @Named("blogHandle")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "handle", source = "handle")
    BlogDTO toDtoBlogHandle(Blog blog);
}

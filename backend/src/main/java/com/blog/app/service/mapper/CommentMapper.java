package com.blog.app.service.mapper;

import com.blog.app.domain.Comment;
import com.blog.app.domain.Post;
import com.blog.app.service.dto.CommentDTO;
import com.blog.app.service.dto.PostDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring")
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "post", source = "post", qualifiedByName = "postTitle")
    CommentDTO toDto(Comment s);

    @Named("postTitle")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    PostDTO toDtoPostTitle(Post post);
}

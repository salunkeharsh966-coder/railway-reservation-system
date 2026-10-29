package com.example.railway.dto;

import lombok.*;

/** Simple message envelope for endpoints that return no entity. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String message;
}

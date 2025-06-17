package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ErrorResponse {
    private String error;
    private List<String> messages;

    public ErrorResponse() {}
    public ErrorResponse(String message) {
        this.messages = List.of(message);
    }
}

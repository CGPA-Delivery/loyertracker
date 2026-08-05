package com.loyertracker.notifications.provider.resend;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import org.junit.jupiter.api.Test;

class ResendSignatureVerifierTest {

    @Test
    void secretBase64InvalideEstRejeteSansException() {
        ResendSignatureVerifier verifier = new ResendSignatureVerifier("whsec_pas-du-base64!");

        boolean valide = verifier.estValide(
                "msg-test",
                String.valueOf(Instant.now().getEpochSecond()),
                "v1,signature",
                "{}");

        assertThat(valide).isFalse();
    }
}

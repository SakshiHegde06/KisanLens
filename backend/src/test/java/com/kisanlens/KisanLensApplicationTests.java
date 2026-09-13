package com.kisanlens;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Disabled by default: a real context load needs a running MongoDB instance
// (embedded Mongo isn't wired up for the capstone scope). Enable this once
// you have MongoDB running locally, or point it at a Testcontainers instance.
@SpringBootTest
class KisanLensApplicationTests {

    @Test
    @Disabled("Requires a running MongoDB instance - see comment above")
    void contextLoads() {
    }
}

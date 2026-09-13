package com.kisanlens.weather;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class WeatherClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String apiKey;

    public WeatherClient(
            RestTemplate restTemplate,
            @Value("${kisanlens.weather.base-url}") String baseUrl,
            @Value("${kisanlens.weather.api-key}") String apiKey
    ) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    public WeatherSnapshot getCurrentWeather(double latitude, double longitude) {
        if (apiKey == null || apiKey.isBlank()) {
            // No key configured yet (common during early dev) - fall back to
            // a neutral placeholder rather than crashing the whole scan flow.
            return new WeatherSnapshot(25.0, 0.0, 60.0);
        }

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/weather")
                .queryParam("lat", latitude)
                .queryParam("lon", longitude)
                .queryParam("appid", apiKey)
                .queryParam("units", "metric")
                .toUriString();

        try {
            OpenWeatherResponse response = restTemplate.getForObject(url, OpenWeatherResponse.class);
            if (response == null || response.main() == null) {
                return new WeatherSnapshot(25.0, 0.0, 60.0);
            }
            double rainfall = response.rain() != null ? response.rain().oneHour() : 0.0;
            return new WeatherSnapshot(response.main().temp(), rainfall, response.main().humidity());
        } catch (RestClientException e) {
            // Weather is an enhancement, not a hard dependency - a farmer should
            // still get a soil-only recommendation if this call fails.
            return new WeatherSnapshot(25.0, 0.0, 60.0);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenWeatherResponse(Main main, Rain rain) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Main(double temp, double humidity) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Rain(@JsonProperty("1h") double oneHour) {
    }
}

package backend.api.weather.clients

import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import ru.backend.weather.configuration.OpenWeatherMapClientConfiguration

@Component
class OpenWeatherMapClient(
    private val config: OpenWeatherMapClientConfiguration,
    restClientBuilder: RestClient.Builder,
) : WeatherInfoClient {

    private val client: RestClient = restClientBuilder
        .baseUrl(config.url)
        .build()

    override fun getCurrentWeather(
        city: String,
        units: String,
        lang: String,
    ): Map<String, Any> {
        @Suppress("UNCHECKED_CAST")
        return client.get()
            .uri { uriBuilder ->
                uriBuilder
                    .path("/weather")
                    .queryParam("q", city)
                    .queryParam("units", units)
                    .queryParam("lang", lang)
                    .queryParam("appid", config.token)
                    .build()
            }
            .retrieve()
            .body(Map::class.java) as Map<String, Any>
    }
}
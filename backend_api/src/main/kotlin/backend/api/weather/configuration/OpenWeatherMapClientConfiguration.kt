package ru.backend.weather.configuration

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("clients.openweathermap")
 class OpenWeatherMapClientConfiguration(
    val url: String = "",
    val token: String = "",
)

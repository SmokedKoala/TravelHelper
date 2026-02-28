package backend.api.weather.controllers.manage

import backend.api.weather.clients.WeatherInfoClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/weather")
class WeatherApiManageController(
    private val weatherInfoClient: WeatherInfoClient,
) {

    @GetMapping("/test")
    fun testWeather(
        @RequestParam city: String = "Moscow",
        @RequestParam units: String = "metric",
        @RequestParam lang: String = "ru",
    ): Map<String, Any> =
        weatherInfoClient.getCurrentWeather(city, units, lang)
}
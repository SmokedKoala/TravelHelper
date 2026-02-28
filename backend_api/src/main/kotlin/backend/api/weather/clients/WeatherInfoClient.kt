package backend.api.weather.clients

interface WeatherInfoClient {

    fun getCurrentWeather(
        city: String,
        units: String = "metric",
        lang: String = "ru",
    ): Map<String, Any>
}
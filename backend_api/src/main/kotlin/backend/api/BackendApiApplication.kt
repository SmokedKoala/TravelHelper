package backend.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import ru.backend.weather.configuration.OpenWeatherMapClientConfiguration

@EnableConfigurationProperties(
    OpenWeatherMapClientConfiguration::class
)

@SpringBootApplication
class BackendApiApplication

fun main(args: Array<String>) {
    runApplication<BackendApiApplication>(*args)
}

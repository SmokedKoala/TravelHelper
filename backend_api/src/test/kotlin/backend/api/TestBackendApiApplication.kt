package backend.api

import org.springframework.boot.fromApplication
import org.springframework.boot.with


fun main(args: Array<String>) {
    fromApplication<BackendApiApplication>().with(TestcontainersConfiguration::class).run(*args)
}

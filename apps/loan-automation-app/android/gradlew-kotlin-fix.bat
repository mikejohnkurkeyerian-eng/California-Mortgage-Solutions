@echo off
rem Gradle wrapper that passes Kotlin compiler flags to skip metadata version check
set GRADLE_OPTS=-Dorg.gradle.jvmargs="-Xmx2048m -XX:MaxMetaspaceSize=512m"
call gradlew.bat %* -Pkotlin.daemon.jvmargs="-Xskip-metadata-version-check"


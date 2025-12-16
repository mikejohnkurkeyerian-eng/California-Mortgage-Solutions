@echo off
rem Gradle wrapper with Kotlin metadata skip flag
set GRADLE_OPTS=-Dorg.gradle.jvmargs="-Xmx2048m -XX:MaxMetaspaceSize=512m -Dkotlin.daemon.jvm.options=-Xskip-metadata-version-check"
call gradlew.bat %*


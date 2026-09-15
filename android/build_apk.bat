@echo off
set "JAVA_HOME=D:\sdk\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Users\mma_7\AppData\Local\Android\Sdk"

echo Using JAVA_HOME=%JAVA_HOME%
echo Using ANDROID_HOME=%ANDROID_HOME%
java -version

call gradlew.bat assembleRelease %*

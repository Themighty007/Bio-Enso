/*
 * =========================================================================
 * BioENSO - ESP32 Hardware Edge Node Firmware
 * =========================================================================
 * Components:
 *   - ESP32 NodeMCU / DevKit
 *   - DHT22 (Temperature & Humidity) -> Pin D4 (GPIO 4)
 *   - Water Level Sensor (Analog)    -> Pin D34 (GPIO 34 / ADC1)
 *   - 5V Fan Relay / NPN Transistor  -> Pin D5 (GPIO 5)
 *   - Battery Supply (3.7V - 5V)
 * =========================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ----------------- CONFIGURATION -----------------
const char* WIFI_SSID     = "YOUR_WIFI_NAME";        // Or mobile hotspot
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// IP address of the laptop running BioENSO (port 8000)
// Check laptop IP using: ipconfig in Command Prompt (e.g. 192.168.1.15)
const char* SERVER_URL    = "http://192.168.1.100:8000/api/v1/hardware/telemetry";

#define DHTPIN 4
#define DHTTYPE DHT22
#define WATER_PIN 34
#define FAN_PIN 5

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n[BioENSO] Initializing Hardware Node...");

  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(FAN_PIN, LOW); // Fan off by default

  dht.begin();

  // Connect to Wi-Fi
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully!");
    Serial.print("[WiFi] Node IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WiFi] Connection timeout. Running in local fail-safe mode.");
  }
}

void loop() {
  // 1. Read Sensors
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Fallback if sensor read fails
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[DHT22] Warning: Failed to read from DHT sensor!");
    temperature = 32.0;
    humidity = 55.0;
  }

  // Read Water Level (0 - 4095 on ESP32 ADC)
  int rawWater = analogRead(WATER_PIN);
  // Map raw reading to percentage (0 - 100%)
  int waterLevelPct = map(constrain(rawWater, 0, 3000), 0, 3000, 0, 100);

  Serial.printf("\n[SENSORS] Temp: %.1f C | Humidity: %.1f %% | Water Level: %d %%\n",
                temperature, humidity, waterLevelPct);

  // 2. Local Fallback Actuator Logic (Runs even if Wi-Fi disconnects)
  bool localFanTrigger = (temperature >= 35.0);

  // 3. Send Telemetry to BioENSO Server & Receive Actuator Command
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    // Prepare JSON payload
    StaticJsonDocument<200> doc;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["water_level"] = waterLevelPct;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("[API Response] ");
      Serial.println(response);

      // Parse server actuator command
      StaticJsonDocument<256> respDoc;
      DeserializationError err = deserializeJson(respDoc, response);

      if (!err && respDoc.containsKey("fan")) {
        bool serverFanCommand = respDoc["fan"];
        digitalWrite(FAN_PIN, serverFanCommand ? HIGH : LOW);
        Serial.printf("[ACTUATOR] Fan state set by server: %s\n", serverFanCommand ? "ON" : "OFF");
      }
    } else {
      Serial.printf("[HTTP] Error sending POST: %d. Using local logic.\n", httpResponseCode);
      digitalWrite(FAN_PIN, localFanTrigger ? HIGH : LOW);
    }
    http.end();
  } else {
    // Offline local protection mode
    digitalWrite(FAN_PIN, localFanTrigger ? HIGH : LOW);
    Serial.printf("[ACTUATOR] Offline auto fan: %s\n", localFanTrigger ? "ON" : "OFF");
  }

  delay(1500); // Poll every 1.5 seconds for snappy demo response
}

ARTICLE = {
    id: "arduino-ultrasonic",
    title: "Arduino Ultrasonic: Cara Kerja & Contoh Project",
    tags: ["Arduino","Sensor","HC-SR04"],
    thumbnail: "img/thumbnail1.jpg",
    gallery: [
        "img/ultrasonic1.jpg","img/ultrasonic2.jpg","img/ultrasonic3.jpg",
        "img/ultrasonic4.jpg","img/ultrasonic5.jpg","img/ultrasonic6.jpg",
        "img/ultrasonic7.jpg","img/ultrasonic8.jpg"
    ],
    content: "<p>Belajar membuat sensor jarak otomatis dengan HC-SR04 menggunakan Arduino.</p>",
    sub: [
        { 
            subtitle: "Pengantar", 
            body: "<p>Sensor ultrasonic HC-SR04 digunakan untuk mengukur jarak.</p>" 
        },
        { 
            subtitle: "CODE C++", 
            body: `
<pre><code>
#include &lt;Adafruit_NeoPixel.h&gt;
#ifdef __AVR__
#include &ltavr/power.h&gt;
#endif

// ------------------- Konfigurasi LED -------------------
#define LED_PIN     6
#define LED_COUNT   60
#define BRIGHTNESS  50

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRBW + NEO_KHZ800);

// ------------------- Setup -------------------
void setup() {
#if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);  // Tingkatkan prescaler jika menggunakan ATtiny85
#endif

  strip.begin();           
  strip.show();            // Matikan semua LED di awal
  strip.setBrightness(BRIGHTNESS);
}

// ------------------- Loop utama -------------------
void loop() {
  // Efek dasar warna
  colorWipe(strip.Color(255, 0, 0), 50);        // Merah
  colorWipe(strip.Color(0, 255, 0), 50);        // Hijau
  colorWipe(strip.Color(0, 0, 255), 50);        // Biru
  colorWipe(strip.Color(0, 0, 0, 255), 50);     // Putih

  // Efek khusus
  whiteOverRainbow(75, 5);      // Putih bergerak di atas pelangi
  pulseWhite(5);                // Putih memudar masuk dan keluar
  rainbowFade2White(3, 3, 1);   // Pelangi memudar ke putih
}

// ------------------- Fungsi dasar -------------------
void colorWipe(uint32_t color, int wait) {
  for(int i = 0; i < strip.numPixels(); i++) { 
    strip.setPixelColor(i, color);         
    strip.show();                         
    delay(wait);                          
  }
}

// ------------------- Efek Putih di atas Pelangi -------------------
void whiteOverRainbow(int whiteSpeed, int whiteLength) {
  if (whiteLength >= strip.numPixels()) whiteLength = strip.numPixels() - 1;

  int head = whiteLength - 1;
  int tail = 0;
  int loops = 3;
  int loopNum = 0;
  uint32_t lastTime = millis();
  uint32_t firstPixelHue = 0;

  for (;;) { 
    for(int i = 0; i < strip.numPixels(); i++) {  
      if (((i >= tail) && (i <= head)) || ((tail > head) && ((i >= tail) || (i <= head)))) {
        strip.setPixelColor(i, strip.Color(0, 0, 0, 255)); // Putih
      } else {
        int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
        strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue))); // Pelangi
      }
    }
    strip.show(); 
    firstPixelHue += 40; 

    if ((millis() - lastTime) > whiteSpeed) { 
      if (++head >= strip.numPixels()) {      
        head = 0;
        if (++loopNum >= loops) return;
      }
      if (++tail >= strip.numPixels()) tail = 0;
      lastTime = millis();                  
    }
  }
}

// ------------------- Efek Pulse Putih -------------------
void pulseWhite(uint8_t wait) {
  for(int j = 0; j < 256; j++) {
    strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
    strip.show();
    delay(wait);
  }
  for(int j = 255; j >= 0; j--) {
    strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
    strip.show();
    delay(wait);
  }
}

// ------------------- Efek Rainbow Fade ke Putih -------------------
void rainbowFade2White(int wait, int rainbowLoops, int whiteLoops) {
  int fadeVal = 0, fadeMax = 100;

  for (uint32_t firstPixelHue = 0; firstPixelHue < rainbowLoops*65536; firstPixelHue += 256) {
    for (int i = 0; i < strip.numPixels(); i++) { 
      uint32_t pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue, 255, 255 * fadeVal / fadeMax)));
    }
    strip.show();
    delay(wait);

    if (firstPixelHue < 65536) fadeVal = min(fadeVal + 1, fadeMax);
    else if (firstPixelHue >= ((rainbowLoops-1) * 65536)) fadeVal = max(fadeVal - 1, 0);
    else fadeVal = fadeMax;
  }

  for(int k = 0; k < whiteLoops; k++) {
    for(int j = 0; j < 256; j++) {
      strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
      strip.show();
    }
    delay(1000);
    for(int j = 255; j >= 0; j--) {
      strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
      strip.show();
    }
  }
  delay(500);
}

</code></pre>
` 
        }
    ],
    files: [
        { name: "Code Arduino.zip", url: "files/arduino-ultrasonic.zip" }
    ]
};

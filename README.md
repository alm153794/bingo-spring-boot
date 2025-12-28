# Bingo Game with Ethiopian Amharic Sound

A Spring Boot web application for playing Bingo with Ethiopian Amharic voice announcements.

## Features

- **Multiple Bingo Cards**: Generate 1-10 cards per game
- **Ethiopian Amharic Audio**: Letter and number announcements in Amharic
- **Real-time Game Play**: Automatic number calling every 3 seconds
- **Winner Detection**: Checks rows, columns, and diagonals
- **Voice Recorder**: Built-in tool to record custom Amharic sounds
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

```bash
# Clone the repository
git clone https://github.com/alm153794/bingo-spring-boot.git
cd bingo-spring-boot

# Run the application
./mvnw spring-boot:run

# Open browser
http://localhost:8080
```

## Game Rules

- **B Column**: Numbers 1-15
- **I Column**: Numbers 16-30  
- **N Column**: Numbers 31-45 (center is FREE)
- **G Column**: Numbers 46-60
- **O Column**: Numbers 61-75

Win by completing any row, column, or diagonal.

## Sound System

The game includes Ethiopian Amharic pronunciations:
- Letters: B (ቢ), I (አይ), N (ኤን), G (ጂ), O (ኦ)
- Numbers: 1-75 in Amharic
- Format: Letter sound → Number sound (e.g., "ቢ" then "አንድ" for B-1)

## Technology Stack

- **Backend**: Spring Boot 3.x, Java 17+
- **Frontend**: HTML5, CSS3, JavaScript
- **Audio**: MP3/AAC format support
- **Build Tool**: Maven

## Project Structure

```
src/
├── main/
│   ├── java/com/net/alex/bingo/game/
│   │   ├── BingoController.java
│   │   └── BingoGameApplication.java
│   └── resources/
│       ├── static/
│       │   ├── css/bingo.css
│       │   ├── js/bingo.js
│       │   └── sounds/
│       │       ├── letters/
│       │       └── numbers/
│       └── templates/
│           ├── bingo.html
│           └── recorder.html
```

## API Endpoints

- `GET /` - Main game page
- `POST /generate-cards` - Generate bingo cards
- `POST /call-number` - Call next number
- `POST /reset` - Reset game
- `POST /upload-sound` - Upload custom sounds

## Requirements

- Java 17 or higher
- Maven 3.6+
- Modern web browser with audio support

## License

MIT License

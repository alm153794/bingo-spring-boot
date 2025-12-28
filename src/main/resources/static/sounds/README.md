# Sound Files for Bingo Game

This directory contains audio files for the Ethiopian Amharic Bingo game.

## Folder Structure:

### numbers/
- `amharic-1.aac` through `amharic-75.aac` - Amharic number pronunciations
- Example: `amharic-1.aac` (አንድ), `amharic-2.aac` (ሁለት), etc.

### letters/
- `amharic-b.mp3` - Amharic pronunciation of letter "B" (ቢ)
- `amharic-i.mp3` - Amharic pronunciation of letter "I" (አይ) 
- `amharic-n.mp3` - Amharic pronunciation of letter "N" (ኤን)
- `amharic-g.mp3` - Amharic pronunciation of letter "G" (ጂ)
- `amharic-o.mp3` - Amharic pronunciation of letter "O" (ኦ)

## To Add Your Sounds:
1. Put your `.aac` files (amharic-1.aac to amharic-75.aac) in the `numbers/` folder
2. Put letter sound files in the `letters/` folder
3. Restart your Spring Boot application

## Fallback System:
- Letters use Web Speech API if files are missing
- Numbers play beep sound if files are missing
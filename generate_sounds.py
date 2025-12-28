import numpy as np
import wave
import struct

def generate_tone(frequency, duration, sample_rate=44100):
    """Generate a sine wave tone"""
    frames = int(duration * sample_rate)
    wavedata = []
    
    for i in range(frames):
        value = int(32767 * np.sin(2 * np.pi * frequency * i / sample_rate))
        wavedata.append(struct.pack('<h', value))
    
    return b''.join(wavedata)

def create_audio_file(filename, frequency, duration=0.5):
    """Create a WAV file with the specified tone"""
    sample_rate = 44100
    audio_data = generate_tone(frequency, duration, sample_rate)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(audio_data)

# Generate placeholder sounds
sounds = {
    'amharic-b.wav': 440,    # A4
    'amharic-i.wav': 523,    # C5
    'amharic-n.wav': 659,    # E5
    'amharic-g.wav': 784,    # G5
    'amharic-o.wav': 880,    # A5
    'amharic-woman.wav': 330 # E4
}

for filename, frequency in sounds.items():
    create_audio_file(filename, frequency)
    print(f"Generated {filename}")

print("All placeholder audio files generated!")
print("Replace these with real Amharic recordings for better experience.")
"""Original instrumental and UI sound cues synthesized locally for this reel."""
import json, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).parent
SR = 44100
DURATION = json.loads((ROOT / 'timeline.json').read_text())['duration']
rng = np.random.default_rng(381)

def save(name, signal):
    signal = np.clip(signal, -.98, .98)
    with wave.open(str(ROOT / 'assets' / name), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes((signal * 32767).astype('<i2').tobytes())

music = np.zeros(int((DURATION + 1) * SR))
beat = 60 / 108
chords = [[60,64,67,71], [57,60,64,67], [53,57,60,64], [55,59,62,65]]

def add(position, signal, gain):
    begin = int(position * SR)
    end = min(begin + len(signal), len(music))
    if end > begin:
        music[begin:end] += signal[:end-begin] * gain

def pluck(midi, length, bass=False):
    t = np.arange(int(length * SR)) / SR
    f = 440 * 2 ** ((midi-69)/12)
    y = np.sin(2*np.pi*f*t) + .28*np.sin(4*np.pi*f*t) + .08*np.sin(6*np.pi*f*t)
    return y * np.exp(-t*(3.5 if bass else 5)) * np.minimum(t/.006, 1)

for b in range(int(DURATION/beat)+1):
    chord = chords[(b//4)%4]
    if b%2 == 0:
        add(b*beat, pluck(chord[0]-24, .7, True), .17)
    for offset in [.5]:
        for j, note in enumerate(chord):
            add((b+offset)*beat+j*.014, pluck(note+12, .8), .036)
    if b%4 in (1,3):
        t=np.arange(int(.11*SR))/SR
        noise=rng.normal(0,1,len(t))
        noise=np.concatenate(([0],np.diff(noise)))
        add(b*beat,noise*np.exp(-t*55),.014)
    if b%8 in (0,3,6):
        add((b+.75)*beat,pluck(chord[(b//3)%4]+24,.7),.027)

music = music[:int(DURATION*SR)]
music *= np.minimum(np.arange(len(music))/SR/.6,1)
music *= np.minimum((len(music)-np.arange(len(music)))/SR/1.8,1)
save('original-music.wav',music)
t=np.arange(int(.22*SR))/SR
pop=np.sin(2*np.pi*(680*t-700*t*t))*np.exp(-t*28)*np.minimum(t/.003,1)
save('sfx/pop.wav',pop*.6)
t=np.arange(int(.32*SR))/SR
noise=rng.normal(0,1,len(t))
smooth=np.convolve(noise,np.ones(8)/8,mode='same')
save('sfx/whoosh.wav',smooth*np.sin(np.pi*t/.32)**2*.48)
print('Original music, pop and whoosh written locally.')

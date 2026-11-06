"""A short original camera-style click, no sampled recording."""
from pathlib import Path
import wave
import numpy as np
sr=44100
t=np.arange(int(.16*sr))/sr
rng=np.random.default_rng(918)
n=rng.normal(0,1,len(t))
signal=n*np.exp(-t*80)*.20
mask=t>.055
signal[mask]+=n[mask]*np.exp(-(t[mask]-.055)*100)*.14
with wave.open(str(Path(__file__).parent/'assets/sfx/shutter.wav'),'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(sr)
    f.writeframes((np.clip(signal,-.9,.9)*32767).astype('<i2').tobytes())

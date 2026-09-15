"""Shared helpers for video-understanding tests."""
import hashlib
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
TRANSCRIBE = (
    REPO
    / "Technology-Automation"
    / "Scripts"
    / "legacy"
    / "channel-agent"
    / "transcribe.sh"
)
PREPARE = REPO / ".claude" / "skills" / "video-understanding" / "scripts" / "prepare_video.py"
EXTRACT = REPO / ".claude" / "skills" / "video-understanding" / "scripts" / "extract_frames.py"


def make_video(path: Path, seconds: float = 2.0, with_audio: bool = True) -> Path:
    """Synthetic h264 clip via ffmpeg lavfi (fast, no downloads)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-f", "lavfi",
           "-i", f"testsrc=duration={seconds}:size=320x240:rate=10"]
    if with_audio:
        cmd += ["-f", "lavfi", "-i", f"sine=frequency=440:duration={seconds}"]
    cmd += ["-shortest", "-y", str(path)]
    subprocess.run(cmd, check=True, capture_output=True)
    return path


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


MOCK_WHISPER = r'''#!/usr/bin/env bash
# Mock whisper CLI: writes fixture outputs into --output_dir, records argv.
OUT=""
VIDEO=""
PREV=""
ARGS_LOG=""
for a in "$@"; do
  ARGS_LOG="$ARGS_LOG $a"
  case "$PREV" in
    --output_dir) OUT="$a" ;;
  esac
  case "$a" in
    --*) PREV="$a" ;;
    *) if [ -z "$VIDEO" ]; then VIDEO="$a"; fi; PREV="" ;;
  esac
done
printf '%s\n' "$ARGS_LOG" >> "$OUT/.mockwhisper-argv.log"
BASE="$(basename "${VIDEO%.*}")"
echo '{"language": "en", "segments": [], "text": "mock"}' > "$OUT/$BASE.json"
printf "1\n00:00:00,000 --> 00:00:02,000\nmock line\n\n" > "$OUT/$BASE.srt"
printf "mock text\n" > "$OUT/$BASE.txt"
'''

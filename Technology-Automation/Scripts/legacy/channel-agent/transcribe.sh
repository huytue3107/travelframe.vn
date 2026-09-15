#!/usr/bin/env bash
# transcribe.sh <video-file> [model] [--output-dir DIR]
#
# Local whisper transcription. Output: txt/srt/vtt/tsv/json + provenance.json.
# - No --output-dir: writes to reference-library/transcripts/<name>-<run-stamp>/
#   (a fresh directory per run — two files with the same basename never collide).
# - With --output-dir: writes exactly there; refuses if it already has transcripts.
# - Provenance sidecar records media fingerprint, source video, engine/model/language.
# - Model default: medium (accuracy); "small" for speed.
# - Whisper is resolved from WHISPER_BIN or PATH — no hardcoded machine paths.
set -euo pipefail

usage() {
  echo "usage: transcribe.sh <video-file> [model] [--output-dir DIR]" >&2
  exit 2
}

VIDEO=""
MODEL="medium"
OUT_OVERRIDE=""
ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --output-dir)
      [ $# -ge 2 ] || usage
      OUT_OVERRIDE="$2"; shift 2 ;;
    --output-dir=*)
      OUT_OVERRIDE="${1#--output-dir=}"; shift ;;
    -h|--help)
      usage ;;
    *)
      ARGS+=("$1"); shift ;;
  esac
done
[ ${#ARGS[@]} -ge 1 ] && [ ${#ARGS[@]} -le 2 ] || usage
VIDEO="${ARGS[0]}"
if [ ${#ARGS[@]} -eq 2 ]; then MODEL="${ARGS[1]}"; fi
[ -n "$VIDEO" ] && [ -f "$VIDEO" ] || { echo "error: video file not found: '$VIDEO'" >&2; exit 1; }

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
RUN_STAMP="$(date +%Y%m%d-%H%M%S)-$$"
BASE_NAME="$(basename "${VIDEO%.*}")"
if [ -n "$OUT_OVERRIDE" ]; then
  OUT="$OUT_OVERRIDE"
else
  OUT="$ROOT/reference-library/transcripts/${BASE_NAME}-${RUN_STAMP}"
fi

# Refuse to clobber existing transcripts at the destination.
if [ -d "$OUT" ]; then
  if compgen -G "$OUT/*.srt" >/dev/null 2>&1 || compgen -G "$OUT/*.txt" >/dev/null 2>&1 || [ -f "$OUT/provenance.json" ]; then
    echo "error: '$OUT' already contains transcripts — refusing to overwrite. Pass a new --output-dir." >&2
    exit 1
  fi
fi
mkdir -p "$OUT"

# Locate whisper: WHISPER_BIN wins, then PATH. No hardcoded machine paths.
WHISPER="${WHISPER_BIN:-}"
if [ -z "$WHISPER" ] || [ ! -e "$WHISPER" ]; then
  WHISPER="$(command -v whisper || true)"
fi
if [ -z "$WHISPER" ]; then
  echo "error: whisper not found on PATH and WHISPER_BIN is not set" >&2
  exit 1
fi

LANGUAGE="${LANGUAGE:-}"   # empty = auto-detect; pin e.g. LANGUAGE=vi for Vietnamese sources
VIDEO_ABS="$(cd "$(dirname "$VIDEO")" && pwd)/$(basename "$VIDEO")"
FINGERPRINT="$(shasum -a 256 "$VIDEO_ABS" | cut -d' ' -f1)"

# whisper CLI has no --language auto → only pass --language when the user pins one.
COMMON=(--model "$MODEL" --output_format all --output_dir "$OUT" --fp16 False --verbose False)
if [ -n "$LANGUAGE" ] && [ "$LANGUAGE" != "auto" ]; then
  "$WHISPER" "$VIDEO" "${COMMON[@]}" --language "$LANGUAGE"
else
  "$WHISPER" "$VIDEO" "${COMMON[@]}"
fi

# Language actually detected (whisper writes it into the .json output).
DETECTED_LANG="$(python3 -c "
import json,sys
try:
    print(json.load(open(sys.argv[1])).get('language') or '')
except Exception:
    print('')
" "$OUT/${BASE_NAME}.json" 2>/dev/null || true)"
if [ -n "$DETECTED_LANG" ]; then
  LANG_DESC="$DETECTED_LANG (auto-detected)"
elif [ -n "$LANGUAGE" ] && [ "$LANGUAGE" != "auto" ]; then
  LANG_DESC="$LANGUAGE (pinned)"
else
  LANG_DESC="unknown"
fi

# Provenance sidecar — the contract video-analyst relies on (source-contract.md).
python3 - "$OUT/provenance.json" "$VIDEO_ABS" "$FINGERPRINT" "$MODEL" "$LANG_DESC" <<'PYEOF'
import datetime
import json
import sys

out, video, fingerprint, model, language = sys.argv[1:6]
doc = {
    "schema_version": 1,
    "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "video": {
        "path": video,
        "fingerprint_sha256": fingerprint,
    },
    "transcript": {
        "source": "local_whisper",
        "engine": "openai-whisper",
        "model": model,
        "language": language,
        "output_formats": ["txt", "srt", "vtt", "tsv", "json"],
    },
}
with open(out, "w", encoding="utf-8") as fh:
    json.dump(doc, fh, indent=2, ensure_ascii=False)
PYEOF

for f in "$OUT"/*; do [ -e "$f" ] && echo "$f"; done

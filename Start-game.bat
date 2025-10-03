@echo off
REM Change directory to the game folder
cd /d %~dp0

echo Starting local server on http://localhost:8000
echo Press Ctrl+C to stop the server.

REM Start Python HTTP server
start "" http://localhost:8000
python -m http.server 8000

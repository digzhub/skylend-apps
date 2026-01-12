#!/data/data/com.termux/files/usr/bin/sh
# Start Skylend PWA server in background for Termux
termux-wake-lock
cd "$HOME/skylend" || exit 1
# Use http-server (npm) if available, otherwise try python -m http.server
if command -v http-server >/dev/null 2>&1; then
  nohup http-server -p 8080 > /sdcard/skylend_server.log 2>&1 &
else
  nohup python3 -m http.server 8080 > /sdcard/skylend_server.log 2>&1 &
fi
echo "SkyLend server started (logs: /sdcard/skylend_server.log)"

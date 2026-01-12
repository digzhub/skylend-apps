
SkyLend PWA — Termux-Ready Package
=================================

What I prepared:
- service-worker.js (robust precache using precache-manifest.json)
- precache-manifest.json (list of static assets to cache)
- manifest.json (PWA metadata with icons)
- icons/ (192 & 512 icons)
- start-server.sh (start server in background with nohup)
- termux-boot-instructions.txt (how to auto-start on boot)
- index.html and your web assets

HOW TO USE (Termux on your Android device)
1) Move this folder to your Termux home and name it 'skylend':
   - If you extracted elsewhere, move directory to: $HOME/skylend

2) Install required tools in Termux:
   pkg update && pkg install nodejs python3 -y
   npm install -g http-server

3) Start the server (foreground for testing):
   cd ~/skylend
   http-server -p 8080
   # or use: python3 -m http.server 8080

   For background (so it keeps running after you close Termux):
   nohup http-server -p 8080 > /sdcard/skylend_server.log 2>&1 &

   Or use the provided start-server.sh:
   chmod +x start-server.sh
   ./start-server.sh

4) Open Chrome and visit: http://127.0.0.1:8080
   - Wait ~5-10 seconds for service worker to install and precache assets.
   - Tap the Install App button or Chrome menu -> Add to Home screen.

5) Important: Use the SAME URL when installing and later when running server.
   Recommended: always use http://127.0.0.1:8080

6) To auto-start on boot:
   - Install Termux:Boot from F-Droid
   - Create ~/.termux/boot/start-skylend.sh with the contents from termux-boot-instructions.txt
   - chmod +x ~/.termux/boot/start-skylend.sh
   - Reboot device

TROUBLESHOOTING
- If installation fails, clear site data for 127.0.0.1 in Chrome (Settings -> Site settings -> All sites).
- If app shows blank offline, ensure precache-manifest.json is present and server origin matches installed origin.
- Check logs: /sdcard/skylend_server.log


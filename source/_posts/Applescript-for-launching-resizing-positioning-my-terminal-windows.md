---
date: '2011-07-11'
title: Applescript for launching resizing positioning terminal windows
tags:
- applescript
---

On my primary computer, I have 3 monitors. I always have one monitor dedicated to terminal windows. I then realized I can just use an applescript to fill the monitor up with 5 packed in terminals of different dimensions automatically.

```applescript
(* (x,y) positions from top left of main monitor: *)
(* topleft-corner of window, bottom-right corner *)
(* Search for CursorCoordinates in the Mac App Store *)
	
tell application "iTerm"
	activate
	try
		repeat 5 times
			tell i term application "System Events" to key code 13 using command down
		end repeat
	end try
	
	repeat 5 times
		tell i term application "System Events" to key code 45 using command down
	end repeat
	
	set the bounds of window 1 to {-1920, 0, -965, 540}
	set the bounds of window 2 to {-967, 0, 0, 540}
	set the bounds of window 3 to {-1921, 540, -1280, 1080}
	set the bounds of window 4 to {-1280, 540, 0, 831}
	set the bounds of window 5 to {-1280, 830, 0, 1080}
end tell
```

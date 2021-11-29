---
title: >-
  Comma 3 development workflow for transparent display by means of scene
  reprojection
date: 2021-11-25 12:24:59
tags:
  - comma
---

On the weekend of November 12-14 2021 I attended <a href="https://blog.comma.ai/comma_hack/">comma hack</a> which was a "hackathon" ("build something in a very short period of time by means of overexertion"-marathon).

The project I wished to PoC was to see how we could use the driver monitoring model (which is used to detect the distraction level of the driver) to guide a reprojection of one of the back-facing cameras so as to achieve the illusion of transparency.

<video controls poster="{% asset_path seethru-poster.png %}">
  <source src="{% asset_path seethru-112521.mp4 %}" type="video/mp4">
  Sorry, your browser doesn't support embedded videos.
</video>

There is a nice paper with three prototypes here: https://dan.andersen.name/publication/2016-09-19-ismar

These implementations rely on depth information, but on the comma 3 platform we do not necessarily have depth data out of the box. I say it this way because there are numerous techniques to acquire depth, see <a href="https://github.com/commaai/depth10k">comma/depth10k</a>.

Working directly on the C3 is possible and easy to do. I will document the workflow. These days even the hardcore tmux/vim users like me are tempted into the Remote-SSH extension in VSCode, so first we'll fix that.

The /data/media directory in the C3 is where you have persistent read-write to the large NVMe drive. I create a `developer` folder in there.

When I boot the C3, before I do any work, I run the following script:

```bash
#!/bin/bash
ln -sf /data/media/developer/vscode-server /home/comma/.vscode-server
git config --global user.email "keyvanfatehi@gmail.com"
git config --global user.name "Keyvan Fatehi"
cat  /data/media/developer/transform.json  > /dev/shm/transform.json
```

The transform bit is application-specific to how I was learning about the matrix transformation. Say I want to work on that again, this is its content:

```
{
  "transform": [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]
}
```

This matrix is applied to the shader and was an opportunity to manipulate the surface to which the camera was projected... I learned that these were the meanings of the fields by way of editing the transform while my program was running:

```
the transform:


[
stretchX(in,1,out),warp(top-left,0,top-right),0,translateY(left,0,right)
rotate(left-up,0,left-down),stretchY(in,1,out),0,translateX(down,0,up)
0,0,0,0
tiltX(left-out,0,right-out),tiltY(top-in,0,top-out),?,zoom(in,1,out)
]
```

Anyway, on the C3, when it boots, everything runs in tmux. We want to stop the UI. We also want to stop `updaterd` because it can randomly reset our working tree.

Now is a good time to replace openpilot with a branch containing the code for this particular experiment.

```
cd /data && rm -rf openpilot && git clone --recursive --branch seethru https://github.com/kfatehi/openpilot
```

You can `tmux attach` and Ctrl-C to kill it. Who runs tmux on boot? Systemd does, there is a service called comma that launches tmux with the launch script inside the first shell.

All services will be stopped, and now we can leverage openpilot's interprocess communications ourselves, with purpose. Let's block two services, and manually start the camera and driver monitoring service. Do this in different tmux windows.

`BLOCK="ui,updated" ./launch_openpilot.sh`

`cd /data/openpilot/selfdrive/camerad && ./camerad`

`cd /data/openpilot/selfdrive/modeld && ./dmonitoringmodeld`

Finally, our iterative command to compile and run our binary:

`cd /data/openpilot/selfdrive/ui && scons -u -j4 && ./seethru`

The file to hack on is `openpilot/selfdrive/ui/qt/widgets/seethrucameraview.cc` or <a href="https://github.com/kfatehi/openpilot/blob/seethru/selfdrive/ui/qt/widgets/seethrucameraview.cc">view it on GitHub here</a>

The comments I have written in seethrucameraview.cc describe the odds of pulling this off properly are low, but that is ameliorated, as far as the use case of driving in a car, by the fixed positions of the driver's head and the c3's mounted location. So it's possible and probably worth continuing in order to achieve transparency through the C3's display when driving with it.
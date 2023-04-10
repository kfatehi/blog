---
title: How to install NVIDIA drivers and specific CUDA versions on Ubuntu 22.04 Server (not Docker)
date: 2023-04-09 20:27:52
excerpt: After installing Ubuntu 22.04 server for AI research purposes using Nvidia GPU(s), the first thing you must do is get your GPU working.
tags:
- ai
- gpu
- linux
- ubuntu
- nvidia
- cuda
---

After installing Ubuntu 22.04 server for AI research purposes using Nvidia GPU(s), the first thing you must do is get your GPU working.

As of this writing, you want to view the official Nvidia cuda installation guide: 

https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html


Use that and avoid installing the default ubuntu versions of the drivers. It is very outdated and the cuda it ships is incompatible with the driver it ships. The solution is to use the official nvidia ubuntu repos as described in the link above.

As of this writing, this script captures the essence of what the guide dictates:

```
#!/bin/bash

# Add the NVIDIA graphics drivers repository
wget -qO - https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/3bf863cc.pub | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/cuda.gpg
echo "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64 /" | sudo tee /etc/apt/sources.list.d/cuda.list

# Update the package list to include the new repository
sudo apt update

# Install the latest compatible NVIDIA driver and CUDA Toolkit
sudo apt install cuda-11-7

# now i dont have nvcc 
# run nvidia-smi and confirm cuda version in the top right.
# Check if nvcc is in the folder /usr/local/cuda-11.7/bin Run ./nvcc --version if it exists in that folder
# If this is the case, add the folder to your global path variable echo "export PATH=/usr/local/cuda-11.7/bin${PATH:+:${PATH}}" >> ~/.profile
```

After rebooting, check `nvidia-smi` and `nvcc` commands are available.
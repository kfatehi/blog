---
title: Mikrotik RouterOS on Unraid
date: 2021-03-01 12:55:43
tags:
- mikrotik
- firewall
- unraid
---

How to get Mikrotik RouterOS on Unraid

Follow the steps from your Unraid terminal. Have the webgui handy as well.

1. download the image

```
wget https://download.mikrotik.com/routeros/6.48.1/chr-6.48.1.vmdk
```

2. convert it to qcow2 image to be stored in your domain cache:

```
mkdir /mnt/cache/domains/routeros
qemu-img convert -f vmdk -O qcow2 chr-6.48.1.vmdk /mnt/cache/domains/routeros/chr-6.48.1.qcow2
```

3. create the VM

Go to VMS, click Add, choose Linux
Switch to Form View if you are in XML view.
Set Name to RouterOS
Set BIOS as SeaBIOS (Very important!!!)
Set Disk to Manual with Format qcow2 and Path to the qcow2 file and bus SATA
Set Network to the Bridge you want to use and/or pass in any PCI devices

Uncheck "Start VM after creation" and click Create. If you forgot to uncheck it just Stop the VM

4. edit the VM (click the logo of your VM for edit dropdown button to appear)

5. switch to XML view and locate the network card. looks something like this:

```
    <interface type='bridge'>
      <mac address='52:54:00:1c:b9:4a'/>
      <source bridge='br1'/>
      <model type='virtio'/>
      <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
    </interface>
```

Change the model type from virtio to vmxnet3

This is required in order for routeros to see the interface and be able to interact with it

Click Update after you're done editing.

6. Start the VM and connect with the built-in VNC viewer.

7. Login as admin (no password) and configure your new router.

you can check what IP address it was given with the following mikrotik command: 

```
ip address print
```

You can also connect using winbox available here https://mikrotik.com/download and discover it on the Neighbors tab

bonus step: add the winbox icon so you can set it in the VM manager!

````
curl -o /usr/local/emhttp/plugins/dynamix.vm.manager/templates/images/winbox.png dfh.name/images/winbox-mikrotik-icon.png
```

You may also find it's a good time to apply some basic firewall rules... depending on what you're planning on doing. 

The example below makes sense for my purposes and may be helpful to examine:

```
/ip firewall filter
add action=accept chain=input comment="Accept new input on tcp/8291 from computer running winbox" connection-state=new dst-port=8291 protocol=tcp src-address=10.27.0.198
add action=accept chain=input comment="Accept new input from gateway" connection-state=new src-address=10.14.52.1
add action=accept chain=input comment="Accept established or related input" connection-state=established,related
add action=drop chain=input comment="Drop all input on ether1" in-interface=ether1 log=yes
```
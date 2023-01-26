---
title: Building a spoofed custom Dell Power Supply for the Comma Body external PC
date: 2023-01-25 19:04:24
tags:
- electronics
- arduino
- 3d printing
- comma body
---

In this blog post, we will be discussing how to spoof a Dell power supply using an Adafruit Trinket. Dell laptops use a 1-Wire-based supply identification protocol, which can be easily spoofed using the Trinket. The Trinket can drop the 12v input to 5v to power itself and also turn on the power to the miniPC once the spoof is ready.

{% asset_img installed.png dell power supply backpack %}

Materials used:

- [Adafruit Pro Trinket](https://www.adafruit.com/product/2010)
- Dell Power Supply
- USB-C Connector
- [12v to 5v Micro USB Buck Converter](https://www.amazon.com/gp/product/B01MEESLZ6/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)
- [Adjustable Buck Regulator](https://www.amazon.com/dp/B079N9BFZC?psc=1&ref=ppx_yo2ov_dt_b_product_details)
- [3v Relay Driver](https://www.amazon.com/gp/product/B07XGZSYJV/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)
- Power connector and cable
- [Wire tapping kit](https://www.amazon.com/gp/product/B077YB123S/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1) for safely tapping into the 24 V wires
- 3d printer
- soldering iron

Step 1: Dropping the 12v "Arm" port to 5v

The first step in the process is to drop the 12v input to 5v to power the Adafruit Trinket. 

Step 2: Spoofing the Dell Power Supply

The Trinket is then used to spoof the Dell power supply's 1-Wire-based identification protocol. The Trinket is programmed to emulate a DS2502 - 1kbit EEPROM, which is used by Dell laptops to identify the power supply.

{% asset_img ftdi.png programming %}

Step 3: Turning on the Power to the miniPC

Once the spoof is ready, the Trinket turns on the power to the miniPC. This is done by connecting the Trinket to the main power button of the miniPC. The power is then supplied to the miniPC, and it can be used as normal.

{% asset_img wired.png wired %}

Step 4: Printed Assembly

Assembling everything onto the 3d print

Source Code:

Code Repo: https://github.com/comma-hacks/dell-power-supply
Model Repo: https://github.com/comma-hacks/accessories/tree/master/meshes/backpack/dell-power-supply
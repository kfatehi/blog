---
title: "DIY WiFi Garage door opener and status checker"
date: 2015-12-17 17:11:13
tags:
  - elixir
  - nerves
  - raspberry pi
---

{% youtube 4XBNwHmx-4Q %}


_I borrowed my brother's iPhone in order to capture the video._

# Summary

My dad and I made a wifi garage door opener and status checker.

We did this project crazy-fast and without any hang-ups, which was interesting to me because it showed how far along the tools have come.

## Hardware

* Original Raspberry Pi
* 1x Opto-isolator
* 1x Reed switch

## Embedded Software:

* OS: Nerves (Linux boot to Erlang)
* App: Custom Elixir app [source](https://github.com/kfatehi/codelock)

## Mobile Software:

* App: Custom Ionic app [source](https://github.com/kfatehi/AfternoonCommander)

## Problem

Our garage door opener has a physical panel just outside where one can enter a 4 digit pin and open the garage.

After some fairly recent rain storms, the panel has been malfunctioning and fails to work 95% of the time. It's not a battery issue.

It was expensive to replace that from the manufacturer, and we didn't want the same faulty product!

We want to know if the garage door is open or closed and be able to open or close it remotely.

## Solution

This would take two GPIO pins.

1. read logic level 1 or 0 based on the garage door being open or closed. a [reed switch](https://en.wikipedia.org/wiki/Reed_switch) affixed to the door's frame, adjecent to a strong magnet on the door, will do the trick.

2. write logic level 1 to a circuit that simulates a button press on the garage door manual switch, located inside the garage. We used an [opto-isolator](https://en.wikipedia.org/wiki/Opto-isolator) for this.

## Build-out

### Embedded

I used [Nerves](http://nerves-project.org) on an old Raspberry Pi.

**Nerves makes it possible to create minimal ARM firmware that boots directly into the Erlang virtual machine (BEAM).**

Essentially it helps you compile a barebones linux kernel with the init system replaced.

I chose Nerves because I like [Elixir](http://elixir-lang.org) and the emphasis placed on making fault-tolerant systems right from the start. I think it's quite apt for the embedded space.

After making Nerves development [easier on Mac](https://github.com/nerves-project/homebrew-nerves), I started the project.

Controlling GPIO pins was easy to do thanks to [Elixir ALE](https://github.com/fhunleth/elixir_ale).

The core concept is to listen on HTTP and allow read/write on any GPIO pin:

```elixir

defmodule Codelock.Router do
  use Plug.Router

  plug Plug.Logger
  plug Corsica, origins: "*"
  plug :match
  plug Plug.Parsers, parsers: [:urlencoded, :json], json_decoder: Poison
  plug :dispatch

  def start_link do
    {:ok, _} = Plug.Adapters.Cowboy.http Codelock.Router, []
  end

  post "/digital_write/:gpio_out/:value" do
    gpio_out |> String.to_integer |> digital_write(String.to_integer(value))
    send_resp(conn, 200, "{}")
  end

  post "/digital_read/:gpio_in" do
    value = gpio_in |> String.to_integer |> digital_read
    send_resp(conn, 200, Poison.encode!(%{ value: value }))
  end

  match _ do
    send_resp(conn, 404, "Not found")
  end

  defp digital_write(pin, value) do
    {:ok, pid} = Gpio.start_link(pin, :output)
    Gpio.write(pid, value)
    IO.puts "Wrote #{value} to pin #{pin}"
    Process.exit(pid, :normal)
    value
  end

  defp digital_read(pin) do
    {:ok, pid} = Gpio.start_link(pin, :input)
    value = Gpio.read(pid)
    IO.puts "Read #{value} from pin #{pin}"
    Process.exit(pid, :normal)
    value
  end
end
```


### Circuit

Credit goes 100% to my dad for all the circuit design and prep downstream of the GPIO pins. If you'd like to replicate this look at the reference schematics for an appropriate voltage reed switch and opto-isolator.

> A Normally Open (NO) Reed Switch and a magnet are used as the Garage Door status sensor. The Reed switch is installed on the frame, and the magnet on moving door. When the door is in the closed position, the switch short the PI's input to ground indicating logic "0," otherwise that input is in logic "1." We chose a passive Reed magnetic sensor over hall effect transistor because the latter would have required access to a supply voltage and therefore we would have to run 3 wires from PI to the sensor.

All I had to do was put the board together with the Raspberry Pi:

{% asset_img 1.png naked boards %}
{% asset_img 2.png pi closeup %}

### Mobile App

Prior experience indicated that [Ionic](http://ionicframework.com/) would make the mobile app development portion trivial.

The core concept for the mobile UI here was to list one or more "things" that have state and can be toggled:

```html
<ion-view view-title="Dashboard">
  <ion-content class="padding">
    <div class="list card" ng-repeat="thing in things">
      <div class="item item-divider" ng-init="thing.init()">{{ thing.label }}</div>
      <div class="item item-body">
        <div>
          State: {{ thing.state }}
        </div>
        <button class="button button-full button-positive" ng-click="thing.toggle()">
          Toggle
        </button>
      </div>
    </div>
  </ion-content>
</ion-view>
```

The core concept for the controller was to provide the list of "things" that know how to fetch state and be toggled:

```js
$scope.things = [{
  label: "Garage Door",
  state: "unknown",
  init: function() {
    var self = this;
    var fetchState = function() {
      $http.post('http://garage:4000/digital_read/4', {}, httpConfig)
      .success(function(res) {
        if (res.value === 1) self.state = "Open";
        else if (res.value === 0) self.state = "Closed";
      })
    fetchState();
    setInterval(fetchState, 5000);
  },
  toggle: function() {
    $http.post('http://garage:4000/digital_write/18/1', {}, httpConfig).success(function() {
      setTimeout(function() {
        $http.post('http://garage:4000/digital_write/18/0', {}, httpConfig)
      }, 800)
    })
  }
}];
```

This code could definitely use improvement (and reveals other problems), but this resulted in a decent app:

{% asset_img 5.png ionic app %}

## Installation

After soldering the wires from our opto-isolator into the manual switch, we've got this:

{% asset_img 3.png manual switch %}

The last step was hooking up the reed switch to the door. You can see the reed switch in the left of the pic below:

{% asset_img 4.png reed switch %}

You can see the whole thing in action in the video at the top of this post.

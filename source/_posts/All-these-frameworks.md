---
title: All these frameworks
date: 2016-07-14 08:58:26
tags:
---

> So im working on something in node.js with justin (for fun and to
> learn). it's pretty neat i like it a lot for doing web stuff. im using
> express.js for the backend.

I also prefer express and can't seem to shake it as my go-to web "framework" -- for me it is currently the quickest way to get a little web service going...
 
> Ive been reading about different front ends, but I'm pretty confused.
> Angular and React, do they do pretty much the same thing? The marketing
> material makes them sound like very odd frameworks, but what the hell
> does this mean? Can you use these without a backend like express (I
> imagine you can if you dont want database access)? Or is it all UI stuff
> in the front?
>
> I know some of these do sever side rendering (which seems pretty cool)
> but does this sort of just replace the templating engine on the express
> side (I'm using swig which is just like jinja that django uses)?

Well it is indeed confusing.

So you probably know django is referred to as an "MVC" framework. Rails is also referred to as MVC.

Model view controller... Okay. 
In Django/Rails the View is the part that renders a template (usually an HTML) using some templating language. The model brings your data forth for use in the View. The Controller serves this up in reaction/response to a web request.

The first thing to realize when speaking of web front-end frameworks (Which is what angular and react are, with react being slightly less and slightly more all at once [ill explain]) is this: in the above model of MVC, they are strictly working in the browser. This means they are 100% compatible with django/rails, whatever you're using, because you are just including angular.js or react.js as a static javascript library and then following some convention thereafter to actually use the library to control your UI.

Sometimes people refer to Angular as "MVVM" or "MV*" because as people transitioned from traditional web frameworks like rails/django (request -> server-side template -> response) to SPA's (Single Page App) they tried to fit this circle into the square peg of the way they were thinking before. It doesn't really work, and is a shitty and confusing thing, but I only tell you in order to say this: when react came out it said "it is the V" in "MVC" or "MVVM"

This is still misleading though because react is not typically used like a server-side templating library, although it can sorta be (server-side rendering) but this is a pretty advanced usage and I actually still haven't bothered trying it. It's not the same as the server-side rendering of a template that we are used to in MVC/traditional frameworks, or maybe it is, who cares, you can read up on it and just know that with react you get it for free and it exists if/when you need to compute the UI state/DOM without the need for an actual DOM.

> Just trying to figure out how the pieces of these thigns work together.
> I mean I can pretty much use express just like I did django so this
> makes 100% theoretical sense. How do these other things fit in?

Angular and React are just javascript libraries.

Angular involves writing html files in a way that binds it to data in a "controller" ( a javascript object that is like an instance of some UI component). 

in angular you extend html itself by writing what are called directives. it's pretty neat but i dont recommend it anymore now that react exists. (note I have not looked at angular 2 yet)

in react, you never write any html. this is useful because you are no longer coupling to the DOM or browser. in fact, the react package on npm knows nothing about HTML or the DOM... to "mount" a react component onto the DOM, you need the react-dom package.

this is what gives way to technology such as React Native, which is becoming highly competitive with ionic (angular-based) in the hybrid-mobile app dev framework arena.

react is a better investment, imo, but it gives you less out of the box...

i recommend this tutorial http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html -- you will see the functional programming style of react.

that's the other way to think of them... in angular you are mutating all over the place and maintaining state in these controller instances (each one has a $scope object that has data dangling off it, to which the elements are "bound"). in react you have a very primitive way to manage state, but people tend not to use it, instead it is recommended (by the "flux pattern" of which "redux" is a popular implementation) to store state in a special object central to your app (or component)... known as the store.

the store serves to decouple app state from the view itself -- only rendering via parameter passing, like a pure function (the react copmonent, then is a pure function).

mutation of the state occurs by means of actions that are dispatched to the store. the store has a "reducer" you wrote, which knows how to compute the next state based on the incoming action. that new state is then what gives way to the next "frame", or rendering of the view for the new app state.

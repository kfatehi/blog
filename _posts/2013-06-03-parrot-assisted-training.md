
# PARATRAIN

Paratrain is a new app I'm developing for audio, language, and animal research. It stands for something along the lines of parrot-assist training, 

## Artificial Intelligence

### CARROT

In Chicago last week I purchased CARROT on the Apple App Store while in line for Shedd Aquarium. Animals, ooh, I forgot all about them while developing software all the time. My legs fucking hurt too until the final Day there wherein my muscles finally remembered they can regenerate.

Food and drugs doesn't fix long-term atrophy, exercise is necessary.
Some people get dogs, like my older brother, which makes him more be more active.

One could assert by this that this is a **use case** for having a kid *oof* i mean pet.

It is a selfish reason, but a reason no less.

### PARATRAIN

This is [my accidental AI project](https://github.com/keyvanfatehi/paratrain)... (the rapidly iterative README as of today)


#### Paratrain README

Paratrain
---

0. Purchase Paratrain from the Apple App Store
1. Make sure you're connected to wifi and have a lot of battery
0. Open the app and create a profile for the learner
0. Setup some options in the the profile and enable the algorithm
0. Ensure the iphone and the learner are within earshot of each other.
1. Optionally set up a 2nd screen to provide visual data for the learner (See the API by version 1)
2. Optionally place wireless nodes around for the learner to activate. Custom-configuration possible. (See the API by version 2)
2. Optionally enable camera and the "Paratrainer" for strategies of increased awareness between learner and AI (See the API by version 3)
    * The paratrainer avatar can be invoked remotely by you (See facially emotive API by version 4)

I don't expect anything like Version 4 for at least another 3 years.

I intend to complete Version 1 by the end of June. The rest is futurestory, or as I like to call them, user stories...

## Paratrain AI Subsystems

# System 1 Listening Mode

System 1 can be toggled on or off. It's Paratrain's "Listening Mode". This is how it affects Paratrain's behavior:

    It collect words the that it "hears".
    When it hears a new word, it will verify that it's a word by converting the audio to text.
      consider the confidence of the conversion
      unconfident? then forget it
      confident? then do this:
        consider whether we've heard this word before
        we have?
          take note that we just heard this word again.
          store this unique utterance (Word has_many Utterances)
        we haven't?
          fetch media for the word (definitions, thesaurus, audio, images, video)
          store all this in the database
        Check if System 2 is enabled, if so, notify it that we've just now heard this word [id] for the [count] time
      not sure?
        store it in the app, let the user choose to:
          * listen to the sample
          * convert it to text manually and save with that audio
          * adjust the confidence threshold

System 1 will start to be implemented once [#6](https://github.com/keyvanfatehi/paratrain/issues/6) is complete.

## System 2 Learning Mode
Responsible for matters related to the exposure of the iphone's existence to the learner.

### Engagement
Engagement controls if and how the iphone speaks to nearby listeners
There are several aspects of engagement exposed by System 2
 * persistence 0-100
 * aggression 0-100
 * boredom 0-100
 * rewards
 * content


## Second Screen

If a second screen is available (Apple TV), the **Visual Association Toggle** becomes available. It works like this:

#### VAT:System 1

    As someone learning a language
    When my artificial intelligence hears a word
    In order that I be more likely to learn the word
    I prefer an associative visual element appear onscreen
    
#### VAT:System 2 
   
    As someone learning a language
    When I am engaged by my artificial intelligence
    In order that I be more likely to learn the word
    I prefer an associative visual element appear onscreen


---

# Goal

Design a system good enough to teach an African Grey parrot at least 500 words before the age of 6, without inflicting emotional damage.

If successful, it can be used for small children, and eventually turn into an effective "knowledge download" tool. Might as well dream big; but it's mainly to distract me from immediately buying a Grey before I'm really ready.

## No impulse-buy

Only a few days ago, my brother suggested I get a parrot. I didn't speak or think of parrots for maybe 7 years; It was something I could just never have, and so put away mentally ... too expensive ... with luck, becoming a competent developer has allowed me to break that financial barrier.

> Resisting the impulse buy the African Grey is hard, but it's a huge responsibility -- I am older and the facts of the matters make resistance easy
>
> I always wanted a parrot as a kid, but needed to wait until I knew I could take care of it correctly (and afford one). I've had pets that died, and as a small kid, it can be traumatic. Failing to train a Grey well would be almost criminal.
>
> I'm 24 and I feel like this parrot thing is now is making me face it, and the other big questions, all at once.

This was a small thing for him, I think, but for me it begins to feel as though it has stirred up a great spirit that been asleep inside me. All this time I've been secluding myself, perhaps buried under a lot of old guilt from the pets that I've had that have died --- not getting any more pets so as not to "kill it again". Perhaps this is one of those latent and hard-to-understand better-to-avoid reasons I am so keen to remain single... err...

Uhm, in any case: I have a long history with avians and would rather get the bird when I have a house, to build a proper aviary again.

But I can start [developing software](https://github.com/keyvanfatehi/paratrain) and [doing research](https://github.com/keyvanfatehi/paratrain/issues/5). It has proven fruitful so far.

I feel that **buying the parrot right now would be a big mistake**

The matured scientist in me is eagerly awaiting pending discoveries into learning and intelligence ... and wants to ensure readiness ... once this turns into design, and then *implementation*, I am ready.

# Caged Bird

I will be waiting until the software *AND* hardware is ready. I need an indoor cage. I'm opting not to build it with wood as I did for the doves I owned as a small child (these pets created life... they are not a memory of death like some later animals I had; but one of but birth and life; contentment and prosperity)

Consequently, software and hardware for a parrot equates to massive amounts of learning by the undertaker [me].

## 3d Printer + Solidworks + Technique ... = Habitat ?

My [Pirate3d 3d Printer, the Buccaneer](http://pirate3d.com/), arrives in Dec 2013.

Now I have a real reason to properly learn **SOLIDWORKS** again.

I need a chop-up-big-stuff algorithm for this. I am looking into [aluminum] extrusion/profile interlock systems for this.

## Space, I see you baby

All I need to do now is ensure I learn electronics too and perhaps my Space 2022 ambitions will indeed become true on time.

If something like paratrain can be pulled off as quickly as it looks, then building the micro-agriculture systems I've envisioned should be less sweat too.
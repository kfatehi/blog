---
date: '2011-08-03'
title: Asynchronous c programs an event loop and ncurses
tags: 
- ncurses
- c
---
<p>You may wonder how you can use ncurses in an asynchronous fashion in your program. Doesn&#8217;t ncurses block on getch(), thus forcing your program out of any of your asnychronous hopes and dreams?</p>
<p>Well, no, you don&#8217;t HAVE to use getch() to get characters, and as long as you do not call any of these blocking functions, and find another way to get input in an asynchronous fashion, you can very well use the keyboard event of a character to drive your ncurses gui.</p>
<p>You can also have events happening on other file descriptors at the same time. This is the nature of asynchronous programming&#8212;things are happening at the same time, all functions are returning as soon as possible, and nothing is waiting for anything else.</p>
<p>Your program spends most of its time in the &#8220;event loop&#8221; where it waits for &#8220;something to happen&#8221; (e.g. data just came in on the standard input, or data just came in on a TCP socket), after which it will fire off the &#8220;callback&#8221; in which you&#8217;ve described what work should be done in the event of such an occurrence.</p>
<p>The following is what the code for this looks like if you were to use poll(). Keep in mind there are other functions, such as select(), that do the same thing, but are used in a slightly different way.</p>

```c
#include <sys/poll.h>;   // poll() is of course made available by this header file
#include <unistd.h>;     // STDIN_FILENO is defined in here, and close() for sockets
#include <ncurses.h>;

int main() {
  struct pollfd ufds[2]; // Data structure we later pass to poll() for monitoring
  int sockfd;            // File descriptor for the TCP socket
  int STDIN_FILENO       // this is just 0

  initscr();             // Start ncurses

  connect(sockfd, ..., ...);   // Connecting a unix socket has a few more steps
                               // see links at the end for more info
  pUfds[0].fd = sockfd;        // Pack our connected TCP socket file descriptor in.
  pUfds[0].events = POLLIN;    // we only care if the socket is ready for read (Has data)
  pUfds[1].fd = STDIN_FILENO;  // Pack our standard input file descriptor in.
  pUfds[1].events = POLLIN;    // Again, we only care when there's data for reading.

  do {
    switch(poll(ufds, 2, -1)) {
      case -1:{ refresh(); break;} // resizing the terminal causes poll() to return -1 (error)
      default:{                    // So I simply refresh() the ncurses view when that happens
        if (ufds[0].revents &amp; POLLIN)  
          onSocketData();              // my callback for socket activity 
        if (ufds[1].revents &amp; POLLIN)
          onKeyData();                 // my callback for keyboard activity
      }
    }
  } while(Running); // this variable serves as a killswitch

  endwin(); // End ncurses
  close(sockfd);
  return 0;
}
```

<p>The above is chopped and sliced out of a program I've been working on:</p>
<p><a title="Network Vim" target="_blank" href="http://github.com/kfatehi/nim%20%20"><a href="http://github.com/kfatehi/nim">http://github.com/kfatehi/nim</a></a></p>
<p>If you are interested in Unix socket and network programming, I highly recommend this resource:</p>
<p><a target="_blank" href="http://beej.us/guide/bgnet/"><a href="http://beej.us/guide/bgnet/">http://beej.us/guide/bgnet/</a></a></p>

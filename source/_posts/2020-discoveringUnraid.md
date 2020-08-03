---
title: Discovering Unraid
date: 2020-08-02 20:52:14
tags: [unraid,nas]
---

Another blog post while I wait for Array to be created.

## How does Unraid being non-free square against the circle of retaining data sovereignty?

You should retain access to your own stuff without having to ask permission by some third party who may or may not even be reachable let alone necessarily agreeable in the future.

How does this work? How can I be OK with this?

My guess is that at the end of the day Unraid can be thought of as **merely a very advanced** WebGUI management layer between you and the [free XFS file system](https://www.kernel.org/doc/html/latest/admin-guide/xfs.html), on top of the free Linux kernel.

Therefore by purchasing Unraid I am not giving up too much freedom, rather I am only deferring learning and building what would be an ideal WebGUI (Unraid) for managing the underlying complexity. I am paying for the hard work by the Unraid developers and to support the community.

This system helps users to enjoy a more convenient usage of the underlying system which is too complex for mere mortal like me. There is no ethical issue here about data sovereignty because XFS is free. If Unraid team stops supporting Unraid, I can access the regular linux shell and recover my data.

By supporting Unraid, the negative outcome I'm already prepared for becomes less likely.

**This is OK, but what happens in the future as I grow reliant on that UI in a disaster scenario where I can't receive an update -- does it stay alive?**

A couple of relevant communication in the [Unraid Wiki FAQ](https://wiki.unraid.net/index.php/FAQ#What_is_unRAID.3F) sort of answer.

> How hard is unRAID to use if I don't know Linux?
> Not hard at all. Although the unRAID server software is based on a slimmed-down Linux, it is managed almost entirely from your web browser, typically on a Windows or Mac computer. Some users are happy with that, but many want to take advantage of the many tweaks and addons for unRAID, and these usually require a little hands-on work. But they are completely optional, and are generally accompanied with lots of help and instructions, and there is a very helpful user community. Many users find this makes for a good introduction to Linux, at their own pace. See also this thread, especially this post, for more comments.

> Does unRAID need Internet access?
> The unRAID server software generally does not require Internet access. Of course, you will need Internet access from another desktop to download the software and software updates, and to read the unRAID forums and this Wiki!
> However, there are many benefits to providing Internet access to your unRAID server. The unRAID software and your plugins and Docker containers can all be updated from within the software. Usability and manageability are improved with email and other notifications. unRAID supports NTP, the Internet time service, so if you enable the NTP service, your server will keep accurate time. In addition, expert unRAID users have created many addons for unRAID, such as plugins, Dockers, and VM's, that can provide numerous application services such as torrent support, etc. All of these benefits are completely optional. See also this.

## Can Unraid replicate?

I [didn't see any](https://www.reddit.com/r/unRAID/comments/b1m59a/best_practices_to_connect_two_unraid_servers/) official support for the concept of pairing two servers together, no. Not yet.

## Unraid really helps with learning about Disk Health

Having a UI for easily inspecting disk health, performing tests, and downloading SMART reports and a [community from which to learn about these topics](https://forums.unraid.net/topic/44442-warning-reported-uncorrect-what-is-reported-uncorrect-unraid-notification/
) is wonderful.

## Paranoid about Flash Drive going bad?

Better take a backup of it soon as described in the wiki https://wiki.unraid.net/UnRAID_6/Changing_The_Flash_Device

More reading here on that subject: https://unraid.net/blog/unraid-new-users-blog-series

## Paranoid about disks themselves?

Read about that here https://www.reddit.com/r/unRAID/comments/dg9x7r/unraid_drive_reliability_calculator/

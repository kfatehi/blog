---
date: '2011-06-08'
title: get current date time in iOS
tags:
- ios
---

This was copied directly from a <a href="http://www.dotnetishere.com/post/Objective-C-iOS-get-current-date-time-with-formatted.aspx">blog post of Murat Yilmaz</a> </p>

```obj-c
NSCalendar *calendar = [[NSCalendar alloc] initWithCalendarIdentifier: NSGregorianCalendar];
NSCalendarUnit unitFlags = NSYearCalendarUnit | NSMonthCalendarUnit | NSWeekCalendarUnit | NSDayCalendarUnit | NSHourCalendarUnit | NSMinuteCalendarUnit | NSSecondCalendarUnit;
NSDate *date = [NSDate date];
NSDateComponents *dateComponents = [calendar components:unitFlags fromDate:date];
NSInteger year = [dateComponents year];
NSInteger month = [dateComponents month];
NSInteger week = [dateComponents week];
NSInteger day = [dateComponents day];
NSInteger hour = [dateComponents hour];
NSInteger minute = [dateComponents minute];
NSInteger second = [dateComponents second];
```

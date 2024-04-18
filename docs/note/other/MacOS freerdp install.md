
1. install freerdp custom version:  https://pub.freerdp.com/releases/
2. make

```shell
cd FreeRDP

sudo cmake -DTARGET_ARCH=ARM -DWITH_X11=ON

sudo make

sudo make install
```

https://forums.raspberrypi.com/viewtopic.php?t=292360
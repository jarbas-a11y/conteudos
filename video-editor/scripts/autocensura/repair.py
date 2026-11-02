import cv2, numpy as np, sys
B={1:(67,166,409,209),2:(40,166,407,209),3:(60,187,416,227),5:(49,189,412,229),6:(38,189,405,230),7:(62,179,416,220),8:(40,179,407,220),9:(61,170,413,212),10:(41,170,406,212)}
mkdir='rep'
for i in map(int,sys.argv[1:]):
    x0,yt,x1,yb=B[i]; im=cv2.imread(f'up/p{i}.png').astype(float); H,W=im.shape[:2]
    S=4; pad=11
    for y in (yt,yb):
        a,b=y*S-pad, y*S+S+pad
        a=max(0,a); b=min(H-1,b)
        xa,xb=max(0,x0*S-14), min(W,x1*S+18)
        top=im[a-1,xa:xb]; bot=im[b+1,xa:xb]
        for yy in range(a,b+1):
            t=(yy-a+1)/(b-a+2); im[yy,xa:xb]=top*(1-t)+bot*t
    for x in (x0,x1):
        a,b=x*S-pad, x*S+S+pad
        a=max(1,a); b=min(W-2,b)
        ya,yb2=max(0,yt*S-12), min(H,yb*S+16)
        l=im[ya:yb2,a-1]; r=im[ya:yb2,b+1]
        for xx in range(a,b+1):
            t=(xx-a+1)/(b-a+2); im[ya:yb2,xx]=l*(1-t)+r*t
    # light noise to hide flat bands
    cv2.imwrite(f'up/p{i}.png', np.clip(im,0,255).astype(np.uint8)); print('repaired',i)

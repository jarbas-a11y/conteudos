import json, numpy as np, math, sys
from PIL import Image
from rembg import remove, new_session
F=json.load(open('faces.json')); sel=json.load(open('heads/selection.json'))
s=new_session('u2net_human_seg')
for name,n in sel.items():
    k=f'f{n:04d}.jpg'; x,y,w,h=F[k]['box']; lm=F[k]['lm']
    rex,rey,lex,ley,nx,ny,rmx,rmy,lmx,lmy=lm
    ang=math.atan2(ley-rey,lex-rex); ex,ey=(rex+lex)/2,(rey+ley)/2
    eyemouth=math.hypot((rmx+lmx)/2-ex,(rmy+lmy)/2-ey)
    L,R=int(x-w*0.7),int(x+w*1.7); T,B=int(y-h*1.0),int(y+h*1.3)
    L,T=max(0,L),max(0,T); R,B=min(720,R),min(1280,B)
    crop=Image.open('frames/'+k).convert('RGB').crop((L,T,R,B))
    o=np.asarray(remove(crop,session=s,post_process_mask=True)).copy()
    al=o[:,:,3].astype(float); al=np.where(al<40,0,np.clip((al-40)*255/175,0,255))
    H,W=al.shape; yy,xx=np.mgrid[0:H,0:W]; X=xx+L-ex; Y=yy+T-ey
    u=X*math.cos(ang)+Y*math.sin(ang); v=-X*math.sin(ang)+Y*math.cos(ang)
    top=(u/(0.80*w))**2+(v/(1.1*h))**2
    bot=(np.abs(u)/(0.70*w))**2.4+(np.clip(v,0,None)/(eyemouth*1.95))**2
    e=np.where(v<0,top,bot)
    keep=np.clip((1.0-e)/0.06,0,1)
    o[:,:,3]=(al*keep).astype(np.uint8); img=Image.fromarray(o); img=img.crop(img.getbbox())
    img.save(f'heads/{name}.png')
print('ok')

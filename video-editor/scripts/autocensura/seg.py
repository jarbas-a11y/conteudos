import sys, numpy as np
from rembg import remove, new_session
from PIL import Image, ImageFilter
s=new_session('u2net_human_seg')
for i in sys.argv[1:]:
    im=Image.open(f'up/p{i}.png').convert('RGB')
    out=remove(im, session=s, post_process_mask=True)
    a=np.asarray(out).copy()
    al=a[:,:,3].astype(float)
    al=np.where(al<40,0,np.clip((al-40)*255/(215-40),0,255))  # crisper matte
    a[:,:,3]=al.astype(np.uint8)
    o=Image.fromarray(a); bb=o.getbbox(); o=o.crop(bb); o.save(f'cut/c{i}.png'); print(i,bb,flush=True)

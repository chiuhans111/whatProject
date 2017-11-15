# @@var:
im = 20
v0 = 0
us = 0
uk = 0
f = 5
is1 = 0.5
is2 = 0.5
g = 9.807

# @@calc:
m = this.im / 1000
s1 = this.is1 * 1000
s2 = this.is2 * 1000


fs = Math.abs(this.us * this.m * this.g)
fk = Math.abs(this.us * this.m * this.g)
fn = (this.f - this.fk*Math.sign(this.f))
move = Math.abs(this.f) > this.fs;
movek = Math.abs(this.f) > this.fk;

fk = Math.abs(this.uk * this.m * this.g)
a1 = this.fn/this.m
# @@doc: 
# $en: PHYSICS $ch: 物理
## $en: Midterm Exam Explained $ch: 期中考講解
---
## $en: THE PROBLEM $ch: 題目

``` svg 350x150
rect x=10 width=50 height=50 style=fill:none;stroke:black
text font-size=16 x=10 y=70,{{m}} g
text font-size=16 x=90 y=40,{{f}} N

text font-size=16 x=50 y=85,{{is1}} km
text font-size=16 x=170 y=85,{{is2}} km

line x1=35 y1=25 x2=200 y2=25 style=stroke:black;stroke-width:2
line x1=0 y1=50 x2=200 y2=50 style=stroke:black;stroke-width:2
line x1=190 y1=35 x2=200 y2=25 style=stroke:black;stroke-width:2
line x1=190 y1=15 x2=200 y2=25 style=stroke:black;stroke-width:2

line x1=25 y1=90 x2=300 y2=90 style=stroke:black;stroke-width:2
text font-size=16 x=25 y=110,t0
line x1=25 y1=85 x2=25 y2=95 style=stroke:black;stroke-width:2
text font-size=16 x=130 y=110,t1
line x1=140 y1=85 x2=140 y2=95 style=stroke:black;stroke-width:2
text font-size=16 x=255 y=110,t2
line x1=255 y1=85 x2=255 y2=95 style=stroke:black;stroke-width:2
```

### ※$en: you can change the parameters $ch: 你可以隨意調整題目參數

$en: A box, weight `im` g, put on a table,
$ch: 有個重 `im` 公克的盒子放在桌上,

$en: the coefficient of friction:
$ch: 摩擦力係數為：
*\\mu _s* = `us` , *\\mu _k* = `uk`
$en: Apply a `f` N force toward right until it slides for `is1` *km*,
$ch: 對它向右施力 `f` 牛頓，直到它滑行 `is1` 公里，

$en: and stop the force, let it slide `is2` *km*.
$ch: 然後停止施力，再讓它滑行 `is2` 公里。
<if:us!=0||uk!=0>
## STEP 0: $en:friction$ch:摩擦力
``` js 300x150
{
    data:[
        [0,0],
        [fs,fs],
        [fs,fk],
        [fs*2,fk,false]
    ]
}
```
### $en: the relationship between force and friction $ch: 施力與摩擦力之間的關係
</if>
<if:us!=0>
$en:because we have static friction *\\mu _s* = `us`
$ch:因為有靜摩擦力 *\\mu _s* = `us`
$en:the box only move if$ch:盒子施力必須達成$  *F>\\mu _sF_n*
`f` {{move?'>':'<='}} {{fs}} $en: so it {{move?'moves':'will not move'}}.$ch: 因此它{{move?'會':'不會'}}移動。
</if>

<if:uk!=0>
$en:because we have dynamic friction *\\mu _k* = `uk`
$ch:因為有動摩擦力 *\\mu _k* = `uk`
$en:the box only move if$ch:盒子施力必須達成$  *F>\\mu _kF_n*
= `f` {{move?'>':'<='}} {{fk}} $en: so it {{move?'moves':'will not move'}}.$ch: 因此它{{move?'會':'不會'}}移動。
<if:movek>
$en: then we can calculate the net force *F_n=F-F_k*
$ch: 然後我們計算淨力 *F_n=F-F_k*
= `f` {{f>=0?'-':'+'}} {{fk}} = {{fn}}
</if>
</if>

<if:move&&movek>
## STEP 1: $en:acceleration$ch:加速度
*F=ma*, *a=\\frac{F}{m}*
= *\\frac{{{fn}}}{{{m}}}={{a1}}*
## STEP 2: $en:displacement$ch:位移
$en: velocity $ch:速度$  = *V_0+at*
``` js 300x150
{
    data:[
        [0,v0],
        [1,v0+a1],
        [2,v0+a1*2,false]
    ]
}
```
### v-t graph
$en: displacement $ch:位移$  = *V_0t+\\frac{1}{2}at^2*
``` js 300x150
[{
    data:{
        f:t=>v0*t+0.5*a1*t*t,
        s:0, e:2, d:10,
    },
    mark: false
},{
    data:[
        [0,0],
        [1,v0+0.5*a1]
    ],
    connect: false
}]
```
### s-t graph
</if>
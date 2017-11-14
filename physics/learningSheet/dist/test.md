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
move = Math.abs(this.f) > this.fs;

fk = Math.abs(this.uk * this.m * this.g)
a1 = (this.f - this.fk*Math.sign(this.f))/this.m
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

$en: A box, weight @in:im g, put on a table,
$ch: 有個重 @in:im 公克的盒子放在桌上,

$en: the coefficient of friction:
$ch: 摩擦力係數為：
__katex:\\mu _s__=@in:us , __katex:\\mu _k__=@in:uk
$en: Apply a @in:f N force toward right until it slides for @in:is1 __katex:km__,
$ch: 對它向右施力 @in:f 牛頓，直到它滑行 @in:is1 公里，

$en: and stop the force, let it slide @in:is2 __katex:km__.
$ch: 然後停止施力，再讓它滑行 @in:is2 公里。

## STEP 1: $en:acceleration$ch:加速度
@if:us!=0@ $en:because we have static friction __katex:\\mu _s__ = @in:us
@if:us!=0@ $ch:因為有靜摩擦力 __katex:\\mu _s__ = @in:us

@if:us!=0@ $en:the box only move if$ch:盒子施力必須達成$  __katex:F>\\mu _sF_n__
@if:us!=0@ @in:f {{move?'>':'<='}} {{fs}} $en: so it {{move?'':'will not'}} moves.$ch: 因此它{{move?'會':'不會'}}移動。

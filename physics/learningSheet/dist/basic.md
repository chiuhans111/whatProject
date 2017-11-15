## languages:
ch: 中文
en: ENGLISH
## data:
``` js
{
    "age" : 10,
    "name" : "hans"
}
```
## computed:
``` js
{
    hello(){
        return "My name is " + this.name + 
            ", I am " + this.age + " years old";
    }
}
```
## document:
# My name is `name`
I am `age` years old
---
#en#
but you can still change my name here: `>name`
here is the formula **y=ax+b**
``` js 300x300 autoxauto (auto,auto) 


```
# 一个自动生成ts接口的工具函数包
## 使用
### 运行命令
````
npm i @zwwpa/obj2ts

````
### 代码
````
import obj2ts from "@zwwpa/obj2ts";
const str=obj2ts({a:1,b:"b"})
console.log(str) 
// interface Root{
//	a:number;
//	b:string;
// }
````
## 注意：入参必须是个对象哦！！！

/*** 
 * 方法装饰器
 */
function factor(params: any) {
    console.log('params', params)
    // class 类中的方法装饰器接受三个参数，对传入的 jump 函数进行处理
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // 限制函数修改
        descriptor.writable = false
    }
}

/**
 * 类装饰器
 */
function factor1(params:any) {
    return (constructor: Function) => {
        console.log('constructor', constructor)
    }
}

@factor1('类装饰器')
export class Foo {
    @factor('这里是静态方法')
    static say() {
        console.log('say')
    }
    // 首先会执行 factor 函数，并且将传递参数给 factor
    @factor('我要调用 factor 函数了')
    jump() {
        console.log('i want to jump')
    }
}
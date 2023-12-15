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

export class Foo {
    // 首先会执行 factor 函数，并且将传递参数给 factor
    @factor('我要调用 factor 函数了')
    jump() {
        console.log('i want to jump')
    }
}
import "reflect-metadata";

/*** 
 * 方法装饰器
 */
function factor(params: any) {
    console.log('params', params)
    // class 类中的方法装饰器接受三个参数，对传入的 jump 函数进行处理
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // 限制函数修改
        // descriptor.writable = false
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


const formatMetadataKey = Symbol("format");

/**
 * 给参数装饰器添加一些元数据
 */
function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
}

const requiredMetadataKey = Symbol("required");
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
    let method = descriptor.value;
    descriptor.value = function () {
        let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error("Missing required argument.");
                }
            }
        }

        return method?.apply(this, arguments);
    }
}

@factor1('类装饰器')
export class Foo {
    // 给类属性添加元数据
    @format("Hello, %s")
    greeting!: string;
     _y = 'y'

    @factor('这里是静态方法')
    static say() {
        console.log('say')
    }
    @factor('访问器静态属性 x')
    static get x () {
        return 'x'
    }
    @factor('访问器属性 y')
    get y () {
        return this._y
    }
    // 首先会执行 factor 函数，并且将传递参数给 factor
    @factor('我要调用 factor 函数了')
    jump() {
        console.log('i want to jump')
    }

    @validate
    greet(@required name?: string) {
        return "Hello " + name + ", " + this.greeting;
    }
}
const foo = new Foo()
// 读取类上属性的元数据语法： Reflect.getMetadata(metadataKey, target[, propertyKey])
const result = Reflect.getMetadata(formatMetadataKey, foo, "greeting");

foo.greet()
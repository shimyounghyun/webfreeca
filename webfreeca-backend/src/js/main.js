import { pi, power, Foo } from './lib';
import "@babel/polyfill";

console.log(pi);
console.log(power(pi, pi));

const f = new Foo();
console.log(f.foo());
console.log(f.bar());
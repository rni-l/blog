class A {
  static single

  constructor() {
    console.log(1);
  }

  static getInstance() {
    if (!this.single) {
      this.single = new A()
    }
    return this.single
  }
}

const a = A.getInstance()
const a1 = A.getInstance()
const a2 = A.getInstance()

console.log(a,a1,a2);

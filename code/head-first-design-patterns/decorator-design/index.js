class Base {
  constructor(price) {
    this.price = price
  }

  cost() {
    return this.price
  }
}

class Decorator extends Base {
  target = null
}

class Milk extends Base {
}
class Coffee extends Decorator {
  constructor(price, _target) {
    super()
    this.target = _target
    this.price = price
  }

  cost() {
    return this.target.cost() + this.price
  }
}
class Mocha extends Decorator {
  constructor(price, _target) {
    super()
    this.target = _target
    this.price = price
  }

  cost() {
    return this.target.cost() + this.price
  }
}

const milk = new Milk(1)
const coffee = new Coffee(2, milk)
const mocha = new Mocha(3, coffee)

console.log('milk', milk.cost());
console.log('coffee', coffee.cost());
console.log('mocha', mocha.cost());


class Subject {
  observer = []

  subscription(key, cb) {
    this.observer.push({
      key, cb
    })
  }

  cancel(key) {
    this.observer = this.observer.filter(v => v.key !== key)
  }

  notice(...args) {
    this.observer.forEach(v => v.cb(...args))
  }
}

const subject = new Subject()

subject.subscription('a1', (...args) => {
  console.log('a1:', ...args);
})
subject.subscription('a2', (...args) => {
  console.log('a2:', ...args);
})

console.log('first');
subject.notice('d', '1')
console.log('second');
subject.notice('c', '1',2,3,4)
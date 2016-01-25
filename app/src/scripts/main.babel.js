// compile javascript in here with babel

(() => {
  function* fib() {
    let prev = 0, cur = 1;
    for(;;) {
      yield cur;
      let temp = cur;
      cur = cur + prev;
      prev = temp;
    }
  }

  for(let num of fib()) {
    if(num > 100) {
      break;
    }
    document.write(num + '<br>');
  }
})();
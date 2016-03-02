// compile javascript in here with babel

(($) => {

  function* fib() {
    let prev = 0, cur = 1;
    for(;;) {
      yield cur;
      let temp = cur;
      cur = cur + prev;
      prev = temp;
    }
  }

  let text = '';
  for(let num of fib()) {
    text += num;
    if(num > 1000) {
      break;
    }
    text += ', ';
  }
  $('#fibonacci').text(text);

})(jQuery);

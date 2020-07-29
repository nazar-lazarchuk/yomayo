// функції можуть змінювати state та ловити computed/props через контекст this

export const doIncrement = function() {
  this.count++;
  console.log('doIncrement');
  return true;
}

export const doDecrement = function() {
  this.count--;
  console.log('doDecrement');
}

export const showProp1 = function() {
  alert(this.myProp1);
}

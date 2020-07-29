// функції можуть змінювати state та ловити computed/props через контекст this

export const doIncrement = function() {
  this.count++;
}

export const doDecrement = function() {
  this.count--;
}

export const showProp1 = function() {
  alert(this.myProp1);
}

export const changeName = function() {
  this.firstName += '_C';
}

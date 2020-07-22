// функції можуть змінювати state та ловити computed/props через контекст this

export const doIncrement = () => {
  this.count++;
}

export const doDecrement = () => {
  this.count--;
}

export const showProp1 = () => {
  alert(this.myProp1);
}

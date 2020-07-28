// початковий стан компонента
export const initialState = {
  firstName: 'John',
  lastName: 'Doe',

  address: 'Lviv, Ukraine',

  count: 0,
};

// обчислювальні властивості компонента
export const computedState = {
  // проста обчислювальна властивість
  fullName() {
    return this.firstName + ' ' + this.lastName;
  },

  // більш складна обчислювальна властивість
  initials(){
    return this.fullName + ' ' + this.address;
  }
};

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
  fullName: (state) => state.firstName + ' ' + state.lastName,

  // більш складна обчислювальна властивість
  initials: (state) => state.fullName + ' ' + state.address,
};

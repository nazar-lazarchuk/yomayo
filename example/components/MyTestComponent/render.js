import { createElement } from 'my-framework';
/** @jsx createElement */

export default (context) => {
  const {
    fullName,
    count,
    doIncrement,
    doDecrement,
    changeName,
    test,
  } = context;

  return (
    <div>
      <h1>Dude {fullName} is cool!</h1>

      <h2>Count: {count}</h2>
      <button type="button" onClick={doIncrement}>
        Increment
      </button>
      <button type="button" onClick={doDecrement}>
        Decrement
      </button>

      <br />
      <br />
      {/* <button type="button" onclick="showProp1">Клац!</button> */}

      <button type="button" onClick={changeName}>
        Змінити ім'я!
      </button>

      <span>{test}</span>

      {/* <button type="button" onclick="() => doDecrement">Decrement</button> */}
    </div>
  );
};

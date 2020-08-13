import Yomayo from 'yomayo';
/** @jsx Yomayo */

export default (ctx) => {
  const {
    fullName,
    count,
    doIncrement,
    doDecrement,
    changeName,
    test,
  } = ctx;

  return (
    <div style={`border: ${count}px solid red`}>
      <h1>Dude {fullName} is cool!</h1>

      {count % 2 === 1 && <h2>Count Непарний</h2>}
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

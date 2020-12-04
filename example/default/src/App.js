import Yomayo from 'yomayo';
/** @jsx Yomayo */

import { getContext } from './Store';

export default () => {
  const context = getContext();

  const data = context.setData({
    name: 'App Component'
  });

  return (
    <div>
      <h1>{data.name}</h1>
    </div>
  );
};

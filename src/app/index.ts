export const createApp = (store: any) => (render: any) => {
  return { store, render };
};

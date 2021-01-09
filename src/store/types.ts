export interface IStore {
  modules: {
    key: string;
    data: { [key: string]: any };
    computed: { [key: string]: any };
  }[];
}

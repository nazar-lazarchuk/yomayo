export interface Writable {
  key: string;
  set(value: any): void;
  update(f: (previousValue: any) => any): void;
}

export interface IRenderDataFormat {
  key: string;
}

export interface IStoreModule {
  readonly key: string;
  data: { [key: string]: any };
  computed: { [key: string]: any };

  addData(initialValue: any): Writable;

  get(writable: Writable): IRenderDataFormat;
}

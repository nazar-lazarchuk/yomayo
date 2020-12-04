export type ComponentType = {
  tag: string;
  props: { [key: string]: any };
  children: ComponentType[];
};

export type FrameworkType = {
  $$type: 'data';
  $$value: any;
};

export type ChildType = ComponentType | FrameworkType;

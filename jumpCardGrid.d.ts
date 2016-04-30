interface JumpCardGridOptions {
  breakpoints: number[];
  element: HTMLElement;
  cardSelector: string;
  cardClass: string;
  cardTag: string;
  placeholderTag: string;
  placeholderClass: string;
  idSelector: string;
  sortable: boolean;
  handleSelector: string;
  order: string[];
  gutter: number;
  onMoveStart: (card: HTMLElement, evt: Event) => void;
  onMove: (card: HTMLElement, evt: Event) => void;
  onMoveEnd: (card: HTMLElement, evt: Event) => void;
  onPositionChange: (card: HTMLElement, evt: Event) => void;
}

declare class JumpCardGrid {
  constructor(element: HTMLElement, options: JumpCardGridOptions);
  public getOrder: () => string[];
  public setSortable: (val: boolean) => void;
  public add: (innerHTML: string | HTMLElement | DocumentFragment, name?: string, index?: number, render?: boolean) => HTMLElement;
  public remove: (card: HTMLElement, removeElement?: boolean) => void;
  public render: () => void;
  public renderNow: () => void;
}

interface JumpCardGridOptions {
  breakpoints?: number[];
  cardSelector?: string;
  cardClass?: string;
  cardTag?: string;
  placeholderTag?: string;
  placeholderClass?: string;
  idSelector?: string;
  sortable?: boolean;
  handleSelector?: string;
  order?: string[];
  gutter?: number;
  onMoveStart?: (card: Element, evt: Event) => void;
  onMove?: (card: Element, evt: Event) => void;
  onMoveEnd?: (card: Element, evt: Event) => void;
  onPositionChange?: (card: Element, evt: Event) => void;
}

declare class JumpCardGrid {
  constructor(element: Element, options?: JumpCardGridOptions);
  public getOrder: () => string[];
  public setSortable: (val: boolean) => void;
  public add: (innerHTML: string | Element | DocumentFragment, name?: string, index?: number, render?: boolean) => Element;
  public remove: (card: Element, removeElement?: boolean) => void;
  public addSortListeners: (card: Element) => void;
  public render: () => void;
  public renderNow: () => void;
  public setScroll: (x: number, y: number) => void;
  public setCardSelector: (selector: string) => void;
}

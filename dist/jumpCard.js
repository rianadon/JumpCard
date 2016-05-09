/* eslint no-param-reassign:0 */

(() => {
  let ticking = false;
  let timeoutId;
  const opts = {
    breakpoints: [400, 800, 1300, 1900, 2600, 3400],
    element: null,
    cardSelector: '.card',
    cardClass: 'card',
    cardTag: 'div',
    placeholderTag: 'div',
    placeholderClass: 'placeholder',
    idSelector: '.card-header',
    sortable: false,
    handleSelector: '.card-handle',
    order: [],
    gutter: 24,
    onMoveStart: () => {},
    onMove: () => {},
    onMoveEnd: () => {},
    onPositionChange: () => {},
  };
  let scrollLeft, scrollTop;

  let setReady = true;

  function resize() {
    ticking = true;
    // Calculate number of columns
    let columns = 1;
    for (const w of opts.breakpoints) {
      if (w >= window.innerWidth) break;
      columns++;
    }
    const columnHeights = Array.from(new Array(columns), () => 0);
    const cch = [];
    const cards = Array.from(opts.element.querySelectorAll(`${opts.cardSelector}:not(.moving)`));
    cards.sort((a, b) => {
      const ai = opts.order.indexOf(a.getAttribute('data-cardid'));
      const bi = opts.order.indexOf(b.getAttribute('data-cardid'));
      if (ai === -1 || bi === -1) {
        throw new Error(`Could not find a card's id in the order
          a id = ${a.getAttribute('data-cardid')},
          b id = ${b.getAttribute('data-cardid')}
          order = ${opts.order}`);
      }
      return ai - bi;
    });
    cards.forEach((card, n) => {
      const col = n % columns;
      card.style.left = `${100 / columns * col}%`;
      card.style.right = `${100 / columns * (columns - col - 1)}%`;
    });
    cards.forEach((card, n) => {
      const col = n % columns;
      cch.push(columnHeights[col]);
      columnHeights[col] += card.offsetHeight + opts.gutter;
    });
    cards.forEach((card, n) => {
      card.style.top = `${cch[n]}px`;
    });
    opts.element.style.height = `${Math.max(...columnHeights)}px`;
    clearTimeout(timeoutId);
    if (setReady) {
      opts.element.setAttribute('data-jumpReady', '');
      setReady = false;
    }
    timeoutId = setTimeout(() => {
      cch.length = 0;
      cards.forEach((card, n) => {
        const col = n % columns;
        if (n < columns) columnHeights[col] = 0;
        cch.push(columnHeights[col]);
        columnHeights[col] += card.offsetHeight + opts.gutter;
      });
      cards.forEach((card, n) => {
        card.style.top = `${cch[n]}px`;
      });
      opts.element.style.height = `${Math.max(...columnHeights)}px`;
    }, 500);
    ticking = false;
  }

  function resizeCaller() {
    if (!ticking) {
      requestAnimationFrame(resize);
      ticking = true;
    }
  }

  function startMove(card) {
    return (evt) => {
      if (!opts.sortable) return;
      const placeholder = document.createElement(opts.placeholderTag);
      placeholder.classList.add(opts.placeholderClass);
      placeholder.classList.add(opts.cardClass);
      placeholder.setAttribute('data-cardid', 'placeholder');
      placeholder.style.left = card.style.left;
      placeholder.style.right = card.style.right;
      placeholder.style.top = card.style.top;
      placeholder.style.height = window.getComputedStyle(card).height;
      opts.element.appendChild(placeholder);

      const id = card.getAttribute('data-cardid');
      let pi = opts.order.indexOf(id);
      opts.order[pi] = 'placeholder';

      card.classList.add('moving');
      document.body.classList.add('cardsmoving');

      card.style.width = window.getComputedStyle(card).width;
      card.style.right = 'auto';

      const evt2 = evt instanceof MouseEvent ? evt : evt.targetTouches[0];
      const t = evt2.pageY - parseInt(window.getComputedStyle(card).top, 10);
      const l = evt2.pageX - parseInt(window.getComputedStyle(card).left, 10);
      const st = scrollTop;
      const sl = scrollLeft;

      let nt = 0; // For debouncing

      opts.onMoveStart(card, evt);

      function onMove(e) {
        e.preventDefault();
        const e2 = evt instanceof MouseEvent ? e : e.targetTouches[0];
        card.style.left = `${e2.pageX + scrollLeft - l - sl}px`;
        card.style.top = `${e2.pageY + scrollTop - t - st}px`;
        opts.onMove(card, e);
        if (new Date().getTime() > nt) {
          const parent = e instanceof MouseEvent ? e.target :
            document.elementFromPoint(e2.clientX, e2.clientY); // Element moved onto
          if (parent.classList.contains('card') &&
            !parent.classList.contains(opts.placeholderClass)) {
            const cid = parent.getAttribute('data-cardid');
            const ci = opts.order.indexOf(cid);
            opts.order.splice(pi, 1);
            opts.order.splice(ci, 0, 'placeholder');
            pi = opts.order.indexOf('placeholder');
            opts.onPositionChange(card, e);
            resizeCaller();
            nt = Date.now() + 300;
          }
        }
      }
      function onUp(e) {
        document.removeEventListener('mousemove', onMove, true);
        document.removeEventListener('touchmove', onMove, true);
        opts.order[opts.order.indexOf('placeholder')] = id;
        card.classList.remove('moving');
        document.body.classList.remove('cardsmoving');
        placeholder.remove();
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchend', onUp);
        opts.onMoveEnd(card, e);
        resize();
        card.style.width = 'auto';
      }
      document.addEventListener('mousemove', onMove, true);
      document.addEventListener('touchmove', onMove, true);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchend', onUp);
    };
  }

  class JumpCardGrid {
    constructor(element, options = {}) {
      for (const option of Object.keys(options)) {
        if (options[option]) opts[option] = options[option];
      }
      opts.element = element;
      for (const card of Array.from(element.querySelectorAll(opts.cardSelector))) {
        if (opts.idSelector) {
          card.setAttribute('data-cardid', card.querySelector(opts.idSelector).textContent);
        }
        if (opts.handleSelector) {
          const h = card.querySelector(opts.handleSelector);
          h.addEventListener('mousedown', startMove(card));
          h.addEventListener('touchstart', startMove(card));
        }
      }
      if (opts.order.length === 0) {
        opts.order = Array.from(element.querySelectorAll(opts.cardSelector))
          .map(e => e.getAttribute('data-cardid'));
      }
      window.addEventListener('resize', resizeCaller);
      resizeCaller();
    }
    getOrder() {
      return opts.order;
    }
    setSortable(val) {
      opts.sortable = val;
    }
    add(innerHTML, name, index = -1, render = true) {
      if (index < 0) index = opts.order.length;
      const newCard = document.createElement(opts.cardTag);
      newCard.classList.add(opts.cardClass);
      if (typeof innerHTML === 'string') {
        newCard.innerHTML = innerHTML;
      } else {
        newCard.appendChild(innerHTML);
      }

      this.addSortListeners(newCard);

      if (!name) name = newCard.querySelector(opts.idSelector).textContent;
      newCard.setAttribute('data-cardid', name);
      opts.element.appendChild(newCard);
      opts.order.splice(index, 0, name);
      if (render) resizeCaller();
      return newCard;
    }
    remove(card, removeElement = true) {
      const id = card.getAttribute('data-cardid');
      opts.order.splice(opts.order.indexOf(id), 1);
      if (removeElement) card.remove();
    }
    addSortListeners(card) {
      if (opts.handleSelector) {
        const h = card.querySelector(opts.handleSelector);
        h.addEventListener('mousedown', startMove(card));
        h.addEventListener('touchstart', startMove(card));
      }
    }
    render() {
      resizeCaller();
    }
    renderNow() {
      resize();
    }
    setScroll(x, y) {
      scrollLeft = x;
      scrollTop = y;
    }
    setCardSelector(selector) {
      opts.cardSelector = selector;
    }
  }
  window.JumpCardGrid = JumpCardGrid;
})();

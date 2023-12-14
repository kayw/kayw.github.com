'use client';
import { cloneElement, forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
//import { supportRef, useComposeRef } from 'rc-util/lib/ref';
//import OrderContext from './Context';
//import useDom from './useDom';
//import { inlineMock } from './mock';
//import { updateCSS, removeCSS } from 'rc-util/lib/Dom/dynamicCSS';
//import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
//import { getTargetScrollBarSize } from 'rc-util/lib/getScrollBarSize';
import { isMemo } from 'react-is';

// https://github.com/react-component/portal/blob/master/src/Portal.tsx  eliminate queueCreate
// https://github.com/react-component/util/blob/master/src/Dom/dynamicCSS.ts src/refs.ts and a lot of other ts files

function fillRef<T>(ref: React.Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as { current: T }).current = node;
  }
}

/**
 * Merge refs into one ref function to support ref passing.
 */
function composeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  const refList = refs.filter((ref) => ref);
  if (refList.length <= 1) {
    return refList[0];
  }

  return (node: T) => {
    refs.forEach((ref) => {
      fillRef(ref, node);
    });
  };
}

interface Cache<Value, Condition> {
  condition?: Condition;
  value?: Value;
}

function useMemo<Value, Condition = any[]>(
  getValue: () => Value,
  condition: Condition,
  shouldUpdate: (prev: Condition, next: Condition) => boolean,
) {
  const cacheRef = useRef<Cache<Value, Condition>>({});

  if (!('value' in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
    cacheRef.current.value = getValue();
    cacheRef.current.condition = condition;
  }

  return cacheRef.current.value;
}

function useComposeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  return useMemo(
    () => composeRef(...refs),
    refs,
    (prev, next) => prev.length !== next.length || prev.every((ref, i) => ref !== next[i]),
  );
}

function supportRef(nodeOrComponent): boolean {
  const type = isMemo(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;

  // Function component node
  if (typeof type === 'function' && !type.prototype?.render) {
    return false;
  }

  // Class component
  if (typeof nodeOrComponent === 'function' && !nodeOrComponent.prototype?.render) {
    return false;
  }

  return true;
}

let cached: number;

function getScrollBarSize(fresh?: boolean) {
  if (typeof document === 'undefined') {
    return 0;
  }

  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    const outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = '0';
    outerStyle.left = '0';
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);

    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthScroll;
  }
  return cached;
}

function ensureSize(str: string) {
  const match = str.match(/^(.*)px$/);
  const value = Number(match?.[1]);
  return Number.isNaN(value) ? getScrollBarSize() : value;
}

function getTargetScrollBarSize(target: HTMLElement) {
  if (typeof document === 'undefined' || !target || !(target instanceof Element)) {
    return { width: 0, height: 0 };
  }

  const { width, height } = getComputedStyle(target, '::-webkit-scrollbar');
  return {
    width: ensureSize(width),
    height: ensureSize(height),
  };
}

const APPEND_ORDER = 'data-rc-order';
const APPEND_PRIORITY = 'data-rc-priority';
const MARK_KEY = `rc-util-key`;

type ContainerType = Element | ShadowRoot | DocumentFragment;
const containerCache = new Map<ContainerType, Node & ParentNode>();

type Prepend = boolean | 'queue';
type AppendType = 'prependQueue' | 'append' | 'prepend';

interface Options {
  attachTo?: ContainerType;
  csp?: { nonce?: string };
  prepend?: Prepend;
  /**
   * Config the `priority` of `prependQueue`. Default is `0`.
   * It's useful if you need to insert style before other style.
   */
  priority?: number;
  mark?: string;
}

function contains(root: Node | null | undefined, n: Node) {
  if (!root) {
    return false;
  }

  // Use native if support
  if (root.contains) {
    return root.contains(n);
  }

  // `document.contains` not support with IE11
  let node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}

function getMark({ mark }: Options = {}) {
  if (mark) {
    return mark.startsWith('data-') ? mark : `data-${mark}`;
  }
  return MARK_KEY;
}

function getContainer(option: Options) {
  if (option.attachTo) {
    return option.attachTo;
  }

  const head = document.querySelector('head');
  return head || document.body;
}

function getOrder(prepend?: Prepend): AppendType {
  if (prepend === 'queue') {
    return 'prependQueue';
  }

  return prepend ? 'prepend' : 'append';
}

/**
 * Find style which inject by rc-util
 */
function findStyles(container: ContainerType) {
  return Array.from((containerCache.get(container) || container).children).filter(
    (node) => node.tagName === 'STYLE',
  ) as HTMLStyleElement[];
}

function injectCSS(css: string, option: Options = {}) {
  const { csp, prepend, priority = 0 } = option;
  const mergedOrder = getOrder(prepend);
  const isPrependQueue = mergedOrder === 'prependQueue';

  const styleNode = document.createElement('style');
  styleNode.setAttribute(APPEND_ORDER, mergedOrder);

  if (isPrependQueue && priority) {
    styleNode.setAttribute(APPEND_PRIORITY, `${priority}`);
  }

  if (csp?.nonce) {
    styleNode.nonce = csp?.nonce;
  }
  styleNode.innerHTML = css;

  const container = getContainer(option);
  const { firstChild } = container;

  if (prepend) {
    // If is queue `prepend`, it will prepend first style and then append rest style
    if (isPrependQueue) {
      const existStyle = findStyles(container).filter((node) => {
        // Ignore style which not injected by rc-util with prepend
        if (!['prepend', 'prependQueue'].includes(node.getAttribute(APPEND_ORDER) as string)) {
          return false;
        }

        // Ignore style which priority less then new style
        const nodePriority = Number(node.getAttribute(APPEND_PRIORITY) || 0);
        return priority >= nodePriority;
      });

      if (existStyle.length) {
        container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);

        return styleNode;
      }
    }

    // Use `insertBefore` as `prepend`
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }

  return styleNode;
}

function findExistNode(key: string, option: Options = {}) {
  const container = getContainer(option);

  return findStyles(container).find((node) => node.getAttribute(getMark(option)) === key);
}

function removeCSS(key: string, option: Options = {}) {
  const existNode = findExistNode(key, option);
  if (existNode) {
    const container = getContainer(option);
    container.removeChild(existNode);
  }
}

/**
 * qiankun will inject `appendChild` to insert into other
 */
function syncRealContainer(container: ContainerType, option: Options) {
  const cachedRealContainer = containerCache.get(container);

  // Find real container when not cached or cached container removed
  if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
    const placeholderStyle = injectCSS('', option);
    const { parentNode } = placeholderStyle;
    containerCache.set(container, parentNode!);
    container.removeChild(placeholderStyle);
  }
}

function updateCSS(css: string, key: string, option: Options = {}) {
  const container = getContainer(option);

  // Sync real parent
  syncRealContainer(container, option);

  const existNode = findExistNode(key, option);

  if (existNode) {
    if (option.csp?.nonce && existNode.nonce !== option.csp?.nonce) {
      existNode.nonce = option.csp?.nonce;
    }

    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }

    return existNode;
  }

  const newNode = injectCSS(css, option);
  newNode.setAttribute(getMark(option), key);
  return newNode;
}

function isBodyOverflowing() {
  return (
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
    window.innerWidth > document.body.offsetWidth
  );
}

const UNIQUE_ID = `rc-util-locker-${Date.now()}`;

let uuid = 0;

function useScrollLocker(lock?: boolean) {
  const mergedLock = !!lock;
  const [id] = useState(() => {
    uuid += 1;
    return `${UNIQUE_ID}_${uuid}`;
  });

  useLayoutEffect(() => {
    if (mergedLock) {
      const scrollbarSize = getTargetScrollBarSize(document.body).width;
      const isOverflow = isBodyOverflowing();

      updateCSS(
        `
html body {
  overflow-y: hidden;
  ${isOverflow ? `width: calc(100% - ${scrollbarSize}px);` : ''}
}`,
        id,
      );
    } else {
      removeCSS(id);
    }

    return () => {
      removeCSS(id);
    };
  }, [mergedLock, id]);
}

export type GetContainer = string | ContainerType | (() => ContainerType) | false;

export interface PortalProps {
  /** Customize container element. Default will create a div in document.body when `open` */
  getContainer?: GetContainer;
  children?: React.ReactNode;
  /** Show the portal children */
  open?: boolean;
  /** Remove `children` when `open` is `false`. Set `false` will not handle remove process */
  autoDestroy?: boolean;
  /** Lock screen scroll when open */
  autoLock?: boolean;

  /** @private debug name. Do not use in prod */
  debug?: string;
}

const getPortalContainer = (getContainer: GetContainer) => {
  if (getContainer === false) {
    return false;
  }

  if (!getContainer) {
    return null;
  }

  if (typeof getContainer === 'string') {
    return document.querySelector(getContainer);
  }
  if (typeof getContainer === 'function') {
    return getContainer();
  }
  return getContainer;
};

export const Portal = forwardRef<unknown, PortalProps>((props, ref) => {
  const { open, autoLock, getContainer = false, /*debug,*/ autoDestroy = true, children } = props;

  const [shouldRender, setShouldRender] = useState(open);

  const mergedRender = shouldRender || open;

  // ====================== Should Render ======================
  useEffect(() => {
    if (autoDestroy || open) {
      setShouldRender(open);
    }
  }, [open, autoDestroy]);

  // ======================== Container ========================
  const [innerContainer, setInnerContainer] = useState<ContainerType | false | null>(() =>
    getPortalContainer(getContainer),
  );

  useEffect(() => {
    const customizeContainer = getPortalContainer(getContainer);

    // Tell component that we check this in effect which is safe to be `null`
    setInnerContainer(customizeContainer ?? null);
  }, [getContainer]);

  //const [defaultContainer, queueCreate] = useDom(mergedRender && !innerContainer, debug);
  //const mergedContainer = innerContainer ?? defaultContainer;

  // ========================= Locker ==========================
  useScrollLocker(
    autoLock &&
      open &&
      /*mergedContainer === defaultContainer || mergedContainer*/ innerContainer === document.body,
  );

  // =========================== Ref ===========================
  let childRef: React.Ref<any> = null;

  if (children && supportRef(children) && ref) {
    ({ ref: childRef } = children as any);
  }

  const mergedRef = useComposeRef(childRef, ref);

  // ========================= Render ==========================
  // Do not render when nothing need render
  // When innerContainer is `undefined`, it may not ready since user use ref in the same render
  if (!mergedRender || innerContainer === undefined) {
    return null;
  }

  // Render inline
  const renderInline = innerContainer === false; //mergedContainer === false || inlineMock();

  let reffedChildren = children;
  if (ref) {
    reffedChildren = cloneElement(children as any, {
      ref: mergedRef,
    });
  }
  return renderInline ? reffedChildren : createPortal(reffedChildren, innerContainer);

  /*
  return (
    <OrderContext.Provider value={queueCreate}>
      {renderInline ? reffedChildren : createPortal(reffedChildren, mergedContainer)}
    </OrderContext.Provider>
  );
*/
});

if (process.env.NODE_ENV !== 'production') {
  Portal.displayName = 'Portal';
}

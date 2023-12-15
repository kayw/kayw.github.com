'use client';

import { useEffect, useState } from 'react';

// https://www.patterns.dev/posts/singleton-pattern
let instance = false;
class Counter {
  counter: 0;
  constructor() {
    if (instance) {
      throw new Error('Singleton instance already created.');
    }
    instance = true;
    this.counter = 0;
  }
  getCount() {
    return this.counter;
  }
  increment() {
    return ++this.counter;
  }
  decrement() {
    return --this.counter;
  }
}

const singleCounter = new Counter();

// TODO
// <SideNote>aaaa</SideNote>
export function SideNote(props: {
  content: React.ReactElement;
  children: React.ReactElement;
  direction?: 'left' | 'right';
}) {
  const { content, direction = 'right' } = props;
  const [count, setCount] = useState<number>();
  const [checked, setChecked] = useState(true);
  const [matches, setMatches] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 2000px)').matches : [],
  );
  const snrefId = `snref-${count}`;
  const snId = `sn-${count}`;
  useEffect(() => {
    setCount(singleCounter.increment());
    // https://stackoverflow.com/questions/54491645/media-query-syntax-for-reactjs
    window
      .matchMedia('(max-width: 2000px)')
      .addEventListener('change', (e) => setMatches(e.matches));
    return () => {
      singleCounter.decrement();
    };
  }, []);
  return (
    <span className="inline sidenote">
      <span aria-describedby={`sidenote-${count}`} className="sidenote-label">
        <sup id={snrefId}>
          <a
            href={`#${snId}`}
            className="sidenote-label-button"
            onClick={(ev) => {
              if (!matches) {
                return;
              }

              setChecked(!checked);
              ev.preventDefault();
            }}
          >
            {count}
          </a>
        </sup>
      </span>
      <small
        id={snId}
        className={`sidenote-content ${
          checked ? 'sidenote-content-mobile' : 'sidenote-content-hidden'
        } sidenote-content-${direction} sidenote-content-number-${count} bg-stone-300/40 dark:bg-zinc-600/40 text-[#313B44] dark:text-gray-300`}
      >
        <span className="sidenote-label float-left mr-[0.4em] relative leading-1 -top-[0.27778rem]">
          {count}
        </span>
        <span className="sidenote-content-parenthesis">(sidenote:</span>
        {content}
        <a href={`#${snrefId}`} className="reversefootnote ml-1 no-underline">
          ↩
        </a>
        <span className="sidenote-content-parenthesis">)</span>
      </small>
    </span>
  );
}

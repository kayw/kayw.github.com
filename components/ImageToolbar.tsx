import { forwardRef, CSSProperties, ReactNode, HTMLAttributes } from 'react';
//import cs from '../_util/classNames';
//import IconMore from '../../icon/react-icon/IconMore';
//import { TriggerForToolbar } from './trigger-for-toolbar';
//
//https://github.com/arco-design/arco-design/blob/main/components/Image/image-preview-toolbar.tsx

/**
 * @title ImageToolbarActionProps
 */
export interface ImageToolbarActionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * @zh 唯一标识
   * @en Unique identifier
   */
  key: string;
  /**
   * @zh 内容
   * @en content
   */
  icon: ReactNode;
  /**
   * @zh
   * 因为 content 只能定义内容，所以提供这个函数用于支持自定义外围元素，需要注意的是设置了 `getContainer`, 显示 `name` 的 `Tooltip` 将失效。
   * @en
   * Because content can only specify content, this function is provided to support custom peripheral elements.
   * Note that if `getContainer` is set, the `Tooltip` displaying `name` will be invalid
   */
  getContainer?: (actionElement: ReactNode) => ReactNode;
  /**
   * @zh 名称
   * @en name
   */
  name?: string;
  /**
   * @zh 是否禁用
   * @en Whether disabled
   */
  disabled?: boolean;
}
interface ImageToolbarProps {
  style?: CSSProperties;
  //className?: string | string[];
  simple?: boolean;
  actions?: ImageToolbarActionProps[];
  actionsLayout: string[];
  defaultActions: ImageToolbarActionProps[];
}

export const ImageToolbar = forwardRef<HTMLDivElement, ImageToolbarProps>(function ImageToolbarComp(
  props: ImageToolbarProps,
  ref,
) {
  const { simple = false, actions = [], actionsLayout = [], defaultActions = [] } = props;

  // Filter based on layout
  const actionsLayoutSet = new Set(actionsLayout);
  const filterWithLayout = (item: ImageToolbarActionProps) => actionsLayoutSet.has(item.key);
  const filteredActions = [
    ...defaultActions.filter(filterWithLayout),
    ...actions.filter(filterWithLayout),
  ];
  const extraActions = actions.filter((item) => !actionsLayoutSet.has(item.key));
  // Sort by layout
  const resultActions = filteredActions.sort((pre, cur) => {
    const preIndex = actionsLayout.indexOf(pre.key);
    const curIndex = actionsLayout.indexOf(cur.key);
    return preIndex > curIndex ? 1 : -1;
  });
  if (actionsLayoutSet.has('extra')) {
    const extraIndex = actionsLayout.indexOf('extra');
    resultActions.splice(extraIndex, 0, ...extraActions);
  }

  const renderAction = (itemData: ImageToolbarActionProps /*, renderName = false*/) => {
    const { icon: content, disabled, key, name, getContainer, onClick, ...rest } = itemData;
    const action = (
      <div
        className={`flex items-center ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } bg-transparent ${
          disabled
            ? 'text-fuchsia-50/60 hover:text-blue-400'
            : 'text-neutral-700 hover:text-amber-300/80'
        } rounded`}
        key={key}
        onClick={(e) => {
          if (!disabled && onClick) {
            onClick(e);
          }
        }}
        onMouseDown={(e) => {
          // To solve the problem that tooltip is selected when button is quickly clicked
          e.preventDefault();
        }}
        {...rest}
      >
        {content && (
          <span className={`py-1 px-3 leading-none`} title={name}>
            {content}
          </span>
        )}
        {/*renderName && name && (
          <span className={`${previewPrefixCls}-toolbar-action-name`}>{name}</span>
        )*/}
      </div>
    );
    if (getContainer) {
      return getContainer(action);
    }
    return action;
  };

  if (!resultActions.length) return null;

  const actionList = resultActions.map((item) => {
    const action = renderAction(item /*, simple*/);
    /*
    if (!simple && item.name && !item.getContainer) {
      return (
        <Tooltip content={item.name} key={item.key}>
          {action}
        </Tooltip>
      );
    }
*/
    return action;
  });

  return (
    <div
      ref={ref}
      className={`absolute left-1/2 bottom-10 -translate-x-1/2 flex bg-sky-200/70 rounded-full items-start px-6 ${
        simple ? 'py-2' : 'py-3'
      }`}
      style={props.style}
    >
      {/* mobile toolbar support when less than break point show serveral tools with more action
      simple && (
        <TriggerForToolbar
          prefixCls={prefixCls}
          className={`${previewPrefixCls}-trigger`}
          popup={() => <div>{actionList}</div>}
        >
          {renderAction({
            key: 'trigger',
            content: (
              <span>
                <IconMore />
              </span>
            ),
          })
*/}
      {!simple && actionList}
    </div>
  );
});

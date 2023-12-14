'use client';
import {
  DependencyList,
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
  WheelEvent,
  ReactNode,
  ImgHTMLAttributes,
} from 'react';
import { ImageToolbar, ImageToolbarActionProps } from './ImageToolbar';
import { Portal } from './Portal';
//import { CSSTransition } from 'react-transition-group';
//import cs from '../_util/classNames';
import { Fullscreen, Loader, Repeat1, RotateCw, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
/*
import IconZoomOut from '../../icon/react-icon/IconZoomOut';
import IconZoomIn from '../../icon/react-icon/IconZoomIn';
import IconFullscreen from '../../icon/react-icon/IconFullscreen';
import IconClose from '../../icon/react-icon/IconClose';
import IconRotateLeft from '../../icon/react-icon/IconRotateLeft';
import IconRotateRight from '../../icon/react-icon/IconRotateRight';
import IconOriginalSize from '../../icon/react-icon/IconOriginalSize';
*/

// https://github.com/arco-design/arco-design/blob/main/components/Image/image-preview.tsx
// https://github.com/react-component/image/blob/master/src/Preview.tsx
// unused https://github.com/rpearce/react-medium-image-zoom/blob/main/source/Controlled.tsx
// #TODO cleanup portal toolbar / transition effect more advanced / css color to headless

const ROTATE_STEP = 90;

const Esc = {
  key: 'Escape',
  code: 27,
};
const ArrowUp = {
  key: 'ArrowUp',
  code: 38,
};

const ArrowDown = {
  key: 'ArrowDown',
  code: 40,
};

type ImageStatusType = 'beforeLoad' | 'loading' | 'error' | 'loaded' | 'lazyload';

function useImageStatus(defaultValue: ImageStatusType) {
  const [status, setStatus] = useState<ImageStatusType>(defaultValue);
  const isBeforeLoad = status === 'beforeLoad';
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isLoaded = status === 'loaded';
  const isLazyLoad = status === 'lazyload';
  return {
    status,
    isBeforeLoad,
    isLoading,
    isError,
    isLoaded,
    isLazyLoad,
    setStatus,
  };
}

function useUpdate(fn: () => void, deps: DependencyList = []) {
  const isDidMount = useRef(false);

  useEffect(() => {
    if (isDidMount.current) {
      fn();
    } else {
      isDidMount.current = true;
    }
  }, deps);
}

type ImageGestureHandle = {
  reset: () => void;
};

/**
 * @title Image Preview for zoom/pinch-pan/rotate
 */
interface ImageGestureProps {
  //style?: CSSProperties;
  className?: string | string[];
  /**
   * @zh 图片获取地址, 在 Image 中默认是 Image 的 src
   * @en Image path, The default in Image is the src of Image
   */
  src: string;
  /**
   * @zh 图片属性，透传至预览弹窗中的 `img` 标签上
   * @en Image props, passthrough to the `img` tag in the preview modal
   * @version 2.39.0
   */
  imgAttributes?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>;
  /**
   * @zh 自定义图片预览区域的额外节点
   * @en Additional nodes add to the image preview area
   * @version 2.53.0
   */
  extra?: ReactNode;
  /**
   * @zh 是否可见，受控属性
   * @en Whether is visible
   */
  visible: boolean;
  /**
   * @zh 默认是否可见，非受控
   * @en Whether visible by default
   */
  //defaultVisible?: boolean;
  /**
   * @zh 触发 toolbar 切换为 simple 模式的宽度
   * @en The width that triggers the toolbar to switch to simple mode
   * @defaultValue 316
  breakPoint?: number;
   */
  /**
   * @zh 点击 mask 是否触发关闭
   * @en Whether click mask to close
   * @defaultValue true
   */
  maskClosable?: boolean;
  /**
   * @zh 是否显示关闭按钮
   * @en Whether display close button
   * @defaultValue true
   * @version 2.16.0
   */
  closable?: boolean;
  /**
   * @zh 额外操作，[ImageToolbarActionProps](#imagepreviewactionprops)
   * @en Extra operations, [ImageToolbarActionProps](#imagepreviewactionprops)
   */
  actions?: ImageToolbarActionProps[];
  /**
   * @zh 控制条的布局
   * @en The layout of the control bar
   * @defaultValue ['fullScreen', 'rotateRight', 'rotateLeft', 'zoomIn', 'zoomOut', 'originalSize', 'extra']
   */
  actionsLayout?: string[];
  /**
   * @zh 在预览缩放时会使用当前数组中的缩放百分比。若不包含 `100%`，则会自动添加在最相邻的位置。
   * @en The zoom percentage in the current array is used when previewing zooms. If `100%` is not included, the `100%` scale will be automatically added in the most adjacent position.
   * @defaultValue [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];
   * @version 2.30.0
   */
  scales?: number[];
  /**
   * @zh 切换可见状态触发的事件
   * @en Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean, preVisible: boolean) => void;
  /**
   * @zh 弹出层挂载的节点
   * @en Get popup's parent node
   * @defaultValue () => document.body
   * @version 2.16.0
   */
  getContainer?: () => HTMLElement;
  /**
   * @zh  按 `ESC` 键关闭预览
   * @en Whether to enable pressing `ESC` to close the preview.
   * @defaultValue true
   * @version 2.24.0
   */
  escToExit?: boolean;
}
const defaultScales = [
  25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500,
];

function getNextScale(cur: number, type: 'zoomIn' | 'zoomOut'): number {
  const index = defaultScales.indexOf(cur);
  if (index === -1) {
    return 100;
  }
  if (type === 'zoomIn') {
    return index === defaultScales.length - 1 ? cur : defaultScales[index + 1];
  }
  return index === 0 ? cur : defaultScales[index - 1];
}

function getFixTranslate(
  wrapperRect: DOMRect,
  imgRect: DOMRect,
  translateX: number,
  translateY: number,
  scale: number,
): [number, number] {
  let fixTranslateX = translateX;
  let fixTranslateY = translateY;
  if (translateX) {
    // No translateX if width of img is smaller than width of wrapper
    if (wrapperRect.width > imgRect.width) {
      fixTranslateX = 0;
    } else {
      // Width of image is greater than width of wrapper
      if (imgRect.left > wrapperRect.left) {
        // Reduce translateX to make image move to left if left side of image is within wrapper
        fixTranslateX -= Math.abs(wrapperRect.left - imgRect.left) / scale;
      }
      if (imgRect.right < wrapperRect.right) {
        // Enlarge translateX to make image move to right if right side of image is within wrapper
        fixTranslateX += Math.abs(wrapperRect.right - imgRect.right) / scale;
      }
    }
  }
  if (translateY) {
    // No translateY if height of img is smaller than height of wrapper
    if (wrapperRect.height > imgRect.height) {
      fixTranslateY = 0;
    } else {
      // Height of image is greater than height of wrapper
      if (imgRect.top > wrapperRect.top) {
        // Reduce translateY to make image move to top if top side of image is within wrapper
        fixTranslateY -= Math.abs(wrapperRect.top - imgRect.top) / scale;
      }
      if (imgRect.bottom < wrapperRect.bottom) {
        // Enlarge translateY to make image move to bottom if bottom side of image is within wrapper
        fixTranslateY += Math.abs(wrapperRect.bottom - imgRect.bottom) / scale;
      }
    }
  }
  return [fixTranslateX, fixTranslateY];
}

const useMountTransition = (isMounted: boolean, unmountDelay: number) => {
  // https://www.letsbuildui.dev/articles/how-to-animate-mounting-content-in-react/
  // https://blog.logrocket.com/how-build-faster-animation-transitions-react/
  const [hasEntered, setHasEntered] = useState(false);
  const [willExit, setWillExit] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isMounted && !hasEntered) {
      setHasEntered(true);
    } else if (!isMounted && hasEntered) {
      timeoutId = setTimeout(() => {
        setWillExit(false);
        setHasEntered(false);
      }, unmountDelay);
      setWillExit(true);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [unmountDelay, isMounted, hasEntered]);

  return [hasEntered, willExit];
};

export const ImageGuesture = forwardRef<ImageGestureHandle, ImageGestureProps>(
  function ImageGuestureView(props: ImageGestureProps, ref) {
    const {
      src,
      maskClosable = true,
      closable = true,
      actionsLayout = [
        'fullScreen',
        'rotateRight',
        'rotateLeft',
        'zoomIn',
        'zoomOut',
        'originalSize',
        'extra',
      ],
      getContainer = () => typeof document !== 'undefined' && document.body,
      escToExit = true,
      scales,
      visible,
      onVisibleChange,
      imgAttributes = {},
    } = props;
    const refImage = useRef<HTMLImageElement>(null);
    const refImageContainer = useRef<HTMLDivElement>(null);
    const refWrapper = useRef<HTMLDivElement>(null);
    const keyboardEventOn = useRef<boolean>(false);

    const refMoveData = useRef({
      pageX: 0,
      pageY: 0,
      originX: 0,
      originY: 0,
    });

    const { isLoading, isLoaded, setStatus } = useImageStatus('loading');
    //const [visible, setVisible] = useState(visibleProp);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(100);
    const [scaleValueVisible, setScaleValueVisible] = useState(false);
    const [rotate, setRotate] = useState(0);
    const [moving, setMoving] = useState(false);
    const [maskHasEntered, maskWillExit] = useMountTransition(visible, 400);
    const [scaleHasEntered, scaleWillExit] = useMountTransition(scaleValueVisible, 400);

    const {
      onLoad,
      onError,
      onMouseDown,
      style: imgStyle,
      className: imgClassName,
      ...restImgAttributes
    } = imgAttributes;

    // Reset image params
    function reset() {
      setTranslate({ x: 0, y: 0 });
      setScale(100);
      setRotate(0);
    }

    useImperativeHandle<ImageGestureHandle, ImageGestureHandle>(ref, () => ({
      reset,
    }));

    //const isFixed = useMemo(() => !isServerRendering && container === document.body, [container]);

    // Anticlockwise rotation
    function onRotateLeft() {
      setRotate(rotate === 0 ? 360 - ROTATE_STEP : rotate - ROTATE_STEP);
    }

    // Clockwise rotation
    function onRotateRight() {
      setRotate((rotate + ROTATE_STEP) % 360);
    }

    // Scale
    const hideScaleTimer = useRef(null);
    const showScaleValue = () => {
      !scaleValueVisible && setScaleValueVisible(true);
      hideScaleTimer.current && clearTimeout(hideScaleTimer.current);
      hideScaleTimer.current = setTimeout(() => {
        setScaleValueVisible(false);
      }, 1000);
    };
    const onScaleChange = (newScale) => {
      if (scale !== newScale) {
        setScale(newScale);
        showScaleValue();
      }
    };

    function onZoomIn() {
      const newScale = getNextScale(scale, 'zoomIn');
      onScaleChange(newScale);
    }

    function onZoomOut() {
      const newScale = getNextScale(scale, 'zoomOut');
      onScaleChange(newScale);
    }

    function onWheelZoom(e: WheelEvent<HTMLImageElement>) {
      if (e.deltaY > 0) {
        // 缩小
        if (scale >= defaultScales[0]) {
          // e.preventDefault();
          onZoomOut();
        }
      } else if (scale <= defaultScales[defaultScales.length - 1]) {
        // e.preventDefault();
        onZoomIn();
      }
    }

    function onResetScale() {
      onScaleChange(100);
    }

    function onFullScreen() {
      if (!refWrapper.current || !refImage.current) {
        return;
      }
      const wrapperRect = refWrapper.current.getBoundingClientRect();
      const imgRect = refImage.current.getBoundingClientRect();
      const newHeightScale = wrapperRect.height / (imgRect.height / scale);
      const newWidthScale = wrapperRect.width / (imgRect.width / scale);
      const newScale = Math.max(newHeightScale, newWidthScale);
      onScaleChange(newScale);
    }

    // Image container is clicked
    function onOutsideImgClick(e) {
      if (e.target === e.currentTarget && maskClosable) {
        close();
      }
    }

    // Close button is clicked.
    function onCloseClick() {
      close();
    }

    function close() {
      if (visible) {
        onVisibleChange && onVisibleChange(false, visible);
      }
    }

    // Check the translate and correct it if needed
    const checkAndFixTranslate = () => {
      if (!refWrapper.current || !refImage.current) return;
      const wrapperRect = refWrapper.current.getBoundingClientRect();
      const imgRect = refImage.current.getBoundingClientRect();
      const [x, y] = getFixTranslate(wrapperRect, imgRect, translate.x, translate.y, scale / 100);
      if (x !== translate.x || y !== translate.y) {
        setTranslate({
          x,
          y,
        });
      }
    };

    // Update position on moving if needed
    const onMoving = (e) => {
      if (visible && moving) {
        e.preventDefault && e.preventDefault();
        const { originX, originY, pageX, pageY } = refMoveData.current;
        const nextX = originX + ((e.pageX - pageX) * 100) / scale;
        const nextY = originY + ((e.pageY - pageY) * 100) / scale;
        setTranslate({
          x: nextX,
          y: nextY,
        });
      }
    };

    const onMoveEnd = (e) => {
      e.preventDefault && e.preventDefault();
      setMoving(false);
    };

    function onImgLoaded(e) {
      setStatus('loaded');
      onLoad && onLoad(e);
    }

    function onImgLoadError(e) {
      setStatus('error');
      onError && onError(e);
    }

    // Record position data on move start
    const onMoveStart = (e) => {
      e.preventDefault?.();
      setMoving(true);

      const ev = e.type === 'touchstart' ? e.touches[0] : e;
      refMoveData.current.pageX = ev.pageX;
      refMoveData.current.pageY = ev.pageY;
      refMoveData.current.originX = translate.x;
      refMoveData.current.originY = translate.y;
      onMouseDown?.(e);
    };

    useEffect(() => {
      if (visible && moving && document !== undefined) {
        document.addEventListener('mousemove', onMoving, false);
        document.addEventListener('mouseup', onMoveEnd, false);
      }
      return () => {
        if (document !== undefined) {
          document.removeEventListener('mousemove', onMoving, false);
          document.removeEventListener('mouseup', onMoveEnd, false);
        }
      };
    }, [visible, moving]);

    // Correct translate after moved
    useEffect(() => {
      if (!moving) {
        checkAndFixTranslate();
      }
    }, [moving, translate]);

    // Correct translate when scale changes
    useEffect(() => {
      checkAndFixTranslate();
    }, [scale]);

    // Reset when preview is opened
    useEffect(() => {
      if (visible) {
        reset();
      }
    }, [visible]);

    // Reset on first mount or image switches
    useEffect(() => {
      setStatus(src ? 'loading' : 'loaded');
      reset();
    }, [src]);

    useUpdate(() => {
      //previewScales.updateScale(scales);
      setScale(100);
    }, [scales]);

    // Close when pressing esc
    useEffect(() => {
      const onKeyDown = (e) => {
        if (e) {
          switch (e.key) {
            case Esc.key:
              if (escToExit) {
                close();
              }
              break;
            /*
          case ArrowRight.key:
            onNext();
            break;
          case ArrowLeft.key:
            onPrev();
            break;
*/
            case ArrowUp.key:
              onZoomIn();
              break;
            case ArrowDown.key:
              onZoomOut();
              break;
            default:
          }
        }
      };

      if (visible && !moving && !keyboardEventOn.current) {
        keyboardEventOn.current = true;
        if (document !== undefined) {
          document.addEventListener('keydown', onKeyDown);
        }
      }

      return () => {
        keyboardEventOn.current = false;
        if (document !== undefined) {
          document.removeEventListener('keydown', onKeyDown);
        }
      };
    }, [visible, escToExit, moving, scale]);

    const defaultActions = [
      {
        key: 'fullScreen',
        name: 'Fullscreen',
        content: <Fullscreen />,
        onClick: onFullScreen,
      },
      {
        key: 'rotateRight',
        name: 'Rotate clockwise', //locale.ImagePreview.rotateRight,
        content: <RotateCw />,
        onClick: onRotateRight,
      },
      {
        key: 'rotateLeft',
        name: 'Rotate anti clockwise', //locale.ImagePreview.rotateLeft,
        content: <RotateCcw />,
        onClick: onRotateLeft,
      },
      {
        key: 'zoomIn',
        name: 'Zoom In', //locale.ImagePreview.zoomIn,
        content: <ZoomIn />,
        onClick: onZoomIn,
        disabled: scale === defaultScales[defaultScales.length - 1],
      },
      {
        key: 'zoomOut',
        name: 'Zoom Out', //locale.ImagePreview.zoomOut,
        content: <ZoomOut />,
        onClick: onZoomOut,
        disabled: scale === defaultScales[0],
      },
      {
        key: 'originalSize',
        name: 'Original Size', //locale.ImagePreview.originalSize,
        content: <Repeat1 />,
        onClick: onResetScale,
      },
    ];

    return (
      <Portal open={visible} getContainer={getContainer}>
        {/* ConfigProvider need to inherit the outermost Context.
      https://github.com/arco-design/arco-design/issues/387 */}
        <div className="fixed w-full h-full top-0 left-0 z-inherit block">
          {/*
        style={{
          ...(style || {}),
          ...(isFixed ? {} : { zIndex: 'inherit', position: 'absolute' }),
        }}
*/}
          {/*<CSSTransition
          in={visible}
          timeout={400}
          appear
          classNames="fadeImage"
          mountOnEnter
          unmountOnExit={false}
          onEnter={(e) => {
            e.parentNode.style.display = 'block';
            e.style.display = 'block';
          }}
          onExited={(e) => {
            e.parentNode.style.display = '';
            e.style.display = 'none';
          }}
        >
        </CSSTransition>*/}
          <div
            className={`bg-slate-500/90 block absolute w-full h-full top-0 left-0 ${
              maskHasEntered && !maskWillExit ? 'fadeImage-enter-active' : ''
            } ${maskHasEntered && maskWillExit ? 'fadeImage-exit-active' : ''} ${
              !maskHasEntered && !maskWillExit ? 'fadeImage-exit' : ''
            }
`}
          />
          {visible && (
            <div
              ref={refWrapper}
              className="absolute w-full h-full top-0 left-0"
              onClick={onOutsideImgClick}
            >
              <div
                ref={refImageContainer}
                className="w-full h-full text-center flex justify-center items-center"
                style={{ transform: `scale(${scale / 100}, ${scale / 100})` }}
                onClick={onOutsideImgClick}
              >
                <img
                  onWheel={onWheelZoom}
                  ref={refImage}
                  alt=""
                  className={`max-w-full max-h-full inline-block align-middle select-none ${
                    moving ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  style={{
                    ...imgStyle,
                    transform: `translate(${translate.x}px, ${translate.y}px) rotate(${rotate}deg)`,
                  }}
                  {...restImgAttributes}
                  onLoad={onImgLoaded}
                  onError={onImgLoadError}
                  onMouseDown={(event) => {
                    // only trigger onMoveStart when press mouse left button
                    event.button === 0 && onMoveStart(event);
                  }}
                  key={src}
                  src={src}
                />
                {isLoading && (
                  <div className="bg-[#232324] font-xl p-5 w-12 h-12 rounded-md flex items-center justify-center">
                    <Loader />
                  </div>
                )}
              </div>
              {/*<CSSTransition
                in={scaleValueVisible}
                timeout={400}
                appear
                classNames="fadeImage"
                unmountOnExit
              >
              </CSSTransition>*/}
              <div
                className={`px-2 py-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  scaleHasEntered && !scaleWillExit ? 'fadeImage-enter-active' : ''
                } ${scaleHasEntered && scaleWillExit ? 'fadeImage-exit-active' : ''} ${
                  !scaleHasEntered && !scaleWillExit ? 'fadeImage-exit' : ''
                }
`}
              >
                {scale}%
              </div>
              {isLoaded && (
                <ImageToolbar actionsLayout={actionsLayout} defaultActions={defaultActions} />
              )}
              {closable && (
                <div
                  className="w-8 h-8 items-center justify-center flex bg-black/30 text-white text-center rounded-full absolute cursor-pointer top-9 right-9 transition-all duration-300"
                  onClick={onCloseClick}
                >
                  <X size={18} />
                </div>
              )}
            </div>
          )}
        </div>
      </Portal>
    );
  },
);

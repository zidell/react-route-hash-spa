# react-route-hash-spa

Simple route with hash system for SPA
dependencies : mobx, typescript, styled-components

## Usage

In your store,
```js
import { RouteCtrl } from './sub_modules/react-route-hash-spa/src/route';
...
@observable
public route: RouteCtrl = new RouteCtrl({
	resetOnStartUp: false,
});
  
```

## App.tsx
```js
import Route from './sub_modules/react-route-hash-spa/src/route';
/**
 * import for route
 */
import BbsThread from './bbs-thread';
import BbsList from './bbs-list';
const routeComponents = {
	'bbs-list': BbsList,
	'bbs-thread': BbsThread,
};
...
class App extends React.Component {
  ...
  render() {
    return (
      <div>
        ...
        {route.segments.map(({ component, params }, index) => <Route key={index} comp={routeComponents[component]} params={params} />)}
      </div>
    );
  }
}
```

## Methods

- `window.route.move(segment)` : 일반적 이동, 동일한 컴포넌트 레벨이면 대체, * /로 시작하면 기존 히스토리 제거하고 루트를 기준으로 동작
- `window.route.moveWithHistory(segment)` : `move`와 동일하지만 히스토리 로그 남김, back 버튼시 이전 게시물
- `window.route.push(segment)` : 강제로 하위 뷰 생성
- `window.route.replace(segment)` : 강제로 현재 뷰 대체
- `window.route.pop(segment)` : 뒤로가기, back 버튼과 동일
- `window.parent(num)` : 자연수면 num 단계로 상위 이동, -num이면 현재 기준 상위로 num 단계까지 이동

segment는 dash-case로 작성되는 것을 기준으로 하였으며, 파라미터는 `.`으로 구분하면 됨. `thread.182.ho`은 `<Thread params=[182, 'ho]/>`와 동일

## Styling

`.route-view` 혹은 `.route-modal` 오버라이딩하면 됨

## License

MIT


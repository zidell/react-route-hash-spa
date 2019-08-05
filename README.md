
# react-route-hash-spa

모바일에서의 뒤로가기와 완벽히 연동되는, 해시기반의 라우팅 방식. 앱과 같이 계층적 뷰 구조를 만들 수 있다. 동적인 뷰 생성으로 반복 사용이 용이하다.

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

// comoponents foro route
const routeComponents = {
	preview: Preview,
	template: Template,
};

...
class App extends React.Component {
  ...
  render() {
    const { route: {segments} } = this.injected;
    return (
      <div>
        ...
        <Routes components={routeComponents} segments={segments} />
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

segment는 dash-case로 작성되는 것을 기준으로 하였으며, 파라미터는 `.`으로 구분하면 됨. `thread.182.ho`은 `<Thread params=[182, 'ho']/>`와 동일

## Styling

`.route-view` 혹은 `.route-modal` 오버라이딩하면 됨

## License

MIT


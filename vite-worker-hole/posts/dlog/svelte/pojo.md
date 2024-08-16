# 스벨트 개발 일지 1, POJO

저는 마크다운을 좋아하는데, 거기서도 좋아하는 문법은 [mermaidjs](https://mermaid.js.org/) 입니다.

그런데 머메이드는 설계 자체가 브라우저에서 동작하도록 디자인되어서 내 블로그에서 중요하게 생각하는 "No Javascript" 환경에서 동작할 방법을 찾지 못해 잠시 포기했었습니다.

어떻게 해야 미리 파싱해서 보낼 수 있을까 고민하던 중 [remark-mermaidjs](https://github.com/remcohaszing/remark-mermaidjs) 플러그인을 발견하여 적용해보았습니다.

> [!note]
> 이 플러그인은 노드환경에서는 "playwright"를 사용하여 브라우저 환경을 시뮬레이션하여 머메이드를 렌더링한다.

## 문제

![하이드레이션 과정에서 머메이드 결과가 사라짐](/static/resources/record-2024-08-11-201239.gif)

그러나 곧바로 문제가 닥쳤는데, 앞서 말했드시 머메이드는 브라우저에서 동작하는 도구이기 때문에 하이드레이션 단계에서 서버의 렌더링 결과와 브라우저의 렌더링 결과가 달라서 사라지는 문제가 발생했습니다.

## 해결

`+page.js`의 코드는 서버와 클라이언트에서 각 각 한번씩 실행되면서 하이드레이션 과정이 발생하기 때문에 마크다운 파싱 코드를 `+page.server.js`로 옮겨 하이드레이션 과정을 생략하도록 결정하였습니다.

**POJO 에러 발생 코드:**

```js
import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	return {
		post: Post.getPosts(url.pathname), // POJO error, 클래스 인스턴스 리턴
		category: Category.getCategory(url.pathname) // POJO error, 클래스 인스턴스 리턴
	};
}
```

**에러:**

```sh
... Cannot stringify arbitrary non-POJOs ...
```

POJO를 리턴하지 않아 렌더링 오류가 발생하였습니다. 그래서 각 클래스의 메서드에 직렬화 함수를 추가하여 POJO 객체를 리턴하도록 변경하였습니다.

**POJO를 리턴하는 코드:**

```diff
import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  return {
--   post: Post.getPosts(url.pathname), // POJO error, 클래스 인스턴스 리턴
++   post: Post.getPosts(url.pathname).toSerialize(), // POJO return
--   category: Category.getCategory(url.pathname)  // POJO error, 클래스 인스턴스 리턴
++   category: Category.getCategory(url.pathname).toSerialize() // POJO return
  };
}
```

## 다른 해결

- JSON.stringify()
- serialize-javascript
- structuredClone()

등을 사용하여 해결하는 방법도 있지만 제 경우에는 다른 도구로 직렬화가 불가능했기 때문에 직접 함수를 만들어 진행하였습니다.

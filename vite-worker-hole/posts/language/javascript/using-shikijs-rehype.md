# Shiki와 함께하는 Markdown 코드 하이라이팅

## 설치 및 기본 사용법

Shiki는 다양한 테마와 언어에 대해 코드 하이라이팅을 제공하는 도구입니다. 특히, Markdown 파일을 HTML로 변환할 때 코드 블록에 대한 하이라이팅을 쉽게 적용할 수 있습니다. 이번 글에서는 Shiki를 사용하여 코드 하이라이팅을 적용하는 방법을 설명하겠습니다.

### 설치

먼저, 프로젝트에 Shiki와 관련된 패키지를 설치합니다. 아래 명령어를 사용하여 `@shikijs/rehype`를 설치할 수 있습니다.

```bash
npm i -D @shikijs/rehype
```

### 사용법

Shiki를 사용하려면 `unified`와 함께 `remark`와 `rehype` 시리즈의 플러그인을 사용하여 Markdown 파일을 처리하고, HTML로 변환합니다. 다음은 기본적인 사용 예제입니다.

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';

const file = await unified()
	.use(remarkParse) // Markdown을 파싱
	.use(remarkRehype) // HTML로 변환
	.use(rehypeShiki, {
		// 단일 테마
		// theme: 'vitesse-light' // 단일 테마 사용

		// 다중 테마
		themes: {
			light: 'vitesse-light', // 라이트 테마
			dark: 'vitesse-dark' // 다크 테마
		}
	})
	.use(rehypeStringify) // HTML 문자열로 변환
	.process(await fs.readFile('./input.md')); // Markdown 파일을 읽고 처리
```

이 코드는 `input.md`라는 파일을 읽어와서, 해당 파일의 코드 블록에 Shiki를 사용해 라이트/다크 테마를 적용한 후, HTML로 변환합니다.

### Shiki 인스턴스 관리

기본적으로 `@shikijs/rehype`의 기본 내보내기(default export)는 `getSingletonHighlighter`에서 공유되는 Shiki 인스턴스를 사용합니다. 이는 여러 프로세스에서 인스턴스가 지속됩니다. 그러나 Shiki 하이라이터의 수명 주기를 완전히 제어하고 싶다면, `@shikijs/rehype/core`의 세분화된 번들(Fine-grained Bundle)을 사용할 수 있습니다.

## 세분화된 번들 사용법

Shiki의 전체 번들 대신, 필요한 부분만 불러와 사용하고 싶다면 `rehypeShikiFromHighlighter`를 사용할 수 있습니다. 다음은 세분화된 번들을 사용하는 예제입니다.

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';

import { createHighlighterCore } from 'shiki/core';

const highlighter = await createHighlighterCore({
	themes: [
		import('shiki/themes/vitesse-light.mjs') // 라이트 테마
	],
	langs: [
		import('shiki/langs/javascript.mjs') // JavaScript 언어 하이라이팅
	],
	loadWasm: import('shiki/wasm') // WASM 파일 로드
});

const raw = await fs.readFile('./input.md');
const file = await unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeShikiFromHighlighter, highlighter, {
		themes: {
			light: 'vitesse-light',
			dark: 'vitesse-dark'
		}
	})
	.use(rehypeStringify)
	.processSync(raw); // 동기적으로 처리 가능
```

이 예제에서는 필요한 테마와 언어만 선택적으로 불러와서 사용할 수 있습니다. 이는 번들 크기를 줄이고, 더 나은 성능을 제공할 수 있습니다.

## 결론

Shiki는 Markdown 파일의 코드 블록을 하이라이팅하는 강력한 도구입니다. 다양한 테마와 언어를 지원하며, 서버에서 렌더링하기 때문에 클라이언트 성능에 부담을 주지 않습니다. 위에서 설명한 방법을 통해 Shiki를 설정하고, 프로젝트에 적합한 테마를 적용해 보세요. 필요에 따라 세분화된 번들을 사용하거나, 줄 하이라이팅과 같은 추가 기능을 활용할 수도 있습니다.

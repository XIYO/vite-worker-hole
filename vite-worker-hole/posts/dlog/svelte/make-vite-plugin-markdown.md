# 마크다운 파서 플러그인 만들기

이 블로그를 만들면서 마크다운 파서가 필요했습니다

초기에는 `marked`를 사용했지만, 바퀴를 재발명하는 일이 없도록,
생태계가 조금 더 넓은 `unified`를 사용하기로 했습니다.

## 마크다운 파일 로드하기

마크다운 파싱을 하기 위해 가장 난해 했던 것중 하나가,
vite 는 "_.jpg", "_.css"를 임포트할 수 있는데 "\*.md"를 임포트 할 수 없는데 있었습니다.

동작원리를 몰랐기 때문에 초기에는 `raw` 코드를 불러와서 파싱을 했습니다.

```js
import myPost from './my-post.md?raw';

const html = unified().use(somePlugin).process(myPost);

// or

const markdowns = import.meta.glob('./posts/*.md', {
	query: '?raw',
	eager: true,
	import: 'default'
});

htmls = [];
Object.entries(markdowns).forEach(([path, md]) => {
	const html = unified().use(somePlugin).process(md);

	htmls.push(html);
});
```

이러한 방식으로 하다보니 코드가 지저분해졌고 캡슐화가 필요해졌습니다.

## 플러그인 만들기

그래서 "\*.md"를 vite에서 파싱해주는 도구가 없을까 검색해보니 `vite-plugin-md`가 있었습니다.
그런데 세 시간을 에러와 싸운끝에 알아낸 결과는 이 플러그인은 "vue" 전용 이었습니다. 😂
조금 어이가 없어서 난감했습니다... (낚시인가...?)

그래거 직접 만들기로 했습니다. 이미 코드는 작성되어 있었고, 플러그인 형식에 맞게 변환만 해주면 되었습니다.

`my-vite-plugin-markdown.js` 플러그인

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkMermaid from 'remark-mermaidjs';
import rehypeShiki from '@shikijs/rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import callouts from 'remark-callouts';
import { execSync } from 'child_process';
import { visit } from 'unist-util-visit';

export default function () {
	return {
		name: 'my-vite-plugin-markdown',
		enforce: 'pre',

		async transform(code, id) {
			if (id.endsWith('.md')) {
				// .md 파일인 경우에만 처리
				// Git 로그 정보를 추출하여 프론트매터에 추가
				const gitHistory = getGitHistory(id);

				let frontmatter = {};
				// 마크다운을 HTML로 변환합니다. title 은 여기서 추출합니다.
				let processor = unified()
					.use(remarkParse)
					.use(remarkFrontmatter)
					.use(remarkParseFrontmatter)
					.use(remarkGfm)
					.use(callouts)
					.use(remarkMermaid, {
						mermaidConfig: {
							theme: 'dark'
						}
					})
					.use(remarkRehype)
					.use(rehypeShiki, {
						theme: 'vitesse-dark'
					})
					.use(() => {
						return (tree) => {
							visit(tree, 'element', (node, index, parent) => {
								if (node.tagName === 'h1' && node.children && node.children.length > 0) {
									frontmatter.title = node.children[0].value || '';
									parent.children.splice(index, 1, ...node.children);
								}

								// 이미지 태그의 src 속성에서 /static을 제거
								if (node.tagName === 'img' && node.properties && node.properties.src) {
									node.properties.src = node.properties.src.replace(/^\/static/, '');
								}
							});
						};
					})
					.use(rehypeStringify);

				const result = await processor.process(code);

				// 기존 프론트매터에 Git 정보를 추가
				frontmatter = {
					...frontmatter,
					...result.data.frontmatter,
					firstCommitDate: gitHistory[gitHistory.length - 1].date, // 가장 오래된 커밋
					lastCommitDate: gitHistory[0].date // 가장 최근 커밋
				};

				const markdown = {
					frontmatter,
					content: result.value
				};

				return {
					code: `export default ${JSON.stringify(markdown)};`,
					map: null
				};
			}
		}
	};
}

// Git 로그 정보를 추출하는 함수
function getGitHistory(filePath) {
	try {
		const output = execSync(
			`git log --follow --pretty=format:"%ad, %s" --date=format:"%Y-%m-%dT%H:%M%z" "${filePath}"`
		)
			.toString()
			.trim();

		return output.split('\n').map((line) => {
			const [date, subject] = line.split(', ');
			return { date, subject };
		});
	} catch (error) {
		console.error(`Error fetching git history for ${filePath}:`, error);
		return { firstCommitDate: null, lastCommitDate: null, history: [] };
	}
}
```

`vite.config.js` 에서 플러그인 적용

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import markdown from './src/lib/plugin/my-vite-plugin-markdown.js';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), markdown()]
});
```

`+page.server.js`에서 사용

```js
import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const post = Post.getPosts(url.pathname)?.toSerialize();
	const category = Category.getCategory(url.pathname)?.toSerialize();

	return {
		title: post?.frontmatter.title || category?.name || undefined,
		post: post,
		category: category
	};
}
```

(약간의 정리가 필요한 코드지만) 재밌는 기능 중 하나는 마크다운의 작성 시간을 깃 히스토리에서 추출하여 프론트매터로 만들어주는 기능입니다.

최초 블로그를 지킬로 시작했는데, 마크다운에 프론트 매터를 끼워 넣는다는게 약간 문서를 더럽히는 기분이라 이 방법을 선택했습니다.

또, 블로그의 기준중 하나인 no-js 환경에서도 잘 구동되도록 하기 위해 `mermiad` 문법도 서버에서 미리 파싱하여 제공함으로 좀 더 다양한 환경에서 사용할 수 있게 했습니다.

## 마치며

이제 `asciinema` 파서를 만들어서 적용할 예정입니다.

# 깃허브 액션 캐시 사용하기

GitHub Actions를 사용하면서, 빌드 속도가 점차 느려지는 것을 경험하였습니다. 이를 개선하기 위해 디펜던시 설치 시간을 절약할 수 있는 캐시 활용 방안을 도입했습니다.

## 빌드 속도 변화

![초기의 빌드 속도는 40초 미만](/static/resources/usging-cache-on-github-action-20240815232353052.png)

초기의 빌드 속도는 40초 미만으로 매우 빠른 편이었습니다. 그러나 시간이 지남에 따라 빌드 시간이 점점 길어졌고, 특히 Markdown 파일에 Mermaid 파서를 추가한 후로는 빌드 시간이 급격하게 증가하였습니다.

![느려진 빌드 속도는 1분을 넘어 1분 30까지 가려는 듯](/static/resources/usging-cache-on-github-action-20240815232537900.png)

이는 단순히 Mermaid 문법의 문제만은 아닙니다. 저의 블로그는 Svelte를 이용하여 프리렌더를 수행하기 때문에, 초기 빌드 시 모든 Markdown 파일을 파싱해야 하는 시간이 필요했습니다.

게다가, Markdown 파일에 프론트매터(front matter)를 사용하지 않고 GitHub에서도 정상적으로 표시되기를 원했기 때문에, 작성일이나 수정일 등의 메타데이터를 포함시키지 않은 상태였습니다. 이러한 부분을 보완하기 위해 `git log` 명령어를 사용하여 해당 데이터를 추가하는 작업을 하다 보니, CPU 부하가 큰 작업이 많아져 성능 향상도 어려웠습니다. (워커로 분리하면 성능이 개선될 수 있지만, 아직 제 실력으로는 쉽지 않네요...)

![단순히 디펜던시 설치만 하는데도 30초를 사용](/static/resources/usging-cache-on-github-action-20240815233139668.png)

결국 빌드 최적화를 위해, 먼저 패키지 설치 시간을 줄이는 것에 초점을 맞추기로 했습니다.

## ## GitHub Workflow 수정

`초기 Workflow` 중 일부
```yml
jobs:  
  build_site:  
    runs-on: ubuntu-latest  
    steps:  
      - name: Checkout  
        uses: actions/checkout@v4  
        with:  
          fetch-depth: 0  
  
      - name: Install pnpm  
        uses: pnpm/action-setup@v3  
        with:  
          version: 8  
  
      - name: Install dependencies  
        run: pnpm install  
  
      - name: Install Playwright browsers  
        run: pnpm exec playwright install --with-deps chromium  
  
      - name: build  
        env:  
          BASE_PATH: '/${{ github.event.repository.name }}'  
        run: |  
          pnpm run build  
      - name: Upload Artifacts  
        uses: actions/upload-pages-artifact@v3  
        with:  
          # this should match the `pages` option in your adapter-static options  
          path: 'build/'  
```

초기 Workflow는 캐시를 전혀 활용하지 않았습니다. GitHub Actions와 Svelte를 처음 사용했던 시기여서, 일단 자동 빌드만 정상적으로 이루어지면 만족했기 때문입니다.

`최적화된 Workflow` 중 일부

```diff
jobs:  
  build_site:  
    runs-on: ubuntu-latest  
    steps:  
      - name: Checkout  
        uses: actions/checkout@v4  
        with:  
          fetch-depth: 0  

	  - name: Install pnpm  
-       uses: pnpm/action-setup@v3  
+       uses: pnpm/action-setup@v4  
        with:  
-         version: 8
+         run_install: false  
  
+     - name: Install Node.js  
+       uses: actions/setup-node@v4  
+       with:  
+         node-version: 22  
+         cache: 'pnpm'  # 노드 모듈에 대한 캐시 활성화(내장 기능 사용)

      - name: Install dependencies
        run: pnpm install # 캐시 되어 설치속도가 빨라짐
  
+     - name: Get installed Playwright version  
+       id: playwright-version  
+       run: echo "PLAYWRIGHT_VERSION=$(pnpm list @playwright/test --depth=0 | grep @playwright/test | awk '{print $2}')" >> $GITHUB_ENV
  
+     - name: Cache playwright binaries  
+       uses: actions/cache@v4.0.2
+       id: playwright-cache  
+       with:  
+         path: ~/.cache/ms-playwright          
+         key: ${{ runner.os }}-playwright-${{ env.PLAYWRIGHT_VERSION }}  
  
+     - run: pnpx playwright install --with-deps chromium  
+       if: steps.playwright-cache.outputs.cache-hit != 'true'  

      - name: build  
        env:  
          BASE_PATH: '/${{ github.event.repository.name }}'  
        run: |  
          pnpm run build  
      - name: Upload Artifacts  
        uses: actions/upload-pages-artifact@v3  
        with:  
          # this should match the `pages` option in your adapter-static options  
          path: 'build/'
```

이 최적화된 코드의 핵심은 캐시의 효과적인 사용입니다.

Node.js 모듈 캐시는 `actions/setup-node@v4`에서 제공하는 `cache: pnpm` 옵션을 설정하여 활성화했습니다. 직접 캐시를 저장하는 방법도 있지만, 기본적으로 제공되는 추상화된 옵션을 활용하는 것이 더 효율적이라고 판단했습니다.

특히 빌드 속도 저하의 주요 원인이었던 `playwright`를 별도로 캐싱하여, 설치 시간을 최소화하였습니다. 캐시가 이미 존재하는 경우, 설치 단계를 생략하여 빌드 시간을 더 최적화할 수 있었습니다.

> [!note]
> 위 코드의 `playwright` 버전 추출 기능은 pnpm 패키지를 위한 것입니다. 다른 패키지 매니저를 사용한다면 다른 코드를 알아보세요....🥲
## 빌드 속도 변화

![최적화된 빌드 속도는 1분 10초쯤...](/static/resources/usging-cache-on-github-action-20240816000140052.png)

![내부적인 속도는 50초를 넘지 않음](/static/resources/usging-cache-on-github-action-20240816000251502.png)

빌드 속도가 크게 향상되지는 않았지만, 적절한 최적화를 통해 어느 정도 만족할 수 있는 결과를 얻었습니다.

### 추가적인 최적화 방안

몇 가지 더 고려해볼 수 있는 최적화 방법은 다음과 같습니다:

- 병렬 실행
- 커스텀 러너를 사용하여 커스텀 컨테이너 사용
- 모든 과정을 하나의 워크플로우에 통합하기

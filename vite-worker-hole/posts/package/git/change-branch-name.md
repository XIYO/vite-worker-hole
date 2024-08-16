# 브랜치 이름 바꾸기

로컬에서 프로젝트를 깃으로 관리하기 위해 깃으로 초기화를 했더니 `master` 브랜치가 생성되었습니다.
깃허브가 밀고있는 "메인"을 브랜치 이름으로 자주 사용하기 때문에 브랜치 이름을 바꾸는 방법을 알아보겠습니다.

## `git` 명령어로 브랜치 이름 변경

"마스터"로 생성된 브랜치 이름을 "메인"으로 변경합니다.

### 로컬 저장소

1. 깃을 초기화 합니다.

   ```bash
   git init
   ```

2. 브랜치 이름을 변경합니다.
   ```bash
   git branch -m master main
   ```

### 원격 저장소

1. 원격 저장소를 복제합니다.
   ```bash
   git clone repository-url
   ```
2. 원격 저장소로 이동합니다.
   ```bash
   cd repository
   ```
3. 브랜치 이름을 변경합니다.
   ```bash
   git branch -m master main
   ```
4. 변경 사항을 원격 저장소에 푸시합니다.
   ```bash
   git push -u origin main
   ```
5. 원격 저장소의 이전 브랜치를 삭제합니다.
   ```bash
   git push origin --delete master
   ```

## 원격 저장소에서 직접 브랜치 이름 변경

깃허브는 웹에서 브랜치 이름을 변경하면 위 과정을 거치지 않아도 됩니다.

![img.png](img.png)

1. https://github.com/소유자-이름/브랜치-이름/branches 페이지로 이동합니다.
2. 햄버거 메뉴를 클릭하고 `Rename branch`를 클릭합니다.

## 초기 생성 브랜치 이름 변경

깃 초기화시 생성되는 브랜치 이름을 "메인"으로 변경합니다.

```shell
git config --global init.defaultBranch main
```

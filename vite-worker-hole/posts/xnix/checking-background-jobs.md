# CHECKING BACKGROUND JOBS

`UNIX`와 `UNIX LIKE`에서 `Job control` 일부인 `jobs` 명령어를 설명합니다.

`jobs`는 현재 `shell`의 `background`에서 실행중인 `job`을 확인하는 명령어입니다.

`Windows`와 비교하면,  
`jobs`는 `taskbar`(작업 표시줄)과 비슷한,  
현재 세션에서 실행중이만 `foreground`에서는 볼 수 없는,  
최소화되어 `background`에서 실행중인 프로그램을 확인하는 행위와 같습니다.

> 🔵 NOTE
>
> UNIX에서 `Job`은 `Process`의 집합을 의미합니다.
> Job의 PID는 `Process Group ID`를 의미합니다.

> 🔵 NOTE
>
> MacOS, Sonoma에서 `zsh`를 사용하여 테스트하였습니다.  
> zsh는 확장 기능이 있으며, `man zshbuiltins`에서 자세한 정보를 확인할 수 있습니다.

> 🔵 NOTE
>
> 이 문서는 `UNIX` 공식 그룹인 [`THE Open GROUP`](https://www.opengroup.org)에서 제공하는 `The Open Group Base Specifications Issue 7`의 [`jobs`](https://pubs.opengroup.org/onlinepubs/9699919799.2016edition/utilities/jobs.html) 설명을 번역했으며, 사용자가 알아야 할 부분만 간략하게 설명합니다.

## SYNOPSIS

- `[ ]` (대괄호)는 생략 할 수 있습니다.
- `|` (파이프)는 여러 옵션 중 하나를 선택할 수 있습니다.
- `...` (마침표 세 개)는 여러 인수를 지정할 수 있습니다.

```text
jobs [-l| -p][job_id...]
```

## OPTIONS

- `-l`  
  (영어 소문자 **L**) 나열된 각 작업에 대한 더 많은 정보를 제공합니다. 이 정보에는 작업 번호, 현재 작업, 프로세스 그룹 ID, 상태, 및 작업을 형성한 명령이 포함됩니다.

- `-p`  
  선택한 작업의 프로세스 그룹 리더에 대한 프로세스 ID만 표시합니다.

## OPERANDS

- `job_id`  
   상태를 표시할 작업을 지정합니다. `job_id`가 지정되지 않으면 모든 작업에 대한 상태 정보가 표시됩니다. `job_id`의 형식은 XBD [`Job Control Job ID`](https://pubs.opengroup.org/onlinepubs/9699919799.2016edition/basedefs/V1_chap03.html#tag_03_204)에 설명되어 있습니다.

## STDOUT

**`-p` 옵션**이 지정된 경우,  
출력은 각 프로세스 ID에 대해 한 줄로 구성됩니다.

```text
"%d\n", <process ID>
```

**`-l` 옵션**이 지정되지 않은 경우,  
출력은 다음 형식의 일련의 줄로 구성됩니다.

```text
"[%d] %c %s %s\n", <job-number>, <current>, <state>, <command>
```

여기서 필드는 다음과 같습니다:

- `<job-number>`

  - `wait`, `fg`, `bg`, 및 `kill` 유틸리티에 프로세스 그룹을 식별하는 데 사용할 수 있는 번호입니다.
  - 이러한 유틸리티를 사용하여 작업 번호 앞에 `%`를 붙여 작업을 식별할 수 있습니다.

- `<current>`

  - 문자 `+`는 `fg` 또는 `bg` 유틸리티에 대한 기본값으로 사용될 작업을 식별합니다.  
    이 작업은 `job_id %+` 또는 `"%%"`를 사용하여 지정할 수도 있습니다.
  - 문자 `-`는 현재 기본 작업이 종료되면 기본이 될 작업을 식별합니다.  
    이 작업은 `job_id %-`를 사용하여 지정할 수도 있습니다.
  - 다른 작업의 경우, 이 필드는 `space`(공백) 입니다.
  - 최대 하나의 작업만 `+`로, 최대 하나의 작업만 `-`로 식별할 수 있습니다.
  - 어떤 작업이 중단된 경우, 현재 작업은 중단된 작업이어야 합니다.
  - 최소 두 개의 작업이 중단된 경우, 이전 작업도 중단된 작업이어야 합니다.

- `<state>`  
  다음 문자열 중 하나입니다 (`POSIX locale`에서):

  - `Running`  
    작업이 신호에 의해 중단되지 않았으며 종료되지 않았음을 나타냅니다.
  - `Done`  
    작업이 완료되었으며 종료 상태가 `0`을 반환했음을 나타냅니다.
  - `Done(code)`  
    작업이 정상적으로 완료되었으며 지정된 `0`이 아닌 종료 상태, `code`,로 종료되었음을 나타냅니다.
  - `Stopped`  
    작업이 `SIGTSTP` 신호에 의해 중단되었음을 나타냅니다.
  - `Stopped (SIGTSTP)`  
    작업이 `SIGTSTP` 신호에 의해 중단되었음을 나타냅니다.
  - `Stopped (SIGSTOP)`  
    작업이 `SIGSTOP` 신호에 의해 중단되었음을 나타냅니다.
  - `Stopped (SIGTTIN)`  
    작업이 `SIGTTIN` 신호에 의해 중단되었음을 나타냅니다.
  - `Stopped (SIGTTOU)`  
    작업이 `SIGTTOU` 신호에 의해 중단되었음을 나타냅니다.

- `<command>`
  - 쉘에 제공된 관련 명령입니다.

**`-l` 옵션**이 지정된 경우,  
프로세스 그룹 ID를 포함하는 필드가 `<state>` 필드 앞에 삽입됩니다.  
또한 프로세스 그룹 내의 더 많은 프로세스가 별도의 줄에 출력될 수 있으며, 프로세스 ID와 `<command>` 필드만 사용합니다.

## EXAMPLE

먼저 단순한 `job`을 생성하는 명령어를 `shell`에서 입력합니다.

```shell
sleep 100 &
```

10분 동안 대기 하고 소멸하는 명령어인 `sleep`을,  
&(앰퍼샌드)를 이용하여 `background`에서 실행하는 명령어입니다.

> 🔵 NOTE
>
> `&`(앰퍼샌드)는 현재 세션에서 백그라운드로 프로세스를 실행하는 명령어 입니다.

**no option**으로 `jobs` 명령어를 실행한 결과는 다음과 같습니다.

명령어 입력

```shell
jobs
```

출력

```text
[1] + 12345 Running sleep $((60 * 10)) &
```

`zsh`를 이용해 `jobs` 명령어를 실행한 결과는 다음과 같습니다.  
`zsh`는 `job`이 종료되면 `Done`이 출력 됩니다.

[![asciicast](https://asciinema.xiyo.dev/a/22.svg)](https://asciinema.xiyo.dev/a/22)

> 🟣 IMPORTANT
>
> `zsh 5.9 (x86_64-apple-darwin23.0)`은 `jobs -p`를 사용하면 프로세스 번호만 출력해야하는데 버그가 있어 `-l` 옵션과 동일한 기능을 합니다.
> `bash`는 `jobs -p`가 프로세스 번호만 정상 출력 합니다.

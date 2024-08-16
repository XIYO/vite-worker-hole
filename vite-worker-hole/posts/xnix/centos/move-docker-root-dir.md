# 도커 루트 디렉토리 이전

사내 클라우드 서버에 깃랩을 올려서 사용중이이었습니다. \
그런데 바로 전까지 잘되던 빌드가 재빌드 하니 실패하고 있었습니다.

조사해보니 원인은 로컬 디스크 공간 부족...

```text
# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        7.8G     0  7.8G   0% /dev
tmpfs           7.8G     0  7.8G   0% /dev/shm
tmpfs           7.8G  817M  7.0G  11% /run
tmpfs           7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/sda7        98G   97G  1.8G  100% /
/dev/sda1       494M  136M  358M  28% /boot
/dev/sda2       400G   51G  350G  13% /dat
/dev/sda3       300G  136G  165G  46% /log
/dev/sda5       100G  2.9G   98G   3% /sw
tmpfs           1.6G     0  1.6G   0% /run/user/1000
tmpfs           1.6G     0  1.6G   0% /run/user/0
```

`/dev/sda7`의 용량이 부족한 것을 확인할 수 있습니다.

> 인수 받을 때는 2TB 레이드라고 문서쓰여 있던데... \
> 내가 레이드 개념을 잘못 알고 있는건가...

## 도커 설정 변경

루트 디렉토리를 이동하기 위해서는 도커의 설정을 변경해야합니다.

공식 도커 레포지토리에서 설치한 경우, `/etc/docker/daemon.json` 파일을 생성 및 수정 합니다.

```text
# /etc/docker/daemon.json
{
  "data-root": "/dat/docker"
}
```

> 저는 **생성**하였습니다.

이후 도커를 재시작 하면 루트 디렉토리가 변경됩니다.

```shell
sudo systemctl restart docker
```

## 도커 볼륨이 있을 경우

기존에 생성한 볼륨이 있다면, 해당 볼륨을 이전한 디렉토리로 이동해야합니다.

모든 정보를 복제하기위해 `rsync` 명령어를 사용합니다.

```shell
rsync -av /var/lib/docker /dat/docker
```

## 볼륨의 용량이 클 경우

제 경우에는 볼륨이 45GB 정도에 밤에 작업했기 때문에 백그라운드로 복제를 진행했습니다. \
그리고 로그도 볼 계획이었기 때문에 터미널 멀티플렉서를 사용하여 백그라운드로 작업을 진행했습니다.

```shell
tmux
```

```shell
rsync -av /var/lib/docker /dat/docker
```

`Ctrl + b` 를 누른 후 `d` 를 누르면 백그라운드로 작업이 진행됩니다.

```shell
# 터미널을 닫지 않았다면 마지막 세션 열기
tmux attach-session

# 터미널을 닫은 뒤 다시 확인 한다면
tmux ls # 세션 목록 확인
tmux attach -t 0 # 세션 번호로 접속
```

## TODO

- [ ] 도커 볼륨 정기적으로 백업하기

# INSTALL TRANSMISSION ON ASUSWRT

트랜스미션을 설치하고 원격으로 토렌트를 관리하는 방법을 알아봅니다.

트랜스미션은 여러 토렌트 대몬 중에서 웹 *UI*가 내장된, 간단한 토렌트 대몬입니다. 대체로 *NAS*에서 사용되는 편이지만, 에이수스 라우터에서도 사용할 수 있습니다.

## ENVIRONMENT

설치 환경입니다.

| 분류     |       상세 정보       |
| :------- | :-------------------: |
| Hardware |         AC88U         |
| Firmware | ASUSWRT-MERLIN 386.12 |
| Package  | Entware armv7sf-k2.6  |

## REQUIREMENTS

필수 요구 사항은 다음과 같습니다.

- _ASUSWRT-MERLIN_ 설치
- _SSH_ 접근 허용
- _Entware_ 설치
- 충분한 용량의 _USB_ 스토리지 \
   이 문서에서는 두 개의 스토리지를 사용합니다.
- 추가 쿨러 \
   기본 방열 기능만으로는 열기가 배출이 안 됩니다.

<!--
## OPTIONALS

선택사항으로, 편리하게 *VS Code*에서 파일을 편집하기 위해서 설치합니다.

- 클라이언트
    - *VS Code* 설치 \
        *SSH FS*를 사용하기 위해서 설치합니다.
        - *SSH FS* 설치 \
            *VS Code*의 확장으로 *VS Code*에서 라우터의 파일 편집 및 관리를 위해서 설치합니다.
- 라우터
    - *SFTP* 설치 \
        *VS Code*에서 *SSH FS*를 사용하기 위해서 설치합니다. -->

## INSTALLATION

0. 터미널에서 *SSH*로 라우터에 접속
1. 패키지 설치

   ```bash
   opkg update
   opkg install transmission-web
   ```

   > 엔트웨어를 업데이트 후, 웹 인터페이스를 설치합니다.

## CONFIGURATION

### KILL TRANSMISSION

설정을 수정하기전에 전에 트랜스미션을 종료합니다. \
종료하지 않으면 수정할 수 없습니다.

```bash
/opt/etc/init.d/S88transmission stop
```

> 스크립트를 이용하여 트랜스미션을 종료합니다.

### EDIT SETTINGS

기본 에디터, _vi_ 를 이용해 트랜스미션 설정파일, _/opt/etc/transmission/settings.json_ 를 수정합니다.

[![asciicast](https://asciinema.xiyo.dev/a/34.svg)](https://asciinema.xiyo.dev/a/34)

0. 설정 파일을 엽니다.

   ```bash
   vi /opt/etc/transmission/settings.json
   ```

   > *vi*를 이용해 설정파일을 엽니다.

1. 속성을 수정합니다.

   - 수정할 속성 확인

     ```text
     "download-dir": "/mnt/XIYOsD10/home/xiyo/downloads",
     "incomplete-dir": "/mnt/XIYOsD10/var/tmp/transmission/incomplete",
     "rpc-password": "test1234",
     "rpc-username": "root",
     "watch-dir": "/mnt/XIYOsD10/home/xiyo/watchdir",
     ```

     > _XIYOsD10_ 는 마운트된 스토리지의 이름입니다.
     >
     > - _download-dir_ \
     >    내려받은 파일을 저장할 위치 입니다.
     > - _incomplete-dir_ \
     >    내려받는 중인 토렌트 파일이 저장될 위치입니다. \
     >    _incomplete-dir-enabled_ 속성을 _true_ (기본값)로 > 설정해야 합니다.
     > - _rpc-password_ \
     >    원격으로 접속할 때 사용할 암호입니다. \
     >    기본값은 공백으로, 암호 없이 접속할 수 있습니다. \
     >    대몬을 실행후 최초 접속시 암호화 됩니다.
     > - _rpc-username_ \
     >    원격으로 접속할 때 사용할 _ID_ 입니다. \
     >    기본값은 _root_ 입니다.
     > - _watch-dir_ \
     >    토렌트 파일을 자동으로 불러올 위치입니다. \
     >    _watch-dir-enabled_ 속성을 _true_ (기본값)로 > 설정해야 합니다.
     >
     > 트랜스미션은 설정 파일에 입력한 디렉토리가 없다면 자동으로 생성하기 때문에 따로 디렉토리를 생성하지 않아도 됩니다.

   0. 단어 찾기 \
      <kbd>/</kbd>를 입력하고 찾을 텍스트를 입력하면 됩니다.

   1. 텍스트 수정 \
      <kbd>i</kbd>를 입력하면 입력 모드로 전환 됩니다. \
      수정이 끝난 후에는 <kbd>ESC</kbd>를 입력해서 명령 모드로 전환합니다.

   2. 저장 \
      명령 모드에서, <kbd>:wq</kbd>를 입력하고 <kbd>Enter</kbd>를 입력하면 저장하고 에디터를 종료합니다.

### START TRANSMISSION

트랜스미션을 시작합니다.

```bash
/opt/etc/init.d/S88transmission start
```

> 스크립트를 이용하여 트랜스미션을 시작합니다.

## OPEN FIREWALL

방화벽을 열어 효과적으로 피어와 연결될 수 있도록합니다.

### OPEN PORT

인바운드를 허용할 포트를 방화벽에 추가합니다.

```bash
iptables -I INPUT -p tcp --dport 51413 -j ACCEPT
iptables -I INPUT -p udp --dport 51413 -j ACCEPT
```

> 트랜스미션에서 사용하는 포트를 방화벽에 추가합니다. \
> _TCP_ 는 파일을 내려받을 때 사용하고, _UDP_ 는 트래커와 피어에 연결할 때 사용합니다.

### SAVE RULES

라우터가 재시작 될 때마다 방화벽 규칙이 사라지므로, 재시작 할 때 마다 방화벽 규칙이 적용되도록 설정합니다.

```bash
FILE="/jffs/scripts/firewall-start"; \
[ ! -f "$FILE" ] && \
echo "#!/bin/sh" > "$FILE" && \
chmod +x "$FILE"; \
echo -e "\n# Allow Transmission" >> "$FILE"; \
echo "iptables -I INPUT -p tcp --dport 51413 -j ACCEPT" >> "$FILE"; \
echo "iptables -I INPUT -p udp --dport 51413 -j ACCEPT" >> "$FILE"
```

> _firewall-start_ 파일이 없다면 생성하고, 파일에 방화벽 규칙을 추가합니다.

## AUTO START

트랜스미션을 라우터가 재시작 될 때마다 자동으로 시작되도록 설정합니다.

트랜스미션은 추가 스토리지를 사용하고 있기 때문에 스토리지가 마운트 되기 전에는 실행되면 안됩니다. \
드라이브가 마운트된 직후 트랜스미션을 실행하도록 설정합니다.

0. 파일 확인 \
   마운트 후 실행할 스크립트가 존재하는지 확인하고, 없다면 생성합니다.

   ```bash
   FILE="/jffs/scripts/post-mount"; \
   [ ! -f "$FILE" ] && \
   touch "$FILE" && \
   chmod +x "$FILE" && \
   echo "#!/bin/sh" > "$FILE"
   ```

   > post-mount 파일이 없다면 생성하고 실행 권한을 추가합니다.

1. 자동 실행 스크립트 추가 \
   마운트 후에 자동 실행되도록 명령어를 추가 합니다.

   ```bash
   FILE="/jffs/scripts/post-mount"; \
   SEARCH_STRING=". /jffs/addons/diversion/mount-entware.div # Added by amtm"; \
   ADD_COMMAND="/opt/etc/init.d/S88transmission start"; \
   grep -q "$SEARCH_STRING" "$FILE" || \
   echo -e "\n# Entware addmon start" >> "$FILE" && \
   echo "$ADD_COMMAND" >> "$FILE"
   ```

   > _diversion_ 을 설치하거나 제거한적이 있다면 _diversion_ 의 마운트 스크립트가 존재할 것입니다. \
   > 그러면 이미 자동 실행 스크립트가 들어 있기 때문에 아무런 작업을 하지 않습니다.
   > 없다면, 트랜스미션을 자동 실행하는 스크립트를 추가합니다.

## USAGE

### WEB UI

![윈도우즈 11, 엣지에서 접속한 화면](/resources/2023-11-12-22-17-45.png)

브라우저에서 _http://라우터IP:9091_ 에 접속하면 웹 *UI*를 확인할 수 있습니다. \
_ID_ 와 암호는 설정파일에서 설정한 값입니다.

### TRANSMISSION CLIENT

![윈도우즈 11, 트랜스미션 클라이언트에서 서버 정보 입력 화면](/resources/2023-11-12-21-28-02.png)

트랜스미션 클라이언트는 리모트 서버에 대한 접근 기능이 있습니다. \
실행 후 웹 접근과 같이 똑같은 정보를 입력하면됩니다.

## TROUBLESHOOTING

### MOUNTED DIRECTORY CHANGES

스토리지 마운트를 기본 설정으로 사용할 경우 사용자의 마운트된 스토리지 이름은 sda1, sdb1 으로 되어있을 것입니다. \
이 경우 라우터가 재시작 될 때마다 스토리지 이름이 변경 될 수 있습니다. 그렇기 때문에 마운트를 항상 고정시켜줘야합니다.

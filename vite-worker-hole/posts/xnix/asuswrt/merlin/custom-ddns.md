# CUSTOM DDNS

asuswrt-merlin 펌웨어에서 커스텀 도메인을 연결하는 방법을 정리합니다.

구글 도메인스 사용 도중 스퀘어 스페이스에 매각되었습니다. 구글 도메인스에서 클라우드 플레어로 도메인 이전 후, 커스텀 DDNS 설정을 하는 과정을 정리합니다.

## REQUIREMENTS

커스텀 DDNS 설정을 위해서는 다음과 같은 사항을 준비해야 합니다.

- **펌웨어 버전** : \
  inadyn 패키지를 사용하여 커스텀 DDNS 를 설정하기 때문에 384.7 이상의 버전이 필요합니다.
- **JFFS** : \
  커스텀 DDNS 설정을 위해서는 JFFS가 활성화 되어 있어야 합니다.
- **SSH** : \
  라우터에 접근할 수 있는 권한이 필요합니다.

> 요구 사항에 대한 설명은 이 문서에서 하지 않습니다.

## CHANGE DDNS

기존 DDNS 설정을 변경합니다.

[DDNS 설정](https://router.xiyo.dev/Advanced_ASUSDDNS_Content.asp)에서 Server를 Custom으로 변경합니다.

![DDNS 옵션 변경](img_4.png)

WAN 카테고리의 DDNS 설정에서 Server 옵션을 Custom으로 변경합니다.

## ISSUE API TOKEN

클라우드 플레어의 [토큰 발급](https://dash.cloudflare.com/profile/api-tokens)에서

- zone.zone read
- zone.dns edit

권한을 가진 토큰을 발급 받습니다.

발급 후 결과 :

![토큰 발급 결과](img_3.png)

## SETUP INADYN

### MAKE CONFIG

`/jffs/inadyn.conf` 파일을 생성합니다.

이 시나리오에서는 와일드카드 도메인을 사용하기 때문에 두 개의 프로바이더를 사용합니다.

```shell
# 도메인
# 단일 프로바이더만 사용한다면 `:1`을 제거하고 사용합니다.
# provider cloudflare.com
provider cloudflare.com:1 {
    username = "xiyo.dev"
    password = API_TOKEN  # 발급 받은 토큰을 입력합니다. 쌍따옴표로 감싸서 입력합니다.
    hostname = "xiyo.dev"
    ttl = 1 # optional, value of 1 is 'automatic'.
    proxied = false # optional.
}

# 와일드카드 도메인
provider cloudflare.com:2 {
    username = "xiyo.dev"
    password = API_TOKEN # 발급 받은 토큰을 입력합니다. 쌍따옴표로 감싸서 입력합니다.
    hostname = "*.xiyo.dev"
    ttl = 1 # optional, value of 1 is 'automatic'.
    proxied = false # optional.
}
```

### CEHCK CONFIG

설정의 문법을 확인합니다.

```shell
inadyn --check-config --config="/jffs/inadyn.conf"
```

> 오류가 발생하면 문법을 다시 확인하세요.

### RUN INADYN

inadyn을 실행하여 도메인에 IP를 등록합니다.

```shell
inadyn --once --config="/jffs/inadyn.conf"
```

> `--once` 옵션은 데몬 모드를 끄기 위한 옵션입니다. 이유는 자동화에서 설명합니다.

## AUTOMATION

IP가 변경될때마다 도메인에 연결된 IP를 변경 할 수 있도록 설정합니다.

`/jffs/scripts/ddns-start` 파일이 없다면 생성 후 실행 권한을 부여합니다.

```shell
touch /jffs/scripts/ddns-start
chmod +x /jffs/scripts/ddns-start
```

`/jffs/scripts/ddns-start` 파일에 다음과 같은 내용을 입력합니다.

```shell
#!/bin/sh

inadyn --once --config="/jffs/inadyn.conf" exec="ddns_custom_updated 1"
```

> `ddns_custom_updated 1`은 start-ddns의 실행 완료를 알리는 명령어 입니다.

## CHECK

도메인이 실제 IP와 연결되었는지 확인합니다.

실행

```shell
nslookup xiyo.dev
```

결과

```text
Server:  XIYOsRouter
Address:  192.168.1.1

Non-authoritative answer:
Name:    xiyo.dev
Address:  124.5.184.78
```

라우터의 메인에서 보인는 아이피와 일치하면 정상적으로 설정된 것입니다.

## AFTER

이제 라우터가 리부트 되거나 IP가 변경되더라도 도메인은 항상 라우터를 바라봅니다.

다음 편에서는 라우터에 인증서를 설치하는 방법을 정리합니다.

## REFERENCE

[asuswrt-merlin 커스텀 DDNS 위키](https://github.com/RMerl/asuswrt-merlin.ng/wiki/DDNS-services)

[inadyn 설정 예제](https://github.com/troglobit/inadyn#example)

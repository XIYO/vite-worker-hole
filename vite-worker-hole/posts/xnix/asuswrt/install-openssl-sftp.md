# INSTALL OPENSSL AND SFTP ON ASUSWRT

`Dropbear`에 `SFTP` 기능을 추가하는 방법을 설명합니다.

`Dropbear`는 `OpenSSH`의 경량 패키지 입니다. \
`OpenSSH`의 일부 기능을 제거하면서 `SFTP`까지 제거 되었습니다.

## ENVIRONMENT

- `ASUSWRT-MERLIN 386.12`
- `Entware armv7sf-k2.6`

## METHOD

```bash
opkg update
opkg install openssh-sftp-server
```

패키지 매니저의 업데이트와 설치를 진행합니다.

설치 후에는 다른 설정없이 바로 접근할 수 있습니다.

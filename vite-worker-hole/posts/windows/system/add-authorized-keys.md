# SSH 공개키 등록 방법 - 윈도우

윈도우에서 SSH 설치 후 공개키를 등록하는 방법을 살펴봅시다.

## 시나리오

`.ssh\authorized_keys` 파일을 생성하고 공개키를 등록했음에도 불구하고, 등록된 키로 접근 시 비밀번호를 요구하는 문제가 발생했습니다. 이 문제의 원인은 윈도우 OpenSSH에 대한 어드민 그룹 사용자의 특별한 설정 때문이었습니다.

`$env:PROGRAMDATA\ssh\sshd_config` 파일 내용 중:

```text
Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

어드민 그룹의 사용자는 `administrators_authorized_keys` 파일을 참조하도록 설정되어 있습니다.

## 해결 방법

어드민 그룹 사용자 전용의 `administrators_authorized_keys` 파일을 만들고 공개키를 등록하면 문제를 해결할 수 있습니다.

**파일 생성**

올바른 권한을 가진 파일만 필요하다면, 아래 명령어를 **PowerShell 관리자 권한**으로 실행하세요.

```powershell
Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value $null;
icacls.exe $env:ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

- `Add-Content`: 지정된 경로에 파일이 존재하지 않는 경우, 새 파일을 생성하고 내용을 추가하는 PowerShell cmdlet입니다.

  - `-Force`: 작업 중 발생할 수 있는 오류를 무시하고 명령을 강제로 실행하여, 파일이 없으면 새로 만듭니다.

- `icacls.exe`: 파일이나 디렉토리의 액세스 제어 목록(ACL)을 수정하는 Windows 명령줄 유틸리티입니다.
  - `/inheritance:r`: 파일이나 폴더의 상속을 제거하여, 명시적으로 설정된 권한만 유지합니다.
  - `/grant "Administrators:F"`: "Administrators" 그룹에 "Full control" 권한을 부여합니다.
  - `/grant "SYSTEM:F"`: "SYSTEM" 계정에 "Full control" 권한을 부여합니다.

**키 등록**

인증 파일 생성과 공개키를 즉시 등록하려면, 아래 명령어를 **PowerShell 관리자 권한**으로 실행하세요.

```powershell
$authorizedKey = Get-Content -Path $env:USERPROFILE\.ssh\id_ed25519.pub
Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value $authorizedKey
icacls.exe $env:ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

## 문제 해결

1. 리눅스 시스템의 `ssh-copy-id` 명령어로 윈도우 시스템에 공개키를 등록하는 것은 지원되지 않습니다. 따라서, 수동으로 등록해야 합니다.

2. 클립보드의 내용을 `administrators_authorized_keys` 파일에 붙여넣기 해야 한다면, Visual Studio Code를 설치하고, 아래 명령어를 **PowerShell 관리자 권한**으로 실행하세요.

   ```powershell
   code $env:ProgramData\ssh\administrators_authorized_keys
   ```

## 참고

[마이크로소프트 문서](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)

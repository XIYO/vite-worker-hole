# BREW INSTALL MONGODB

`intel`, `macOS 14.0`, `sonoma` 환경에서 `brew 4.1.14`를 사용해 `mongoDB`를 설치하는 과정을 정리합니다.

## NOTE

- `mongoDB`는 클라우드 서비스가 있으며, `free tier`를 제공합니다.  
  클라우드 서비스를 사용하면 `mongoDB`를 설치할 필요가 없습니다.
- 이 문서에서는 `brew`를 통해 `mongoDB`를 설치합니다.
- [공식 다운로드](https://www.mongodb.com/try/download/community)에서 제공하는 명령어인 `brew install mongodb-atlas`는 클라우드 사용자를 위한 패키지 입니다.  
  클라우드 사용자가 아니라면 이 패키지를 설치할 필요는 없습니다.
  > 🟣 IMPORTANT
  >
  > `mongodb-atlas`는 `mongodb-atlas-cli`로 변경 되었습니다. ([`brew` 문서 참고](https://docs.atlas.mongodb.com/command-line-tools/))
- 이 문서는 [`mongoDB` 7.0 Docs](https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-os-x/)의 가이드대로 설치를 진행합니다.

## INSTALL

`mongoDB`는 `brew`의 **기본 저장소로는 설치할 수 없습니다.**  
`mongoDB`가 제공하는 **저장소를 추가해야 합니다.**

```shell
brew tap mongodb/brew
```

`brew` 저장소에 `mongoDB`가 추가합니다.

```shell
brew install mongodb/brew/mongodb-community
```

버전을 명시하지 않고, `mongoDB`가 제공하는 안정적인 버전으로 설치합니다.  
작성일 기준으로는 7.0.2 버전이 설치됩니다.

> 🔵 NOTE
>
> 버전을 명시하지 않고 설치 할 때,  
> 패키지 버전을 알아보기 위해서는 `brew info`를 사용하면 됩니다.
>
> ```shell
> brew info mongodb/brew/mongodb-community
> ```
>
> 패키지에 대한 정보가 출력됩니다.

> 🔵 NOTE
>
> 의도적으로 버전을 명시해서 설치할 수 있습니다.
>
> ```shell
> brew install mongodb/brew/mongodb-community@6.0
> ```
>
> 버전 정보를 명시해서 구 버전을 설치합니다.

## RUN

`brew`로 설치하고나면 `brew services`를 통해 실행할 수 있습니다.

```shell
brew services start mongodb/brew/mongodb-community
```

> `brew`를 사용해서 `mongoDB` 서비스를 실행합니다.

```text
brew services info mongodb/brew/mongodb-community
```

> `brew`를 사용해서 `mongoDB` 서비스의 정보를 출력합니다.

```text
mongodb-community (homebrew.mxcl.mongodb-community)
Running: ✔
Loaded: ✔
Schedulable: ✘
User: xiyo
PID: 21105
```

> Running 상태가 `✔`로 출력되면 정상적으로 실행된 상태입니다.

직접 실행하려면 아래 명령어를 입력합니다.

```shell
$(brew --prefix)/opt/mongodb-community/bin/mongod --config $(brew --prefix)/etc/mongod.conf --fork --logpath $(brew --prefix)/var/log/mongodb/mongod.log
```

> `$(brew --prefix)`는 `brew`의 설치 경로가 반환되어 경로가 됩니다.  
> `--fork` 옵션은 `mongod` 프로세스를 백그라운드에서 실행하도록 합니다.  
> `--logpath` 옵션은 로그 파일의 위치를 지정합니다.  
> **백그라운드로 실행 할 때는 두 옵션을 동시에 사용**해야 합니다.

## ⚠️ TRAOUUBLE SHOOTING

### ERROR: Bootstrap failed: 5: Input/output error

`ssh`를 통해 `macOS`에 접속해서 `brew services`로 `mongoDB`를 실행하면 오류가 발생합니다.

```text
Warning: running over SSH, using user/* instead of gui/* domain!
Hide this warning by setting HOMEBREW_SERVICES_NO_DOMAIN_WARNING.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
Bootstrap failed: 5: Input/output error
Try re-running the command as root for richer errors.
Error: Failure while executing; `/bin/launchctl bootstrap user/501 /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist` exited with 5.
```

오류 설명:

1. ```text
   Warning: running over SSH, using user/* instead of gui/* domain!
   Hide this warning by setting HOMEBREW_SERVICES_NO_DOMAIN_WARNING.
   ```

   `ssh` 세션으로 접근하면 실행 도메인이 `gui`가 아닌 `user`로 실행된다는 경고 메시지입니다.  
    `brew`는 개인 사용자를 위해 만들어진 패키지 매니저입니다.  
    때문에 `gui`로 실행돼야 문제가 없지만, 저는 `ssh`를 이용해 실행했기 때문에 경고가 발생합니다.  
    마지막 메시지는 경고 메시지를 숨길 수 있는 환경 변수, `HOMEBREW_SERVICES_NO_DOMAIN_WARNING`를 마지막 줄에서 알려줍니다.

2. ```text
   Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
   ```

   `HOMEBREW_NO_ENV_HINTS`는 환경 변수로, 설정하면 `brew`에서 나오는 환경에 관련된 힌트 메시지를 숨길 수 있습니다.  
    이는 명령어 출력을 간결하게 유지하려는 사용자에게 유용합니다.  
    `man brew`를 실행하면 `brew`의 `manual`을 볼 수 있고, 이 환경 변수에 대한 추가 정보를 얻을 수 있습니다.

3. ```text
   Bootstrap failed: 5: Input/output error
   Try re-running the command as root for richer errors.
   Error: Failure while executing; `/bin/launchctl bootstrap user/501 /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist` exited with 5.
   ```

   `macOS`의 `launchctl`이 출력하는 오류입니다.  
    최하단의 명령어 `/bin/launchctl`은 `brew`의 실행 환경에 따라서 `GUI` 도메인과 `USER` 도메인을 구분합니다.(`GUI`는 물리적 로그인이고, `USER`는 `ssh`와 같은 원격 세션입니다.)  
    이는 `macOS`의 명령어인 `launchctl`의 특징이며, `ssh`로 접속한 상태에서는 `brew`가 `USER` 도메인으로 실행합니다.

   명시적으로 `user/501`를 `gui/501`로 변경하여 실행하면 정상실행이 됩니다.(501은 사용자의 `uid`입니다.)
   그러나 이럴 경우 `gui` 입출력이 필요한 화면이 나올경우 `ssh` 세션에서는 진행이 불가능합니다.  
    예를들면 방화벽이 활성화된 경우 `gui`에서 허용을 해야합니다.  
    결국 `gui` 도메인으로 실행해야하는건 변함 없기 때문에 `vnc`를 이용해 `macOS`에 원격 접속 후에 터미널에서 `brew services`로 `mongoDB`를 실행했습니다.

> 🔵 NOTE
>
> 오류 문장 중간에
>
> ```text
> Try re-running the command as root for richer errors.
> # 자세한 오류를 보기 위해 `root`로 실행하세요
> ```
>
> `root`실행 권장 메시지가 있는데, `mongoDB`는 보안을 위해 `root`로 실행이 차단되어 있습니다.  
> `root`로 실행했을 경우 `brew`의 `directory`의 소유권이 변경되기 때문에,  
> **소유권을 변경하거나**,
>
> > ```shell
> > sudo chown -R $(whoami) $(brew --prefix)/*
> > ```
> >
> > `brew`의 모든 `directory`와 `File`의 소유자가 현재 사용자로 변경됩니다.  
> > 또는 명시적으로 `$(brew --prefix)/Cellar/mongodb-community`의 소유권을 변경하면 됩니다.
> >
> > `-R` 옵션은 `recursive`를 의미합니다.  
> > 모든 하위의 `file`과 `directory`에 대하여 명령을 적용하라는 의미입니다.
>
> **삭제 후 다시 설치**하는 방법을 사용해야합니다.
>
> > ```shell
> > brew uninstall mongodb/brew/mongodb-community
> > ```
> >
> > `brew`를 이용해 삭제 명령을 입력을 하면 `root`로 삭제 해야할 `directory`를 명확히 알려줍니다.

#### `PLIST`

`root`로 실행하여 권한이 바뀌었을 경우 무작정 오류 해결법만 보지 않고 명확히 진단 하려고 하면, 오류 문장에서 볼 수 있는 `plist` 파일의 내용을 직접 보면 됩니다.

> 🔵 NOTE
>
> `plist`는 `macOS`에서 `service`를 관리하는 파일입니다.

```shell
cat /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist
```

`macOS`에서 사용하는 `service`를 관리하는 파일을 현재 셸에 출력합니다.

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD plist 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>homebrew.mxcl.mongodb-community</string>
    <key>ProgramArguments</key>
    <array>
    <string>/usr/local/opt/mongodb-community/bin/mongod</string>
    <string>--config</string>
    <string>/usr/local/etc/mongod.conf</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>WorkingDirectory</key>
    <string>/usr/local</string>
    <key>StandardErrorPath</key>
    <string>/usr/local/var/log/mongodb/output.log</string>
    <key>StandardOutPath</key>
    <string>/usr/local/var/log/mongodb/output.log</string>
    <key>HardResourceLimits</key>
    <dict>
    <key>NumberOfFiles</key>
    <integer>64000</integer>
    </dict>
    <key>SoftResourceLimits</key>
    <dict>
    <key>NumberOfFiles</key>
    <integer>64000</integer>
    </dict>
</dict>
</plist>
```

1. `Label`:

   - 서비스의 고유한 식별자입니다. 이 경우 `homebrew.mxcl.mongodb-community`라는 라벨이 주어졌습니다.

2. `ProgramArguments`:

   - 실행할 프로그램과 그에 대한 인자들을 명시합니다.
   - 이 경우 `/usr/local/opt/mongodb-community/bin/mongod` 프로그램을 `--config /usr/local/etc/mongod.conf` 옵션과 함께 실행하도록 설정했습니다.

3. `RunAtLoad`:

   - 이 키가 `true`로 설정되면, 시스템 로드 시에 서비스가 자동으로 시작됩니다.

4. `KeepAlive`:

   - 이 키가 `true`로 설정되면, 서비스가 종료되더라도 `launchd`가 자동으로 재시작합니다. 여기에서는 `false`로 설정되어 있으므로, 서비스가 종료되면 재시작되지 않습니다.

5. `WorkingDirectory`:

   - 서비스가 실행될 때 작업 디렉터리를 지정합니다. 이 경우 `/usr/local`로 설정되어 있습니다.

6. `StandardErrorPath`와 `StandardOutPath`:

   - 표준 에러와 표준 출력을 리디렉션할 파일 경로를 지정합니다. 이 경우 모두 `/usr/local/var/log/mongodb/output.log`로 설정되어 있어, 모든 출력과 에러 메시지가 이 파일에 기록됩니다.

7. `HardResourceLimits`와 `SoftResourceLimits`:
   - 서비스에 대한 리소스 제한을 설정합니다. 여기에서는 `NumberOfFiles`라는 키로 파일 디스크립터의 최대 수를 `64000`으로 설정했습니다.

`ProgramArguments`에 명시된 대로, 똑같이 실행해봅니다.

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

`mongod`를 직접 실행하면서 `config` 파일을 명시적으로 지정합니다.

```text
 /usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
{"t":{"$date":"2023-10-09T10:09:26.789Z"},"s":"F",  "c":"CONTROL",  "id":20574,   "ctx":"thread1","msg":"Error during global initialization","attr":{"error":{"code":38,"codeName":"FileNotOpen","errmsg":"Can't initialize rotatable log file :: caused by :: Failed to open /usr/local/var/log/mongodb/mongo.log"}}}
```

출력에 따르면, `mongod`는 로그 파일 `/usr/local/var/log/mongodb/mongo.log`를 열지 못해 에러를 발생하고 있습니다.  
이러한 종류의 에러는 주로 파일이 없거나, 혹은 파일에 대한 쓰기 권한이 없을 때 발생합니다.

직접 확인해봅니다.

```shell
ls -al /usr/local/var/log/mongodb/
```

`dirctory` 하위의 파일들을 확인합니다.

```text
total 24
drwxr-xr-x   4 xiyo  admin    128 Oct  9 12:47 .
drwxr-xr-x  10 xiyo  admin    320 Oct  9 12:23 ..
-rw-------   1 root  admin  11360 Oct  9 12:47 mongo.log
-rw-r--r--   1 root  admin      0 Oct  9 12:47 output.log
```

출력을 보니 `mongo.log` 파일의 소유권이 `root`로 되어있습니다.  
위에서 언급한 `brew`는 `root`로 실행하면 안 된다는 규칙을 깨고 실행하면 권한 문제가 발생하게 됩니다.

`output.log`파일도 역시 `plist`에서 참조하는 파일이니 두 개 파일의 소유권을 현재 사용자로 변경하겠습니다.

```shell
sudo chown -R $(whoami) /usr/local/var/log/mongodb/
```

모든 `file`에 대하여 소유권을 변경합니다.

그리고 다시 실행 명령을 입력합니다,

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

`plist`와 똑같은 실행방식인, `mongod`에 `config` 파일을 직접 지정해서 실행합니다.

출력이 아무것도 없고 정상 작동했는지 확인하기 위해 `process`를 확인합니다.

```shell
ps aux | grep mongod
```

`mongod`가 실행되고 있는지 확인합니다.

```text
ps aux | grep mongod
root             94237   0.3  0.3 36489684  47860   ??  Ss   12:47PM   1:35.65 /usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
xiyo             12842   0.0  0.0 34121212    524 s000  S+    7:32PM   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox mongod
```

출력에 총 2개의 `process`가 보이며 아래는 제가 실행한 명령어 입니다.  
`root`로 실행된 `process`가 실제 구동중인 `mongod`입니다.

현재 `brew`는 `root`로 실행하면 안되는 규칙을 깨고 실행했기 때문에,  
여기저기 권한 문제가 발생하고 있습니다.

프로세스를 종료하겠습니다.

```shell
kill 94237
```

kill 명령어를 통해 프로세스를 종료합니다.

> 🔵 NOTE
>
> `kill` 명령어는 이름과 다르게 `process`를 정상 종료하는 명령어입니다.
> 강제 종료는 `kill -9` 를 사용 합니다..

이제 다시 실행해보고 로그를 보겠습니다.

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
ps aux | grep mongod
```

실행하고 `process`를 확인합니다.

```text
xiyo             13061   0.0  0.0 34126336    496 s000  R+    7:37PM   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox mongod
```

출력에는 `mongod`가 실행되고 있지 않습니다.  
이제 `mongo.log`를 확인해보겠습니다.

```shell
tail /usr/local/var/log/mongodb/mongo.log
```

`cat` 명령어는 모든 내용을 출력하기때문에,  
`tail` 명령어를 사용해서 마지막 10줄만 출력합니다.

```text
{"t":{"$date":"2023-10-09T19:33:33.994+09:00"},"s":"I",  "c":"TENANT_M", "id":7091600, "ctx":"thread1","msg":"Starting TenantMigrationAccessBlockerRegistry"}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":4615611, "ctx":"initandlisten","msg":"MongoDB starting","attr":{"pid":12858,"port":27017,"dbPath":"/usr/local/var/mongodb","architecture":"64-bit","host":"XIYOsMini"}}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":23403,   "ctx":"initandlisten","msg":"Build Info","attr":{"buildInfo":{"version":"7.0.2","gitVersion":"02b3c655e1302209ef046da6ba3ef6749dd0b62a","modules":[],"allocator":"system","environment":{"distarch":"x86_64","target_arch":"x86_64"}}}}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":51765,   "ctx":"initandlisten","msg":"Operating System","attr":{"os":{"name":"Mac OS X","version":"23.0.0"}}}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":21951,   "ctx":"initandlisten","msg":"Options set by command line","attr":{"options":{"config":"/usr/local/etc/mongod.conf","net":{"bindIp":"127.0.0.1, ::1","ipv6":true},"storage":{"dbPath":"/usr/local/var/mongodb"},"systemLog":{"destination":"file","logAppend":true,"path":"/usr/local/var/log/mongodb/mongo.log"}}}}
{"t":{"$date":"2023-10-09T19:33:34.001+09:00"},"s":"I",  "c":"NETWORK",  "id":5693100, "ctx":"initandlisten","msg":"Asio socket.set_option failed with std::system_error","attr":{"note":"acceptor TCP fast open","option":{"level":6,"name":261,"data":"00 04 00 00"},"error":{"what":"set_option: Invalid argument","message":"Invalid argument","category":"asio.system","value":22}}}
{"t":{"$date":"2023-10-09T19:33:34.002+09:00"},"s":"I",  "c":"NETWORK",  "id":5693100, "ctx":"initandlisten","msg":"Asio socket.set_option failed with std::system_error","attr":{"note":"acceptor TCP fast open","option":{"level":6,"name":261,"data":"00 04 00 00"},"error":{"what":"set_option: Invalid argument","message":"Invalid argument","category":"asio.system","value":22}}}
{"t":{"$date":"2023-10-09T19:33:34.004+09:00"},"s":"F",  "c":"STORAGE",  "id":28661,   "ctx":"initandlisten","msg":"Unable to read the storage engine metadata file","attr":{"error":{"code":38,"codeName":"FileNotOpen","errmsg":"Failed to read metadata from /usr/local/var/mongodb/storage.bson"}}}
{"t":{"$date":"2023-10-09T19:33:34.004+09:00"},"s":"F",  "c":"ASSERT",   "id":23091,   "ctx":"initandlisten","msg":"Fatal assertion","attr":{"msgid":28661,"file":"src/mongo/db/storage/storage_engine_metadata.cpp","line":93}}
{"t":{"$date":"2023-10-09T19:33:34.004+09:00"},"s":"F",  "c":"ASSERT",   "id":23092,   "ctx":"initandlisten","msg":"\n\n***aborting after fassert() failure\n\n"}
```

출력을 아래에서 부터 읽어보면, 밑에서 세 번째 줄에 `Unable to read the storage engine metadata file` 오류 메시지가 보입니다.

실제 파일의 소유권을 확인해보고 변경하겠습니다.

```shell
ls -al /usr/local/var/mongodb/
```

소유권을 확인합니다.

> 🔵 NOTE
>
> `var`는 `variable`의 약자로, 사용중 생성되거나 변경되는 파일들을 저장하는 `directory`입니다.

```text
total 560
drwxr-xr-x  20 xiyo  admin    640 Oct  9 19:33 .
drwxrwxr-x  10 xiyo  admin    320 Oct  9 12:23 ..
-rw-------   1 root  admin     50 Oct  9 12:47 WiredTiger
-rw-------   1 root  admin     21 Oct  9 12:47 WiredTiger.lock
-rw-------   1 root  admin   1471 Oct  9 19:33 WiredTiger.turtle
-rw-------   1 root  admin  69632 Oct  9 19:33 WiredTiger.wt
-rw-------   1 root  admin   4096 Oct  9 19:33 WiredTigerHS.wt
-rw-------   1 root  admin  20480 Oct  9 19:33 _mdb_catalog.wt
-rw-------   1 root  admin  20480 Oct  9 19:33 collection-0-7618419118836831796.wt
-rw-------   1 root  admin  20480 Oct  9 19:33 collection-2-7618419118836831796.wt
-rw-------   1 root  admin   4096 Oct  9 19:33 collection-4-7618419118836831796.wt
drwx------   3 root  admin     96 Oct  9 19:33 diagnostic.data
-rw-------   1 root  admin  20480 Oct  9 19:33 index-1-7618419118836831796.wt
-rw-------   1 root  admin  20480 Oct  9 19:33 index-3-7618419118836831796.wt
-rw-------   1 root  admin   4096 Oct  9 19:33 index-5-7618419118836831796.wt
-rw-------   1 root  admin   4096 Oct  9 19:33 index-6-7618419118836831796.wt
drwx------   5 root  admin    160 Oct  9 12:47 journal
-rw-------   1 root  admin      0 Oct  9 19:33 mongod.lock
-rw-------   1 root  admin  20480 Oct  9 19:33 sizeStorer.wt
-rw-------   1 root  admin    114 Oct  9 12:47 storage.bson
```

소유권이 `root`로 되어 있습니다.

`root`로 되어있는 소유권을 현재 사용자로 변경하고 다시 `mongod`를 실행하겠습니다.

```shell
sudo chown -R $(whoami) /usr/local/var/log/mongodb/
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

소유권을 변경하고 `process`를 바로 실행하였습니다.

더 이상 셸과 대화가 불가능해지면서 정상적인 프로세스 구동이 완료 됐습니다.

이제 `brew`의 **`root`로 실행하지말것** 원칙을 어긴 댓가로 생긴 권한 문제를 다 수정했으니 실제 `macOS`에 `VNC`나 물리적 접근으로 `brew services`로 `mongoDB` 실행하면 됩니다.

즐겁게 `mongoDB`를 사용하세요.

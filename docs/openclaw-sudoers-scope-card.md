# OpenClaw sudoers scope card

## 目的
把“给代理可执行的 sudo 权限”控制在够用范围，而不是一上来放开 `NOPASSWD: ALL`。

## 默认判断
如果目标只是让代理远程补常见依赖、看服务、查日志，优先放行少数高频命令：
- `/usr/bin/apt-get`
- `/usr/bin/apt`
- `/usr/bin/systemctl`
- `/usr/bin/journalctl`

不要默认放开所有 root 命令。

## 为什么这样做
- 这已经覆盖大多数环境修复与依赖安装场景
- 比共享 sudo 密码更稳
- 比 `NOPASSWD: ALL` 风险小很多
- 代理能直接代跑系统安装，而不需要现场输密码

## 验证方式
不要只测 `sudo -n true`。更重要的是测被白名单放行的实际命令：
- `sudo -n apt-get update`
- `sudo -n apt-get install -y <pkg>`
- `sudo -n systemctl status <service>`

如果这些命令能跑，就说明目标权限已经生效；`sudo -n true` 失败不代表白名单无效。

## 何时再扩权限
只有在明确出现新需求时才加：
- 需要看服务日志 → 加 `journalctl`
- 需要重启服务 → 加 `systemctl`
- 需要固定维护动作 → 优先加单独脚本，而不是继续扩大全量 root

## 不推荐
- 在聊天里共享 sudo 密码
- 让代理代填明文密码
- 直接配置 `NOPASSWD: ALL` 作为默认做法

## 一句话
目标是“让代理能做常见维护”，不是“让代理拿到无限 root”。

#!/bin/sh

# window平台git hooks有时候可能会失败
# 在 Windows上通过Git Bash使用Yarn时，Git钩子可能会失败。如果您有 Windows 用户，强烈建议添加以下解决方法。
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi
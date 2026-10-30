import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';

// No real NAS or Docker: retain argument guards, redirect files and commands into fixtures.
const bash = process.env.NAS_TEST_BASH || (process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash');
const posix = value => process.platform === 'win32' ? value.replaceAll('\\', '/').replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`) : value;
const source = fs.readFileSync(new URL('./deploy-nas.sh', import.meta.url), 'utf8');
const revision = 'a'.repeat(40);
assert.ok(source.includes('app_parent=$(dirname "$app_root")'));
assert.ok(source.includes('PATH="/usr/local/bin:/usr/bin:/bin:/var/packages/ContainerManager/target/usr/bin:$PATH"'));

function fixture() {
  fs.mkdirSync('.cache', { recursive: true });
  const root = fs.mkdtempSync(path.resolve('.cache/nas-deploy-test-'));
  const app = path.join(root, 'developer-john');
  const bin = path.join(root, 'bin');
  const state = path.join(root, 'state');
  const input = path.join(root, 'source');
  for (const dir of [bin, state, input, path.join(input, 'src'), path.join(input, 'public')]) fs.mkdirSync(dir, { recursive: true });
  for (const name of ['Dockerfile', 'compose.nas.yaml', 'package.json', 'package-lock.json', 'src/example.txt', 'public/example.txt']) fs.writeFileSync(path.join(input, name), 'fixture\n');
  const archive = path.join(root, 'source.tar.gz');
  execFileSync('tar', ['-czf', archive, 'Dockerfile', 'compose.nas.yaml', 'package.json', 'package-lock.json', 'src', 'public'], { cwd: input });
  const runner = path.join(root, 'runner.sh');
  fs.writeFileSync(runner, source.replace('app_parent=$(dirname "$app_root")', 'app_root="$TEST_APP_ROOT"\napp_parent=$(dirname "$app_root")').replace('PATH="/usr/local/bin:/usr/bin:/bin:/var/packages/ContainerManager/target/usr/bin:$PATH"', 'PATH="$TEST_FAKE_BIN:$PATH"'));
  const commands = {
    docker: `#!/bin/sh
set -eu
case "$1" in
 info) exit 0 ;;
 ps) case "$*" in *publish=*) exit 0 ;; esac; [ ! -f "$TEST_STATE/current" ] || printf 'fixture-container\\n'; exit 0 ;;
 image) printf '%s\\n' "$TEST_REVISION"; exit 0 ;;
 inspect) case "$*" in *Mounts*) printf '0\\n' ;; *com.docker.compose.project*) printf 'developer-john\\n' ;; *) cat "$TEST_STATE/health" ;; esac; exit 0 ;;
 build) [ "\u0024{TEST_BUILD_FAIL:-0}" != 1 ] || exit 7; exit 0 ;;
 compose) shift ;;
 *) exit 2 ;;
esac
[ "\u0024{1:-}" != version ] || exit 0
env_file=''
command=''
all="$*"
while [ "$#" -gt 0 ]; do
 case "$1" in --env-file) shift; env_file=$1 ;; config|up|down|logs) command=$1 ;; esac
 shift
done
case "$command" in
 config) case "$all" in *--services*) printf 'web\\n' ;; *--images*) sed -n 's/^JOHNWEST_IMAGE=//p' "$env_file" ;; *) printf 'services: {web: {image: %s}}\\n' "$(sed -n 's/^JOHNWEST_IMAGE=//p' "$env_file")" ;; esac ;;
 up) next=$(sed -n 's/^JOHNWEST_IMAGE=.*://p' "$env_file"); printf '%s\\n' "$next" > "$TEST_STATE/current"; if [ "\u0024{TEST_FAIL_NEW:-0}" = 1 ] && [ "$next" != old ]; then printf 'unhealthy\\n' > "$TEST_STATE/health"; else printf 'healthy\\n' > "$TEST_STATE/health"; fi ;;
 down) rm -f "$TEST_STATE/current" "$TEST_STATE/health" ;;
 logs) printf 'fixture logs\\n' ;;
 *) exit 2 ;;
esac
`,
    curl: '#!/bin/sh\nprintf 200\n',
    netstat: '#!/bin/sh\nexit 0\n',
    sleep: '#!/bin/sh\nexit 0\n',
    mv: `#!/bin/sh
for destination do :; done
if [ "\u0024{TEST_FAIL_MARKER_MOVE:-0}" = 1 ] && [ "$destination" = "$TEST_APP_ROOT/current-release" ]; then
 [ -f "$1" ] || exit 8
 printf 'marker move failed before replacement\\n' >&2
 exit 9
fi
/usr/bin/mv "$@" || exit $?
if [ "\u0024{TEST_INTERRUPT_AFTER_MARKER:-0}" = 1 ] && [ "$destination" = "$TEST_APP_ROOT/current-release" ] && [ ! -f "$TEST_STATE/interrupted" ]; then
 touch "$TEST_STATE/interrupted"
 kill -TERM "$PPID"
fi
`,
  };
  for (const [name, script] of Object.entries(commands)) fs.writeFileSync(path.join(bin, name), script, { mode: 0o755 });
  return {
    app, state,
    run(release, overrides = {}, target = '/volume1/docker/developer-john') {
      return spawnSync(bash, [posix(runner), target, posix(archive), release, 'developer-john', 'developer-john', '3310', revision, 'deploy'], {
        encoding: 'utf8', timeout: 20_000,
        env: { ...process.env, MSYS2_ARG_CONV_EXCL: '*', TEST_APP_ROOT: posix(app), TEST_FAKE_BIN: posix(bin), TEST_STATE: posix(state), TEST_REVISION: revision, ...overrides },
      });
    },
    seedOld(withManagementFile = true) {
      fs.mkdirSync(path.join(app, 'releases/old'), { recursive: true });
      fs.writeFileSync(path.join(app, '.deployment-owner'), 'developer-john\n');
      fs.writeFileSync(path.join(app, 'current-release'), 'old\n');
      fs.writeFileSync(path.join(app, 'releases/old/compose.nas.yaml'), 'fixture\n');
      fs.writeFileSync(path.join(app, 'releases/old/.env'), 'JOHNWEST_IMAGE=developer-john:old\n');
      if (withManagementFile) fs.writeFileSync(path.join(app, 'docker-compose.yaml'), 'services: {web: {image: developer-john:old}}\n');
      fs.writeFileSync(path.join(state, 'current'), 'old\n');
      fs.writeFileSync(path.join(state, 'health'), 'healthy\n');
    },
  };
}
function succeeded(result) { assert.equal(result.status, 0, result.stderr + result.stdout + (result.error?.message || '')); }
function read(file) { return fs.readFileSync(file, 'utf8').trim(); }

test('first installation verifies health and records the deployed release', () => {
  const f = fixture(); succeeded(f.run('first-success'));
  assert.equal(read(path.join(f.app, 'current-release')), 'first-success');
  assert.equal(read(path.join(f.state, 'current')), 'first-success');
  assert.match(read(path.join(f.app, 'logs/first-success.result')), new RegExp(`revision=${revision}`));
  assert.equal(read(path.join(f.app, 'docker-compose.yaml')), read(path.join(f.app, 'logs/first-success.compose.yaml')));
  assert.match(read(path.join(f.app, 'docker-compose.yaml')), /image: developer-john:first-success/);
});
test('a failed initial build preserves logs and permits a clean retry', () => {
  const f = fixture(); assert.notEqual(f.run('first-failed', { TEST_BUILD_FAIL: '1' }).status, 0);
  assert.equal(fs.existsSync(path.join(f.app, 'current-release')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'logs/first-failed.build.log')), true);
  succeeded(f.run('first-retry')); assert.equal(read(path.join(f.app, 'current-release')), 'first-retry');
});

test('a failed first marker move removes temporary state and permits a new release', () => {
  const f = fixture();
  const failed = f.run('first-marker-failed', { TEST_FAIL_MARKER_MOVE: '1' });
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /marker move failed before replacement/);
  assert.equal(fs.existsSync(path.join(f.app, 'current-release')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'current-release.next-first-marker-failed')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'current-release.rollback-first-marker-failed')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml.next-first-marker-failed')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml.rollback-first-marker-failed')), false);
  assert.equal(fs.existsSync(path.join(f.state, 'current')), false);
  succeeded(f.run('first-marker-retry'));
  assert.equal(read(path.join(f.app, 'current-release')), 'first-marker-retry');
  assert.equal(read(path.join(f.state, 'current')), 'first-marker-retry');
  assert.match(read(path.join(f.app, 'docker-compose.yaml')), /image: developer-john:first-marker-retry/);
});
test('a successful update changes only this project release', () => {
  const f = fixture(); f.seedOld(); succeeded(f.run('next-success'));
  assert.equal(read(path.join(f.app, 'current-release')), 'next-success');
  assert.equal(fs.existsSync(path.join(f.app, 'releases/old/.env')), true);
  assert.match(read(path.join(f.app, 'docker-compose.yaml')), /image: developer-john:next-success/);
  assert.equal(read(path.join(f.app, 'releases/next-success/.docker-compose.previous.yaml')), 'services: {web: {image: developer-john:old}}');
});
test('an unhealthy update restores the previous container and release marker', () => {
  const f = fixture(); f.seedOld(); assert.notEqual(f.run('next-failed', { TEST_FAIL_NEW: '1' }).status, 0);
  assert.equal(read(path.join(f.app, 'current-release')), 'old');
  assert.equal(read(path.join(f.state, 'current')), 'old');
  assert.equal(read(path.join(f.app, 'docker-compose.yaml')), 'services: {web: {image: developer-john:old}}');
});
test('an interruption after marker replacement restores matching old state', () => {
  const f = fixture(); f.seedOld(); assert.notEqual(f.run('next-interrupted', { TEST_INTERRUPT_AFTER_MARKER: '1' }).status, 0);
  assert.equal(read(path.join(f.app, 'current-release')), 'old');
  assert.equal(read(path.join(f.state, 'current')), 'old');
  assert.equal(read(path.join(f.app, 'docker-compose.yaml')), 'services: {web: {image: developer-john:old}}');
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml.next-next-interrupted')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml.rollback-next-interrupted')), false);
});

test('a failed legacy update removes a newly created management file', () => {
  const f = fixture(); f.seedOld(false);
  assert.notEqual(f.run('legacy-interrupted', { TEST_INTERRUPT_AFTER_MARKER: '1' }).status, 0);
  assert.equal(read(path.join(f.app, 'current-release')), 'old');
  assert.equal(read(path.join(f.state, 'current')), 'old');
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml.next-legacy-interrupted')), false);
  assert.equal(fs.existsSync(path.join(f.app, 'docker-compose.yaml.rollback-legacy-interrupted')), false);
});
test('unsafe targets and an unowned populated directory are rejected', () => {
  const f = fixture(); assert.notEqual(f.run('unsafe-target', {}, '/volume1/docker/m0n_r').status, 0);
  assert.equal(fs.existsSync(f.app), false);
  fs.mkdirSync(f.app); fs.writeFileSync(path.join(f.app, 'keep.txt'), 'untouched');
  assert.notEqual(f.run('unowned-folder').status, 0);
  assert.equal(read(path.join(f.app, 'keep.txt')), 'untouched');
});

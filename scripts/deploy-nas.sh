#!/bin/sh
# Called over SSH by deploy-nas.ps1. Credentials are never stored or piped.
set -eu
umask 022

die() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }
log() { printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

[ "$#" -eq 8 ] || die 'Expected: app_root archive release project image port revision mode'
app_root=$1
archive=$2
release=$3
project=$4
image=$5
http_port=$6
revision=$7
mode=$8

printf '%s\n' "$app_root" | grep -Eq '^/volume[0-9]+/docker/developer-john(-[a-z0-9_-]+)?$' || die 'Use a dedicated developer-john directory under /volumeN/docker.'
for name in "$project" "$image"; do
  printf '%s\n' "$name" | grep -Eq '^developer-john(-[a-z0-9_-]+)?$' || die 'Use independent developer-john project and image names.'
done
[ "$(basename "$app_root")" = "$project" ] || die 'The app directory name must equal ProjectName.'
printf '%s\n' "$release" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9_-]+$' || die 'Invalid release ID.'
printf '%s\n' "$revision" | grep -Eq '^[0-9a-f]{40}$' || die 'Expected the full pushed Git commit.'
case "$http_port" in ''|*[!0-9]*) die 'Invalid HTTP port.' ;; esac
[ "$http_port" -ge 1024 ] && [ "$http_port" -le 65535 ] || die 'Use an unprivileged HTTP port.'
case "$mode" in check|deploy) ;; *) die 'Invalid deployment mode.' ;; esac
[ "$(uname -m)" = x86_64 ] || die 'This deployment targets a linux/amd64 NAS.'
app_parent=$(dirname "$app_root")
[ -d "$app_parent" ] && [ ! -L "$app_parent" ] || die 'The Docker parent directory is missing or is a symlink.'
[ "$(cd "$app_parent" && pwd -P)" = "$app_parent" ] || die 'Use the canonical Docker parent path.'
[ ! -L "$app_root" ] || die 'The app directory must not be a symlink.'
if [ -e "$app_root" ]; then
  [ -d "$app_root" ] && [ "$(cd "$app_root" && pwd -P)" = "$app_root" ] || die 'Invalid existing app directory.'
fi

PATH="/usr/local/bin:/usr/bin:/bin:/var/packages/ContainerManager/target/usr/bin:$PATH"
export PATH
docker_bin=$(command -v docker) || die 'Docker is unavailable. Check Container Manager.'
"$docker_bin" info >/dev/null 2>&1 || die 'Cannot access Docker. Use the configured administrator account and sudo.'
command -v curl >/dev/null 2>&1 || die 'curl is required for HTTP verification.'
if "$docker_bin" compose version >/dev/null 2>&1; then
  compose_kind=plugin
else
  compose_bin=$(command -v docker-compose) || die 'Docker Compose is unavailable.'
  "$compose_bin" version >/dev/null 2>&1 || die 'Docker Compose is unavailable.'
  compose_kind=standalone
fi
compose_at() {
  compose_dir=$1
  shift
  if [ "$compose_kind" = plugin ]; then
    "$docker_bin" compose -p "$project" --env-file "$compose_dir/.env" --project-directory "$compose_dir" -f "$compose_dir/compose.nas.yaml" "$@"
  else
    "$compose_bin" -p "$project" --env-file "$compose_dir/.env" --project-directory "$compose_dir" -f "$compose_dir/compose.nas.yaml" "$@"
  fi
}
container_id() {
  "$docker_bin" ps -aq --filter "label=com.docker.compose.project=$project" --filter 'label=com.docker.compose.service=web'
}
verify_http() {
  for route in / /en /services /en/services /privacy /en/privacy /services/game/the-division-2 /en/services/game/the-division-2 /services/game/the-division-2/red-moon-unleashed-2026 /en/services/game/the-division-2/red-moon-unleashed-2026; do
    code=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --max-time 10 "http://127.0.0.1:$http_port$route") || return 1
    [ "$code" = 200 ] || { log "Unexpected HTTP $code at $route"; return 1; }
  done
}
wait_ready() {
  attempts=0
  while [ "$attempts" -lt 60 ]; do
    ready_container=$(container_id)
    if [ -n "$ready_container" ]; then
      health=$("$docker_bin" inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$ready_container" 2>/dev/null || printf unknown)
      if [ "$health" = healthy ] && verify_http; then return 0; fi
      case "$health" in exited|dead|unhealthy) return 1 ;; esac
    fi
    attempts=$((attempts + 1))
    sleep 2
  done
  return 1
}

owner_file="$app_root/.deployment-owner"
if [ -e "$owner_file" ]; then
  [ -f "$owner_file" ] && [ ! -L "$owner_file" ] && [ "$(cat "$owner_file")" = "$project" ] || die 'Unexpected deployment owner marker.'
fi
previous_release=''
if [ -f "$app_root/current-release" ]; then
  [ ! -L "$app_root/current-release" ] || die 'Release state must not be a symlink.'
  previous_release=$(cat "$app_root/current-release")
  printf '%s\n' "$previous_release" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9_-]+$' || die 'Invalid existing release state.'
  previous_dir="$app_root/releases/$previous_release"
  [ -d "$previous_dir" ] && [ ! -L "$previous_dir" ] && [ -f "$previous_dir/compose.nas.yaml" ] && [ -f "$previous_dir/.env" ] || die 'Previous release files are missing.'
  [ "$(compose_at "$previous_dir" config --services)" = web ] || die 'Unexpected existing service configuration.'
else
  [ -z "$("$docker_bin" ps -aq --filter "label=com.docker.compose.project=$project")" ] || die 'A project with this name already exists without matching deployment state.'
  if [ -d "$app_root" ] && [ -n "$(ls -A "$app_root")" ]; then
    [ -f "$owner_file" ] || die 'The first installation requires an empty app directory.'
    for existing_entry in "$app_root"/* "$app_root"/.[!.]*; do
      [ -e "$existing_entry" ] || continue
      case "$(basename "$existing_entry")" in releases|logs|.deployment-owner|.deploy-lock) ;; *) die 'Unexpected files in the initial deployment directory.' ;; esac
    done
  fi
  if command -v netstat >/dev/null 2>&1 && netstat -lnt 2>/dev/null | awk -v suffix=":$http_port" '$4 ~ (suffix "$") {found=1} END {exit !found}'; then die 'The HTTP port is already in use.'; fi
fi
for port_container in $("$docker_bin" ps -q --filter "publish=$http_port"); do
  port_project=$("$docker_bin" inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' "$port_container")
  [ "$port_project" = "$project" ] || die 'Another Compose project already uses this port.'
done
if [ "$mode" = check ]; then
  if [ -n "$previous_release" ]; then
    wait_ready || die 'The existing deployment is not healthy.'
    log "Existing release is healthy: $previous_release"
  else
    log "Ready for the first $project deployment on NAS loopback port $http_port."
  fi
  exit 0
fi

[ -f "$archive" ] && [ ! -L "$archive" ] || die 'The source archive is missing or is a symlink.'
archive=$(cd "$(dirname "$archive")" && pwd -P)/$(basename "$archive")
mkdir -p "$app_root"
printf '%s\n' "$project" > "$owner_file"
for state_dir in releases logs; do
  [ ! -L "$app_root/$state_dir" ] || die 'Deployment directories must not be symlinks.'
  mkdir -p "$app_root/$state_dir"
done
lock_dir="$app_root/.deploy-lock"
[ ! -L "$lock_dir" ] || die 'The deployment lock must not be a symlink.'
mkdir "$lock_dir" 2>/dev/null || die 'Another deployment holds the lock; inspect it before retrying.'
printf '%s\n' "pid=$$ release=$release" > "$lock_dir/owner"
release_dir="$app_root/releases/$release"
changed=0
completed=0
finish() {
  result=$?
  trap - EXIT HUP INT TERM
  if [ "$completed" != 1 ] && [ "$changed" = 1 ]; then
    log 'The new deployment failed; restoring the previous state.'
    if [ -n "$previous_release" ]; then
      if compose_at "$previous_dir" up -d --no-build web && wait_ready; then
        if printf '%s\n' "$previous_release" > "$app_root/current-release.rollback-$release" && mv "$app_root/current-release.rollback-$release" "$app_root/current-release"; then
          log "Previous release restored: $previous_release"
        else
          printf '\nERROR: The container was restored but release state could not be restored.\n' >&2
        fi
      else
        printf '\nERROR: Restore failed. Inspect project %s and release %s.\n' "$project" "$previous_release" >&2
      fi
    else
      if compose_at "$release_dir" down; then
        rm -f "$app_root/current-release"
      else
        printf '\nERROR: Could not stop the failed initial project.\n' >&2
      fi
    fi
    result=1
  fi
  rm -f "$app_root/current-release.next-$release" "$app_root/current-release.rollback-$release"
  rm -f "$lock_dir/owner"
  rmdir "$lock_dir" 2>/dev/null || true
  exit "$result"
}
trap finish EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

[ ! -e "$release_dir" ] || die 'This release already exists.'
mkdir "$release_dir"
tar -tzf "$archive" > "$app_root/logs/$release.files"
tar -tvzf "$archive" > "$app_root/logs/$release.types"
if grep -v '^[d-]' "$app_root/logs/$release.types" | grep -q .; then die 'The archive may contain only directories and regular files.'; fi
while IFS= read -r entry; do
  case "$entry" in
    ''|/*|*'\'*|../*|*/../*|*/..|.git|.git/*|node_modules/*|.next/*|.cache/*|*.pem|*.key|*.p12|*.pfx|deploy.nas.local.json) die "Unsafe archive entry: $entry" ;;
    .env.example|.env.nas.example) ;;
    .env*|*/.env*) die "Private environment file in archive: $entry" ;;
  esac
done < "$app_root/logs/$release.files"
tar -xzf "$archive" -C "$release_dir"
[ -z "$(find "$release_dir" -type l -print)" ] || die 'The archive must not contain symlinks.'
[ -z "$(find "$release_dir" -type f -links +1 -print)" ] || die 'The archive must not contain hardlinks.'
for required in Dockerfile compose.nas.yaml package.json package-lock.json; do
  [ -f "$release_dir/$required" ] || die "Missing source file: $required"
done
[ -d "$release_dir/src" ] && [ -d "$release_dir/public" ] || die 'Missing src or public.'
cat > "$release_dir/.env" <<EOF
COMPOSE_PROJECT_NAME=$project
JOHNWEST_IMAGE=$image:$release
JOHNWEST_BIND_ADDRESS=127.0.0.1
JOHNWEST_PORT=$http_port
EOF
[ "$(compose_at "$release_dir" config --services)" = web ] || die 'The release must contain only the web service.'
[ "$(compose_at "$release_dir" config --images)" = "$image:$release" ] || die 'Unexpected image configuration.'
compose_at "$release_dir" config > "$app_root/logs/$release.compose.yaml"
if grep -Eq '^[[:space:]]*volumes:' "$app_root/logs/$release.compose.yaml"; then die 'Host mounts require a separate deployment plan.'; fi

log "Building pushed commit $revision. Existing services remain running."
build_log="$app_root/logs/$release.build.log"
if ! "$docker_bin" build --platform linux/amd64 --build-arg NEXT_PUBLIC_SITE_URL=https://developer-john.com --label "org.opencontainers.image.revision=$revision" --label "org.opencontainers.image.source=https://github.com/JooWon0712/developer-john" -t "$image:$release" "$release_dir" > "$build_log" 2>&1; then
  tail -n 100 "$build_log" >&2
  die 'Image build failed before replacing the app.'
fi
[ "$("$docker_bin" image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$image:$release")" = "$revision" ] || die 'Image revision verification failed.'
log 'Image built. Starting the web service.'
changed=1
compose_at "$release_dir" up -d --no-build web
new_container=$(container_id)
[ -n "$new_container" ] && [ "$(printf '%s\n' "$new_container" | wc -l | tr -d ' ')" = 1 ] || die 'Expected one web container.'
[ "$("$docker_bin" inspect --format '{{len .Mounts}}' "$new_container")" = 0 ] || die 'Unexpected container mounts.'
wait_ready || { compose_at "$release_dir" logs --tail=80 web >&2; die 'Health or HTTP verification failed.'; }
printf 'revision=%s\nrelease=%s\nport=%s\n' "$revision" "$release" "$http_port" > "$app_root/logs/$release.result"
printf '%s\n' "$release" > "$app_root/current-release.next-$release"
mv "$app_root/current-release.next-$release" "$app_root/current-release"
completed=1
log "Deployment healthy: revision=$revision release=$release NAS loopback port=$http_port"

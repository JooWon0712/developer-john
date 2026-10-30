#!/bin/sh
# Register DSM metadata only. Never build, start, stop, clean or delete a project.
set -eu
umask 077

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
[ "$#" -eq 3 ] || die 'Expected: app_root project release'
app_root=$1
project=$2
release=$3
printf '%s\n' "$app_root" | grep -Eq '^/volume[0-9]+/docker/developer-john(-[a-z0-9_-]+)?$' || die 'Use a dedicated developer-john app directory.'
printf '%s\n' "$project" | grep -Eq '^developer-john(-[a-z0-9_-]+)?$' || die 'Use a developer-john project name.'
[ "$(basename "$app_root")" = "$project" ] || die 'The app directory and project name must match.'
printf '%s\n' "$release" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9_-]+$' || die 'Invalid release ID.'
share_path="/docker/$project"
[ "$(id -u)" = 0 ] || die 'DSM project registration requires root.'
[ -d "$app_root" ] && [ ! -L "$app_root" ] && [ "$(cd "$app_root" && pwd -P)" = "$app_root" ] || die 'Use the canonical app directory.'
for required in .deployment-owner current-release docker-compose.yaml "logs/$release.compose.yaml"; do
  [ -f "$app_root/$required" ] && [ ! -L "$app_root/$required" ] || die 'The deployed release or resolved Compose file is missing.'
done
[ "$(cat "$app_root/.deployment-owner")" = "$project" ] || die 'The app directory belongs to another deployment.'
[ "$(cat "$app_root/current-release")" = "$release" ] || die 'The requested release is not current.'
manifest="$app_root/docker-compose.yaml"
cmp -s "$manifest" "$app_root/logs/$release.compose.yaml" || die 'The management Compose file does not match the current resolved release.'
[ -d "$app_root/logs" ] && [ ! -L "$app_root/logs" ] || die 'Invalid deployment log directory.'
log_file="$app_root/logs/$release.registration.log"
[ ! -L "$log_file" ] || die 'The registration log must not be a symlink.'
: >> "$log_file"
chmod 0644 "$log_file"
log() { printf '%s\n' "$*" | tee -a "$log_file"; }

api_bin=$(command -v synowebapi || true)
if [ -z "$api_bin" ] && [ -x /usr/syno/bin/synowebapi ]; then api_bin=/usr/syno/bin/synowebapi; fi
[ -n "$api_bin" ] || die 'The installed DSM synowebapi command is unavailable.'
jq_bin=$(command -v jq) || die 'jq is required for DSM project registration.'
docker_bin=$(command -v docker) || die 'Docker is required for registration verification.'
scratch=$(mktemp -d "${TMPDIR:-/tmp}/developer-john-register.XXXXXX") || die 'Cannot create private registration scratch files.'
snapshot_ready=0

container_snapshot() {
  output=$1
  "$docker_bin" ps -aq --no-trunc > "$scratch/container-ids" || return 1
  : > "$scratch/container-lines"
  while IFS= read -r container; do
    [ -n "$container" ] || continue
    printf '%s\n' "$container" | grep -Eq '^[0-9a-f]{12,64}$' || return 1
    "$docker_bin" inspect --format '{"id":{{json .Id}},"project":{{json (index .Config.Labels "com.docker.compose.project")}},"service":{{json (index .Config.Labels "com.docker.compose.service")}},"image":{{json .Config.Image}},"running":{{json .State.Running}}}' "$container" >> "$scratch/container-lines" || return 1
  done < "$scratch/container-ids"
  "$jq_bin" -sS 'sort_by(.id)' "$scratch/container-lines" > "$output"
}

finish() {
  result=$?
  trap - EXIT HUP INT TERM
  if [ "$snapshot_ready" = 1 ]; then
    if container_snapshot "$scratch/containers-after.json" && cmp -s "$scratch/containers-before.json" "$scratch/containers-after.json"; then
      log 'Verified: own and other containers retain the same IDs, Compose labels, images and running states.'
    else
      log 'ERROR: Container state changed during registration. No recovery actions were attempted.' >&2
      result=1
    fi
  fi
  rm -f "$scratch"/*
  rmdir "$scratch" 2>/dev/null || true
  exit "$result"
}
trap finish EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

api_call() {
  api_method=$1
  api_output=$2
  shift 2
  case "$api_method" in list|get|create) ;; *) die 'Unsupported metadata operation.' ;; esac
  if ! "$api_bin" --exec api=SYNO.Docker.Project version=1 "method=$api_method" "$@" > "$api_output" 2> "$scratch/api-stderr"; then
    die "DSM Project $api_method failed or is unavailable. No other API actions were attempted."
  fi
  if ! "$jq_bin" -e '.success == true' "$api_output" >/dev/null 2>&1; then
    api_code=$("$jq_bin" -r '.error.code // "unknown"' "$api_output" 2>/dev/null || printf unknown)
    case "$api_code" in ''|*[!0-9]*) api_code=unknown ;; esac
    die "DSM Project $api_method was rejected or unsupported (code=$api_code)."
  fi
}
json_string() { "$jq_bin" -cn --arg value "$1" '$value'; }
check_list() { "$jq_bin" -e '.data | type == "object"' "$1" >/dev/null || die 'Unsupported DSM project list format.'; }
project_id() {
  matches=$("$jq_bin" -r --arg project "$project" '.data | to_entries | map(select(.value.name == $project)) | length' "$1")
  [ "$matches" -le 1 ] || die 'More than one DSM project has this name.'
  "$jq_bin" -r --arg project "$project" '.data | to_entries[] | select(.value.name == $project) | .key' "$1"
}
check_record() {
  "$jq_bin" -e --arg project "$project" --arg root "$app_root" --arg share "$share_path" '
    .name == $project and
    ((.share_path // "") as $s | (.path // "") as $p |
      ($s == "" or $s == $share) and
      ($p == "" or $p == $root or $p == $share or $p == ($root + "/docker-compose.yaml") or $p == ($share + "/docker-compose.yaml")) and
      ($s == $share or $p == $root or $p == $share or $p == ($root + "/docker-compose.yaml") or $p == ($share + "/docker-compose.yaml")))
  ' "$1" >/dev/null || die 'The DSM project name or path does not match this deployment.'
}
list_summary() {
  "$jq_bin" -c '.data | to_entries | map({id: .key, name: .value.name, status: .value.status, container_count: ((.value.containerIds // []) | length)}) | sort_by(.id)' "$1"
}

container_snapshot "$scratch/containers-before.json" || die 'Cannot inspect existing containers safely.'
snapshot_ready=1
"$jq_bin" -e --arg project "$project" --arg release "$release" '
  [.[] | select(.project == $project and .service == "web")] as $own |
  ($own | length) == 1 and $own[0].running == true and ($own[0].image | endswith(":" + $release))
' "$scratch/containers-before.json" >/dev/null || die 'The current running web container does not match the requested release.'
own_ids=$("$jq_bin" -c --arg project "$project" '[.[] | select(.project == $project and .service == "web") | .id]' "$scratch/containers-before.json")
api_call list "$scratch/projects-before.json"
check_list "$scratch/projects-before.json"
log "Projects before: $(list_summary "$scratch/projects-before.json")"
registered_id=$(project_id "$scratch/projects-before.json")
if [ -n "$registered_id" ]; then
  "$jq_bin" -c --arg id "$registered_id" '.data[$id]' "$scratch/projects-before.json" > "$scratch/record.json"
  check_record "$scratch/record.json"
  log 'Reusing the existing DSM project registration.'
else
  name_json=$(json_string "$project")
  path_json=$(json_string "$share_path")
  content_json=$("$jq_bin" -Rs . "$manifest")
  api_call create "$scratch/create.json" "name=$name_json" "share_path=$path_json" "content=$content_json" enable_service_portal=false 'service_portal_name=""' service_portal_port=0 'service_portal_protocol=""'
  log 'Created DSM project metadata; no container actions were requested.'
fi
api_call list "$scratch/projects-after.json"
check_list "$scratch/projects-after.json"
log "Projects after: $(list_summary "$scratch/projects-after.json")"
registered_id=$(project_id "$scratch/projects-after.json")
[ -n "$registered_id" ] || die 'The project was not present after registration.'
printf '%s\n' "$registered_id" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$' || die 'Unsupported DSM project identifier.'
"$jq_bin" -c --arg id "$registered_id" '.data[$id]' "$scratch/projects-after.json" > "$scratch/record.json"
check_record "$scratch/record.json"
id_json=$(json_string "$registered_id")
attempt=0
while :; do
  api_call get "$scratch/project-detail.json" "id=$id_json"
  "$jq_bin" -c '.data' "$scratch/project-detail.json" > "$scratch/record.json"
  check_record "$scratch/record.json"
  if ! "$jq_bin" -e 'has("containerIds")' "$scratch/record.json" >/dev/null; then
    log 'DSM does not expose containerIds; registration name and path were verified.'
    break
  fi
  "$jq_bin" -e '.containerIds | type == "array"' "$scratch/record.json" >/dev/null || die 'Unsupported DSM container association format.'
  if "$jq_bin" -e --argjson own "$own_ids" '($own - .containerIds) | length == 0' "$scratch/record.json" >/dev/null; then
    log 'Verified: DSM associates this project with the existing web container.'
    break
  fi
  attempt=$((attempt + 1))
  [ "$attempt" -lt 10 ] || die 'DSM registration exists but does not reference the deployed web container.'
  sleep 1
done
log "DSM project metadata verified: project=$project release=$release"

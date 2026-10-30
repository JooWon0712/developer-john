[CmdletBinding()]
param(
    [string]$ConfigPath = '',
    [switch]$PackageOnly,
    [switch]$Check
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
if ($PackageOnly -and $Check) { throw 'Choose either -PackageOnly or -Check.' }
$taskRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskDist = Join-Path $taskRoot 'dist'
[System.IO.Directory]::CreateDirectory($taskDist) | Out-Null
$taskRelease = '{0}-{1}' -f [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssZ'), ([Guid]::NewGuid().ToString('N').Substring(0, 6))
$taskRevision = 'unknown'
$taskMode = if ($Check) { 'check' } elseif ($PackageOnly) { 'package' } else { 'deploy' }
$taskStatus = 'failed'
$taskExitCode = 0
$taskHttpPort = $null

function Invoke-TaskCommand {
    param([string]$Executable, [string[]]$Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        $script:taskExitCode = $LASTEXITCODE
        throw "Command failed (exit $LASTEXITCODE)."
    }
}

function ConvertTo-ShellArgument {
    param([string]$Value)
    if ($Value -match "['\x00-\x1f\x7f]") { throw 'Unsafe remote argument.' }
    return "'$Value'"
}

function Get-TaskNode {
    $taskNodeCommand = Get-Command node -CommandType Application -ErrorAction SilentlyContinue
    if ($taskNodeCommand) { return $taskNodeCommand.Source }
    $taskBundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
    if (Test-Path -LiteralPath $taskBundledNode -PathType Leaf) { return $taskBundledNode }
    throw 'Node.js 24 and installed project dependencies are required.'
}

function Assert-CleanRevision {
    $taskChanges = & git status --porcelain=v1 --untracked-files=normal
    if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect the Git worktree.' }
    if ($taskChanges) { throw 'Commit and push all source changes before packaging.' }
    $taskHead = & git rev-parse --verify HEAD
    if ($LASTEXITCODE -ne 0 -or $taskHead -ne $script:taskRevision) { throw 'The selected Git revision changed.' }
    $taskRemoteHead = & git rev-parse --verify refs/remotes/origin/main
    if ($LASTEXITCODE -ne 0 -or $taskRemoteHead -ne $script:taskRevision) {
        throw 'HEAD must equal origin/main. Commit and push explicitly first.'
    }
}

function Assert-SourcePath {
    param([string]$SourcePath)
    if ($SourcePath -notmatch '^[A-Za-z0-9_.@+\[\]()-]+(?:/[A-Za-z0-9_.@+\[\]()-]+)*/?$' -or
        $SourcePath -match '(^|/)\.{1,2}(/|$)') { throw 'The archive contains an unsupported source path.' }
    if ($SourcePath -match '(^|/)(\.git|node_modules|\.next|\.cache|dist|artifacts|coverage|\.ssh|\.aws|\.codex|\.agents)(/|$)' -or
        $SourcePath -match '^data(/|$)' -or
        $SourcePath -match '(^|/)(deploy\.nas\.local\.json|id_(rsa|dsa|ecdsa|ed25519)(\.pub)?|credentials(\.[^/]*)?|\.npmrc|\.netrc)$' -or
        $SourcePath -match '\.(pem|key|p12|pfx|db|sqlite|sqlite3|log|tar|tar\.gz)$') {
        throw 'A credential, runtime file or generated directory was found in committed source.'
    }
    $taskBasename = ($SourcePath.TrimEnd('/') -split '/')[-1]
    if ($taskBasename -match '^\.env(?:\.|$)' -and $taskBasename -notmatch '^\.env(?:\.[A-Za-z0-9_-]+)*\.example$') {
        throw 'Only tracked .env example files may be packaged.'
    }
}

function Assert-CommittedSource {
    $taskTree = & git -c core.quotepath=false ls-tree -r HEAD
    if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect committed source.' }
    foreach ($taskEntry in $taskTree) {
        if ($taskEntry -notmatch '^([0-9]{6}) blob [0-9a-f]{40,64}\t(.+)$') { throw 'Submodules and unsupported Git entries are not deployable.' }
        $taskEntryMode = $Matches[1]
        $taskEntryPath = $Matches[2]
        if ($taskEntryMode -eq '120000') { throw 'Symbolic links must not be packaged.' }
        Assert-SourcePath $taskEntryPath
    }
    # Report no file contents: this is a guard against common committed credential formats.
    $taskCredentialPaths = & git grep -I -l -E -- '(-----BEGIN ([A-Z0-9]+ )*PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16})' HEAD -- .
    $taskGrepExit = $LASTEXITCODE
    if ($taskGrepExit -eq 0 -and $taskCredentialPaths) { throw 'A possible committed credential was found; review it before packaging.' }
    if ($taskGrepExit -gt 1) { throw 'Cannot audit committed source for credentials.' }
}

Push-Location -LiteralPath $taskRoot
try {
    Get-Command git -CommandType Application -ErrorAction Stop | Out-Null
    $taskRevision = & git rev-parse --verify HEAD
    if ($LASTEXITCODE -ne 0 -or $taskRevision -notmatch '^[0-9a-f]{40,64}$') { throw 'A committed Git revision is required.' }
    $taskRelease = '{0}-{1}' -f $taskRelease, $taskRevision.Substring(0, 8)
    Write-Host "Release: $taskRelease ($taskMode)"

    if (-not $Check) {
        # Ignored local secrets may remain on disk; git archive never includes them.
        Invoke-TaskCommand git @('fetch', '--quiet', 'origin', 'main')
        Assert-CleanRevision
        $taskNode = Get-TaskNode
        if (-not (Test-Path -LiteralPath 'node_modules/typescript/bin/tsc' -PathType Leaf)) { throw 'Run npm ci before packaging.' }
        Write-Host '[1/4] Checking TypeScript and the existing tests...'
        Invoke-TaskCommand $taskNode @('node_modules/typescript/bin/tsc', '--noEmit', '--incremental', 'false')
        Invoke-TaskCommand $taskNode @('--test', 'scripts/test-analytics.mjs', 'scripts/test-i18n.mjs', 'scripts/test-ikigai.mjs', 'scripts/test-red-moon.mjs')
        Assert-CleanRevision
        Assert-CommittedSource
        Get-Command tar -CommandType Application -ErrorAction Stop | Out-Null
        $taskArchive = Join-Path $taskDist "developer-john-$taskRelease.tar.gz"
        Write-Host '[2/4] Packaging the committed source only...'
        Invoke-TaskCommand git @('archive', '--format=tar.gz', "--output=$taskArchive", 'HEAD')
        $taskArchiveEntries = & tar -tzf $taskArchive
        if ($LASTEXITCODE -ne 0 -or -not $taskArchiveEntries) { throw 'Cannot inspect the source archive.' }
        foreach ($taskArchiveEntry in $taskArchiveEntries) { Assert-SourcePath $taskArchiveEntry }
        Assert-CleanRevision
    }

    if (-not $PackageOnly) {
        if (-not $ConfigPath) { $ConfigPath = Join-Path $taskRoot 'deploy.nas.local.json' }
        if (-not [System.IO.Path]::IsPathRooted($ConfigPath)) { $ConfigPath = Join-Path $taskRoot $ConfigPath }
        if (-not (Test-Path -LiteralPath $ConfigPath -PathType Leaf)) { throw 'Copy deploy.nas.example.json to deploy.nas.local.json and fill in the connection settings.' }
        try { $taskConfig = Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json } catch { throw 'Invalid deployment config JSON.' }
        $taskKeys = @('NasHost', 'SshUser', 'SshPort', 'IdentityFile', 'RemotePath', 'ProjectName', 'ImageName', 'HttpPort', 'UseSudo')
        foreach ($taskKey in $taskKeys) {
            if ($taskConfig.PSObject.Properties.Name -notcontains $taskKey) { throw "Missing deployment config: $taskKey" }
        }
        foreach ($taskKey in $taskConfig.PSObject.Properties.Name) {
            if ($taskKeys -notcontains $taskKey) { throw 'The deployment config contains an unsupported setting. Do not store passwords in it.' }
        }
        if ($taskConfig.NasHost -notmatch '^[A-Za-z0-9][A-Za-z0-9.-]*$' -or $taskConfig.NasHost -eq 'example.invalid') { throw 'Fill in a valid NAS hostname or LAN IPv4 address.' }
        if ($taskConfig.SshUser -notmatch '^[A-Za-z0-9_][A-Za-z0-9_.-]*$') { throw 'Fill in the DSM SSH login account.' }
        if ($taskConfig.RemotePath -notmatch '^/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/[A-Za-z0-9_./-]+$' -or
            $taskConfig.RemotePath -match '(^|/)\.{1,2}(/|$)|//|/$') { throw 'RemotePath must be a canonical absolute app directory.' }
        foreach ($taskName in @('ProjectName', 'ImageName')) {
            if ($taskConfig.$taskName -notmatch '^[a-z0-9][a-z0-9_-]{0,62}$') { throw "Invalid $taskName." }
        }
        foreach ($taskPortName in @('SshPort', 'HttpPort')) {
            $taskPort = 0
            if (-not [int]::TryParse([string]$taskConfig.$taskPortName, [ref]$taskPort) -or $taskPort -lt 1 -or $taskPort -gt 65535) { throw "Invalid $taskPortName." }
        }
        if ($taskConfig.UseSudo -isnot [bool]) { throw 'UseSudo must be true or false.' }
        $taskHttpPort = [int]$taskConfig.HttpPort
        $taskSsh = (Get-Command ssh -CommandType Application -ErrorAction Stop).Source
        $taskScp = (Get-Command scp -CommandType Application -ErrorAction Stop).Source
        $taskSharedOptions = @('-o', 'StrictHostKeyChecking=yes', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=3')
        if ($taskConfig.IdentityFile) {
            $taskIdentity = [string]$taskConfig.IdentityFile
            if (-not [System.IO.Path]::IsPathRooted($taskIdentity)) { $taskIdentity = Join-Path $taskRoot $taskIdentity }
            if (-not (Test-Path -LiteralPath $taskIdentity -PathType Leaf)) { throw 'IdentityFile does not exist.' }
            $taskSharedOptions += @('-i', $taskIdentity, '-o', 'IdentitiesOnly=yes')
        }
        $taskDestination = '{0}@{1}' -f $taskConfig.SshUser, $taskConfig.NasHost
        $taskSshOptions = $taskSharedOptions + @('-p', [string][int]$taskConfig.SshPort)
        # SCP avoids requiring DSM's separate SFTP service.
        $taskScpOptions = $taskSharedOptions + @('-O', '-P', [string][int]$taskConfig.SshPort)
        $taskUploadDirectory = ".developer-john-deploy/$taskRelease"
        if ($taskUploadDirectory -notmatch '^\.developer-john-deploy/[A-Za-z0-9][A-Za-z0-9._-]+$') { throw 'Invalid release upload directory.' }
        $taskBootstrap = 'umask 077; cd || exit 1; mkdir -p {0}' -f (ConvertTo-ShellArgument $taskUploadDirectory)
        Write-Host '[3/4] Uploading through the existing SSH key or agent...'
        Invoke-TaskCommand $taskSsh ($taskSshOptions + @($taskDestination, $taskBootstrap))
        $taskRunner = Join-Path $taskDist "deploy-$taskRelease.sh"
        $taskRunnerText = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot 'deploy-nas.sh')).Replace("`r`n", "`n")
        [System.IO.File]::WriteAllText($taskRunner, $taskRunnerText, [System.Text.UTF8Encoding]::new($false))
        Invoke-TaskCommand $taskScp ($taskScpOptions + @($taskRunner, "${taskDestination}:$taskUploadDirectory/deploy-nas.sh"))
        if (-not $Check) { Invoke-TaskCommand $taskScp ($taskScpOptions + @($taskArchive, "${taskDestination}:$taskUploadDirectory/source.tar.gz")) }
        $taskRemoteTail = @($taskRelease, [string]$taskConfig.ProjectName, [string]$taskConfig.ImageName, [string]$taskHttpPort, $taskRevision, $taskMode) | ForEach-Object { ConvertTo-ShellArgument $_ }
        $taskPrivilege = if ($taskConfig.UseSudo) { 'sudo ' } else { '' }
        # Resolve the stage before sudo changes HOME; never pass a password to SSH or sudo.
        $taskRemoteCommand = 'cd || exit 1; task_stage="$(pwd -P)/"{0}; {1}sh "$task_stage/deploy-nas.sh" {2} "$task_stage/source.tar.gz" {3}' -f (ConvertTo-ShellArgument $taskUploadDirectory), $taskPrivilege, (ConvertTo-ShellArgument ([string]$taskConfig.RemotePath)), ($taskRemoteTail -join ' ')
        Write-Host '[4/4] Running NAS checks. Enter the sudo password directly in this terminal if prompted.'
        Invoke-TaskCommand $taskSsh ($taskSshOptions + @('-tt', $taskDestination, $taskRemoteCommand))
    }
    $taskStatus = 'succeeded'
    Write-Host "Completed: $taskRelease ($taskMode)"
}
catch {
    if ($taskExitCode -eq 0) { $taskExitCode = 1 }
    Write-Warning $_.Exception.Message
}
finally {
    $taskResult = [ordered]@{ release = $taskRelease; mode = $taskMode; status = $taskStatus; exitCode = $taskExitCode; revision = $taskRevision; httpPort = $taskHttpPort; finishedAt = [DateTime]::UtcNow.ToString('o') }
    $taskResultPath = Join-Path $taskDist "$taskRelease.result"
    [System.IO.File]::WriteAllText($taskResultPath, ($taskResult | ConvertTo-Json), [System.Text.UTF8Encoding]::new($false))
    Write-Host "Result: dist/$taskRelease.result"
    Pop-Location
}
exit $taskExitCode

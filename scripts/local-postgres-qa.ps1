param([ValidateSet('Start','Stop','Status')][string]$Action = 'Status')
$ErrorActionPreference = 'Stop'
$taskPgRoot = Join-Path $env:TEMP 'shiftsmart-postgres-17-qa'
$taskPgData = Join-Path $taskPgRoot 'data'
$taskPgCtl = Join-Path $taskPgRoot 'pgsql/bin/pg_ctl.exe'
if (!(Test-Path -LiteralPath (Join-Path $taskPgData 'PG_VERSION'))) { throw 'The isolated QA cluster has not been initialized in this TEMP directory.' }
if ($Action -eq 'Status') { & $taskPgCtl -D $taskPgData status; exit $LASTEXITCODE }
if ($Action -eq 'Stop') { & $taskPgCtl -D $taskPgData -m fast -w stop; exit $LASTEXITCODE }
& $taskPgCtl -D $taskPgData status *> $null
if ($LASTEXITCODE -eq 0) { 'QA PostgreSQL is already running.'; exit 0 }
if (Get-NetTCPConnection -LocalPort 55432 -State Listen -ErrorAction SilentlyContinue) { throw 'Port 55432 is in use; no existing process was changed.' }
$taskPgProcess = Start-Process -FilePath $taskPgCtl -ArgumentList @('-D',('"'+$taskPgData+'"'),'-l',('"'+(Join-Path $taskPgRoot 'postgres.log')+'"'),'-o','"-h 127.0.0.1 -p 55432 -c max_connections=30 -c shared_buffers=32MB"','start','-w','-t','25') -WindowStyle Hidden -PassThru
if (!$taskPgProcess.WaitForExit(30000)) { throw 'QA PostgreSQL startup did not complete in time.' }
if ($taskPgProcess.ExitCode -ne 0) { throw 'QA PostgreSQL startup failed; inspect its TEMP log.' }
'QA PostgreSQL running on 127.0.0.1:55432. No Windows service was installed.'

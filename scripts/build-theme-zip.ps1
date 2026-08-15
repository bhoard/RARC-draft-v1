param(
	[string] $ThemeDirectory = "RARC-Theme",
	[string] $PackageName = "RARC-Theme.zip",
	[string] $PackageRoot = "rarc-theme"
)

$ErrorActionPreference = "Stop"

$themePath = Resolve-Path -LiteralPath $ThemeDirectory
$zipPath = Join-Path (Get-Location) $PackageName

$requiredFiles = @(
	"style.css",
	"functions.php",
	"theme.json"
)

foreach ($requiredFile in $requiredFiles) {
	$path = Join-Path $themePath.Path $requiredFile
	if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
		throw "Theme package cannot be built. Missing required file: $path"
	}
}

if (Test-Path -LiteralPath $zipPath) {
	Remove-Item -LiteralPath $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
	Get-ChildItem -LiteralPath $themePath -Recurse -File | ForEach-Object {
		$relative = $_.FullName.Substring($themePath.Path.Length + 1).Replace("\", "/")
		$entryName = "$PackageRoot/$relative"
		[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
	}
} finally {
	$zip.Dispose()
}

$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
	foreach ($requiredFile in $requiredFiles) {
		$entryName = "$PackageRoot/$requiredFile"
		if ($zip.Entries.FullName -notcontains $entryName) {
			throw "Theme package verification failed. Missing ZIP entry: $entryName"
		}
		"OK $entryName"
	}

	"Entries $($zip.Entries.Count)"
} finally {
	$zip.Dispose()
}

Get-Item -LiteralPath $zipPath | Format-List Name,Length,LastWriteTime

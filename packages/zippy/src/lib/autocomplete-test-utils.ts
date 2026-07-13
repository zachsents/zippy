import path from "node:path"
import { fileURLToPath } from "node:url"
import * as ts from "typescript"

export const completionMarker = "/* completion */"

const libDir = fileURLToPath(new URL(".", import.meta.url))
const sourceRoot = path.resolve(libDir, "..")
const packageRoot = path.resolve(sourceRoot, "..")
const configPath = path.join(packageRoot, "tsconfig.json")
const configFile = ts.readConfigFile(configPath, (fileName) =>
  ts.sys.readFile(fileName),
)

if (configFile.error) {
  throw new Error(
    ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"),
  )
}

const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  packageRoot,
)

export function getStringLiteralCompletionNames(source: string) {
  const markerIndex = source.indexOf(completionMarker)

  if (markerIndex === -1) {
    throw new Error(`Expected source to include ${completionMarker}.`)
  }

  const probeFile = path.join(sourceRoot, "__autocomplete_probe__.ts")
  const probeSource = source.replace(completionMarker, "")
  const fileNames = [...parsedConfig.fileNames, probeFile]

  const languageService = ts.createLanguageService({
    directoryExists: (directoryName) => ts.sys.directoryExists(directoryName),
    fileExists: (fileName) =>
      fileName === probeFile || ts.sys.fileExists(fileName),
    getCompilationSettings: () => parsedConfig.options,
    getCurrentDirectory: () => packageRoot,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    getDirectories: (directoryName) => ts.sys.getDirectories(directoryName),
    getScriptFileNames: () => fileNames,
    getScriptSnapshot: (fileName) => {
      if (fileName === probeFile) {
        return ts.ScriptSnapshot.fromString(probeSource)
      }

      if (!ts.sys.fileExists(fileName)) {
        return undefined
      }

      const fileText = ts.sys.readFile(fileName)

      return fileText === undefined
        ? undefined
        : ts.ScriptSnapshot.fromString(fileText)
    },
    getScriptVersion: () => "0",
    readDirectory: (...args) => ts.sys.readDirectory(...args),
    readFile: (fileName) =>
      fileName === probeFile ? probeSource : ts.sys.readFile(fileName),
    realpath: (fileName) => ts.sys.realpath?.(fileName) ?? fileName,
  })

  const completions = languageService.getCompletionsAtPosition(
    probeFile,
    markerIndex,
    {
      includeCompletionsForImportStatements: false,
      includeCompletionsForModuleExports: false,
      includeCompletionsWithInsertText: true,
    },
  )

  return (completions?.entries ?? [])
    .map((entry) => entry.name)
    .filter((name) => name.length > 0)
    .toSorted()
}

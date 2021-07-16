import stackTrace, { StackFrame } from "stack-trace"
import { codeFrameColumns } from "@babel/code-frame"
import {
  NullableMappedPosition,
  SourceMapConsumer,
  RawSourceMap,
  RawIndexMap,
} from "source-map"

const fs = require(`fs-extra`)
const path = require(`path`)
const chalk = require(`chalk`)
const { isNodeInternalModulePath } = require(`gatsby-core-utils`)

const gatsbyLocation = path.dirname(require.resolve(`gatsby/package.json`))
const reduxThunkLocation = path.dirname(
  require.resolve(`redux-thunk/package.json`)
)
const reduxLocation = path.dirname(require.resolve(`redux/package.json`))

const getNonGatsbyCallSite = (): StackFrame | undefined =>
  stackTrace
    .get()
    .find(
      callSite =>
        callSite &&
        callSite.getFileName() &&
        !callSite.getFileName().includes(gatsbyLocation) &&
        !callSite.getFileName().includes(reduxLocation) &&
        !callSite.getFileName().includes(reduxThunkLocation) &&
        !isNodeInternalModulePath(callSite.getFileName())
    )

interface ICodeFrame {
  fileName: string
  line: number
  column: number
  codeFrame: string
}

export const getNonGatsbyCodeFrame = ({
  highlightCode = true,
} = {}): null | ICodeFrame => {
  const callSite = getNonGatsbyCallSite()
  if (!callSite) {
    return null
  }

  const fileName = callSite.getFileName()
  const line = callSite.getLineNumber()
  const column = callSite.getColumnNumber()

  const code = fs.readFileSync(fileName, { encoding: `utf-8` })
  return {
    fileName,
    line,
    column,
    codeFrame: codeFrameColumns(
      code,
      {
        start: {
          line,
          column,
        },
      },
      {
        highlightCode,
      }
    ),
  }
}

export const getNonGatsbyCodeFrameFormatted = ({ highlightCode = true } = {}):
  | null
  | string => {
  const possibleCodeFrame = getNonGatsbyCodeFrame({
    highlightCode,
  })

  if (!possibleCodeFrame) {
    return null
  }

  const { fileName, line, column, codeFrame } = possibleCodeFrame
  return `File ${chalk.bold(`${fileName}:${line}:${column}`)}\n${codeFrame}`
}

interface IOriginalSourcePositionAndContent {
  sourcePosition: NullableMappedPosition | null
  sourceContent: string | null
}

export async function findOriginalSourcePositionAndContent(
  webpackSource: RawSourceMap | RawIndexMap | string,
  position: { line: number; column: number | null }
): Promise<IOriginalSourcePositionAndContent> {
  return await SourceMapConsumer.with(webpackSource, null, consumer => {
    const sourcePosition = consumer.originalPositionFor({
      line: position.line,
      column: position.column ?? 0,
    })

    if (!sourcePosition.source) {
      return {
        sourcePosition: null,
        sourceContent: null,
      }
    }

    const sourceContent: string | null =
      consumer.sourceContentFor(sourcePosition.source, true) ?? null

    return {
      sourcePosition,
      sourceContent,
    }
  })
}

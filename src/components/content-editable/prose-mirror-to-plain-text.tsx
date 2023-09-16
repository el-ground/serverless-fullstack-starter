import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

/*
    Constraints : 
        1. plainText and proseMirror serialization / deserialization
            plainText -> proseMirror -> plainText
            proseMirror -> plainText -> proseMirror

        2. plainText and proseMirror should generate similar output
            1-a. plainText render comparison
                plainText -> html
                plainText -> proseMirror -> html
            
            1-b. proseMirror output comparison
                proseMirror -> plainText -> html
                proseMirror -> html

        3. random pastes should work consistently (weak)
            html -> proseMirror -> html
            html -> proseMirror -> plainText -> html 
*/

/*
    Needs to work in conjunction with tiptap extensions!!!
*/
export const proseMirrorToPlainText = (rootNode: ProseMirrorNode): string => {
  /*
    Trim spaces before newlines!
*/

  // rootNode.
  const lines: string[] = []
  let currentLine: string[] = []

  rootNode.content.forEach((childNode) => {
    if (childNode.isBlock) {
      // iterate children
      childNode.content.forEach((grandChildNode) => {
        switch (grandChildNode.type.name) {
          case `text`:
            currentLine.push(grandChildNode.text || ``)
            break
          case `hardBreak`:
            const joinedLine = currentLine.join(``).trimEnd()
            lines.push(joinedLine) // commit current line
            currentLine = []
            break
          default:
            break
        }
      })

      const joinedLine = currentLine.join(``).trimEnd()
      lines.push(joinedLine) // commit current line
      currentLine = []
    }
  })

  const joinedTexts = lines.join(`\n`)
  // remove leading and trailing newlines / whitespaces
  const trimmedText = joinedTexts.trim()

  return trimmedText
}

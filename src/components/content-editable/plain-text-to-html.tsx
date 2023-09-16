import { encode } from 'html-entities'

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

// deserialize into top level blocks??
// plainText => generate HTML => feed to proseMirror
// if same method used for textBlock, things get easier.
/*
    Later, add the header feature.
    Just make header top N lines. logic simple.

    Should we add double newline paragraph feature? maybe, or not. We'll see.

    TODO render links! :) needs tag render context to replace words
*/
export const plainTextToHtml = (plainText: string): string => {
  // parse by newline
  const newlineSeparatedTexts = plainText.split(`\n`)
  const elements = []
  elements.push(`<p>`)
  newlineSeparatedTexts.forEach((text, index) => {
    const encodedText = encode(text)

    const trailingWhiteSpaceReplacedText = encodedText.replace(/ $/gu, `&nbsp;`)

    // const trailingWhiteSpaceReplacedText = encodedText.trimEnd()
    const firstWhiteSpaceReplacedText = trailingWhiteSpaceReplacedText.replace(
      /^ /gu,
      `&nbsp;`,
    )
    const whiteSpaceReplacedText = firstWhiteSpaceReplacedText.replace(
      / {2}/gu,
      ` &nbsp;`,
    )

    elements.push(whiteSpaceReplacedText)

    if (index !== newlineSeparatedTexts.length - 1) {
      elements.push(`<br>`)
    }
  })

  elements.push(`</p>`)
  const joinedString = elements.join(``)
  return joinedString
}

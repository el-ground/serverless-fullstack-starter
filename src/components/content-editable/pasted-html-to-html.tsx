export const pastedHTMLToHTML = (html: string) => {
  // console.log(html)
  // return html
  return html.replaceAll(`\n`, `<br/>`)
}

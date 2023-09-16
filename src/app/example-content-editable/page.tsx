'use client'
import React from 'react'
import { ContentEditable } from '@components/content-editable'

const ExampleContentEditablePage = () => {
  const [value, setValue] = React.useState<string>(``)
  return (
    <div>
      <ContentEditable onChange={setValue} />
      <div>value : {value}</div>
    </div>
  )
}

export default ExampleContentEditablePage

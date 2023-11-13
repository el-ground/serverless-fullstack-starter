import { toast } from 'react-toastify'

export interface EventWSelectConsumed extends React.SyntheticEvent {
  selectConsumed?: boolean
}

const prevetDefault = (e: EventWSelectConsumed) => {
  e.selectConsumed = true

  // prevent click event up the tree if copy was triggered;
}

export const preventDefaultProps = {
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
    if (e) {
      if (e.key === `Enter` || e.key === ` `) {
        prevetDefault(e)
      }
    }
  },
  onClick: (e: React.MouseEvent<HTMLElement>) => {
    if (e) {
      prevetDefault(e)
    }
  },
}

export const copy = (value: string | null, label?: string) => {
  if (!value) return
  const tempInputElement = document.createElement(`input`)
  document.body.append(tempInputElement)
  tempInputElement.value = value
  tempInputElement.select()
  document.execCommand(`copy`)
  tempInputElement.remove()

  let overlayMessageValuePreview = ``
  if (value.length > 28) {
    // cut front 12, end 12
    overlayMessageValuePreview = `${value.slice(0, 20)} ... ${value.slice(
      value.length - 8,
      value.length,
    )}`
  } else {
    overlayMessageValuePreview = `${value}`
  }

  overlayMessageValuePreview = overlayMessageValuePreview.replaceAll(`\n`, ` `)

  toast.info(
    `${
      label ? `${label} ` : ``
    }복사되었습니다.\n"${overlayMessageValuePreview}"`,
    {
      position: toast.POSITION.BOTTOM_CENTER,
    },
  )
}

export const copyableProps = {
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
    if (e) {
      if (e.key === `Enter` || e.key === ` `) {
        copy((e.target as HTMLElement).textContent)
      }
      preventDefaultProps.onKeyDown(e)
    }
  },
  onClick: (e: React.MouseEvent<HTMLElement>) => {
    if (e) {
      copy((e.target as HTMLElement).textContent)
      preventDefaultProps.onClick(e)
    }
  },
}

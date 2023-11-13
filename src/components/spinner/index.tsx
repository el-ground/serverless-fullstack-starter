import React from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import styles from './style.module.scss'

export const Spinner = ({
  className,
  size,
  color,
}: {
  className?: string
  size: number
  color: string
}) => {
  return (
    <div className={`${styles.rootContainer} ${className || ``}`}>
      <PulseLoader size={size} color={color} speedMultiplier={0.5} />
    </div>
  )
}

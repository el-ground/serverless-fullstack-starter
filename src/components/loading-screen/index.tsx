import React from 'react'
import styles from './style.module.scss'
import MoonLoader from 'react-spinners/MoonLoader'

export const LoadingScreen = ({ color }: { color: string }) => {
  return (
    <div className={styles.rootContainer}>
      <MoonLoader size={30} color={color} />
    </div>
  )
}

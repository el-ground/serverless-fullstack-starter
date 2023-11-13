'use client'
import React from 'react'
import styles from './style.module.scss'
import { Image } from '@/src/components/image'

export const ImageViewOverlay = ({
  image,
  close,
}: {
  image: string
  close: () => void
}) => {
  return (
    <div className={styles.rootContainer}>
      <div className={styles.innerBoundary}>
        <div className={styles.topRow}>
          <button
            type="button"
            onClick={() => {
              close()
            }}
            className={`${styles.closeButton} t14`}
          >
            닫기
          </button>
        </div>

        <Image src={image} width={1440} className={styles.image} alt="" />
      </div>
    </div>
  )
}

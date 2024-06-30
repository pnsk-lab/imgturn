import { useSignal } from '@preact/signals'
import { useEffect, useRef, useState } from 'preact/hooks'

export const View = () => {
  const viewUrlSign = useSignal<number>(Date.now())
  const viewSize = useSignal<{ w: number, h: number }>({
    w: 0,
    h: 0
  })
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const init = async () => {
      const url = URL.createObjectURL(await fetch('/shot').then(res => res.blob()))
      
      const image = new Image()
      await new Promise<null>(resolve => {
        image.onload = () => {
          viewSize.value = {
            w: image.width,
            h: image.height
          }
          resolve(null)
        }
        image.src = url
      })
    }
    init()
  })

  return <div>
    <img src={`/shot?t=${viewUrlSign}`} onLoad={() => {
      viewUrlSign.value = Date.now()
    }} alt="" class="w-full" ref={imgRef} onClick={async (evt) => {
      const img = imgRef.current!
      const rect = img.getBoundingClientRect();

      const absX = evt.pageX - rect.left
      const absY = evt.pageY - rect.top

      const ratio = viewSize.value.w / rect.width
      
      const x = absX * ratio
      const y = absY * ratio

      await fetch(`/click/${x}/${y}`).then(res => res.text())
    }}/>
  </div>
}
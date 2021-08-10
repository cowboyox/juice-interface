import axios from 'axios'
import { CSSProperties, useEffect, useState } from 'react'

export default function RichImgPreview({
  src,
  width,
  height,
  style,
}: {
  src: string | undefined
  width?: number
  height?: number
  style?: CSSProperties
}) {
  const [elem, setElem] = useState<JSX.Element | null>(null)

  useEffect(() => {
    if (!src) {
      setElem(null)
      return
    }

    axios.get(src).then(res => {
      const contentType = res.headers['content-type']

      if (
        contentType === 'image/jpeg' ||
        contentType === 'image/jpg' ||
        contentType === 'image/gif' ||
        contentType === 'image/png' ||
        contentType === 'image/svg'
      ) {
        setElem(
          <img
            src={src}
            style={{
              width: width ?? 100,
              height: height ?? 100,
              ...style,
            }}
          />,
        )
      }
    })
  }, [src])

  return elem
}

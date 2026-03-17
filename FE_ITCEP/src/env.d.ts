declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png'

declare module '*.jpg'

declare module '*.jpeg'

declare module '*.gif'

declare module '*.webp'

// allow importing plain .jsx components from TSX files
declare module '*.jsx' {
  const comp: any
  export default comp
}

// allow importing plain .css files in TS/TSX
declare module '*.css' {
  const content: { [className: string]: string } | string
  export default content
}

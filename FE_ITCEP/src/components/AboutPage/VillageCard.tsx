import React from 'react'

type Props = {
  name: string
  image?: string
}

export default function VillageCard({ name, image }: Props) {
  return (
    <div className="w-full max-w-[340px] block border rounded-xl overflow-hidden shadow-sm bg-white">
      <div
        className="h-36 bg-gray-200 flex items-center justify-center text-white text-xl rounded-t-xl overflow-hidden"
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!image && <span className="text-[#6b5a46]">Ảnh làng nghề</span>}
      </div>
      <div className="p-4 bg-white">
        <h4 className="font-semibold text-lg mb-1 text-[#3f3224]">{name}</h4>
      </div>
    </div>
  )
}

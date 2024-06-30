const CustomKey = (props: { keyToSend: string }) => {

  return <button class="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full" onClick={() => {
    fetch(`/sendkey/${props.keyToSend}`)
  }}>
    {props.keyToSend}
  </button>
}

export const Controller = () => {
  return <div>
    <div class="flex justify-around">
      <input onChange={async (e) => {
        const text = e.currentTarget.value
        e.currentTarget.value = ''
        await fetch('/type', {
          body: text,
          method: 'POST'
        })
      }} placeholder="Enter string to type" class="border" />
      <CustomKey keyToSend="Enter" />
      <CustomKey keyToSend="Backspace" />
      <input onChange={(e) => {
        const url = new URL(e.currentTarget.value).href
        e.currentTarget.value = ''
        fetch(`/goto?url=${encodeURIComponent(url)}`)
      }} placeholder="Enter URL" class="border" />
      <button onClick={() => fetch(`/scroll/100`)} class="text-white bg-red-500 hover:bg-red-600 p-2">↓</button>
      <button onClick={() => fetch(`/scroll/-100`)} class="text-white bg-red-500 hover:bg-red-600 p-2">↑</button>
    </div>
  </div>
}
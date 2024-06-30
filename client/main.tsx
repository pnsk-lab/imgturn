import { render } from 'preact'
import { View } from './View'
import { Controller } from './Controller'


const App = () => {
  return <div class="flex flex-col">
    <div class="grow">
      <View />
    </div>
    <div>
      <Controller />
    </div>
  </div>
}

render(<App />, document.getElementById('app')!)
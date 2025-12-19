import { PipelineUI } from './PipelineUI'
import { PipelineToolbar } from './Toolbar'

const App = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <PipelineUI />
      <PipelineToolbar />
    </div>
  )
}

export default App
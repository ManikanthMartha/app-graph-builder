import { PipelineUI } from './features/pipeline/PipelineUI'
import { PipelineToolbar } from './components/layout/Toolbar'

const App = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <PipelineUI />
      <PipelineToolbar />
    </div>
  )
}

export default App
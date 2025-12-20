import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PipelineUI } from './features/pipeline/PipelineUI'
import { PipelineToolbar } from './components/layout/Toolbar'
import { AppSelector } from './components/layout/AppSelector'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-screen h-screen overflow-hidden">
        <PipelineUI />
        <PipelineToolbar />
        <AppSelector />
      </div>
    </QueryClientProvider>
  )
}

export default App
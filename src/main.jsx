import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './routes'
import { store } from './store/store'

createRoot(document.getElementById('root')).render(
  createElement(
    StrictMode,
    null,
    createElement(
      Provider,
      { store },
      createElement(RouterProvider, { router })
    )
  )
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import GalleryApp from './GalleryApp.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GalleryApp>
        </GalleryApp>
    </StrictMode>,
)

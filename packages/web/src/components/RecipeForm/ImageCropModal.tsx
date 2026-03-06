import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { type Area } from 'react-easy-crop'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Box,
  Typography,
} from '@mui/material'
import ZoomInIcon from '@mui/icons-material/ZoomIn'

// Matches the wide-banner display: 120px tall at full card width (~380px) ≈ 3.2:1
const CROP_ASPECT = 16 / 5

interface ImageCropModalProps {
  imageSrc: string
  onConfirm: (croppedAreaPixels: Area) => void
  onCancel: () => void
}

const ImageCropModal = ({ imageSrc, onConfirm, onCancel }: ImageCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const handleCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>Crop cover image</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Box sx={{ position: 'relative', height: 300, borderRadius: '8px', overflow: 'hidden', bgcolor: '#000' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={CROP_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, px: 0.5 }}>
          <ZoomInIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            onChange={(_, value) => setZoom(value as number)}
            aria-label="Zoom"
            sx={{
              color: '#667eea',
              '& .MuiSlider-thumb': { width: 18, height: 18 },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32, textAlign: 'right' }}>
            {zoom.toFixed(1)}×
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          Drag to reposition · pinch or use slider to zoom
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onCancel} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
          disabled={!croppedAreaPixels}
          sx={{
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
          }}
        >
          Crop &amp; Upload
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageCropModal

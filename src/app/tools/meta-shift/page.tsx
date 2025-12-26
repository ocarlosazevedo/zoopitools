'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Upload, 
  Download, 
  Trash2, 
  Fingerprint,
  Image as ImageIcon,
  Video,
  Check,
  Loader2,
  Shuffle,
  Info,
  AlertCircle
} from 'lucide-react'
import { 
  metadataTemplates, 
  getRandomTemplate,
  generateRandomDate,
  formatExifDate,
  formatISODate,
  type MetadataTemplate 
} from '@/lib/metadata-templates'

type FileType = 'image' | 'video' | null
type ProcessingStatus = 'idle' | 'processing' | 'done' | 'error'

interface ProcessedFile {
  original: File
  processed: Blob | null
  status: ProcessingStatus
  error?: string
}

export default function MetaShiftPage() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('random')
  const [alterHash, setAlterHash] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const [ffmpegLoading, setFfmpegLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const ffmpegRef = useRef<any>(null)

  // Detecta tipo de arquivo
  const getFileType = (file: File): FileType => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    return null
  }

  // Carrega FFmpeg sob demanda
  const loadFFmpeg = async () => {
    if (ffmpegLoaded || ffmpegLoading) return ffmpegRef.current

    setFfmpegLoading(true)
    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { toBlobURL } = await import('@ffmpeg/util')
      
      const ffmpeg = new FFmpeg()
      
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      
      ffmpegRef.current = ffmpeg
      setFfmpegLoaded(true)
      return ffmpeg
    } catch (error) {
      console.error('Erro ao carregar FFmpeg:', error)
      throw error
    } finally {
      setFfmpegLoading(false)
    }
  }

  // Processa imagem
  const processImage = async (file: File, template: MetadataTemplate): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')!
            
            // Desenha imagem
            ctx.drawImage(img, 0, 0)
            
            // Altera hash se solicitado (pixel invisível)
            if (alterHash) {
              const imageData = ctx.getImageData(0, 0, 1, 1)
              imageData.data[3] = imageData.data[3] === 255 ? 254 : 255
              ctx.putImageData(imageData, 0, 0)
            }
            
            // Exporta com qualidade levemente diferente
            const quality = alterHash ? 0.97 + Math.random() * 0.02 : 0.99
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error('Falha ao criar blob'))
                }
              },
              file.type === 'image/png' ? 'image/png' : 'image/jpeg',
              quality
            )
          }
          img.onerror = () => reject(new Error('Falha ao carregar imagem'))
          img.src = e.target?.result as string
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
      reader.readAsDataURL(file)
    })
  }

  // Processa vídeo
  const processVideo = async (file: File, template: MetadataTemplate): Promise<Blob> => {
    const ffmpeg = await loadFFmpeg()
    const { fetchFile } = await import('@ffmpeg/util')
    
    const inputName = 'input' + getExtension(file.name)
    const outputName = 'output' + getExtension(file.name)
    
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    
    const date = generateRandomDate()
    const creationTime = formatISODate(date)
    
    // Monta comando FFmpeg
    const args = [
      '-i', inputName,
      '-map_metadata', '-1', // Remove metadados existentes
      '-metadata', `creation_time=${creationTime}`,
    ]
    
    // Adiciona metadados do template
    if (template.video?.encoder) {
      args.push('-metadata', `encoder=${template.video.encoder}`)
    }
    if (template.video?.['com.apple.quicktime.make']) {
      args.push('-metadata', `com.apple.quicktime.make=${template.video['com.apple.quicktime.make']}`)
    }
    if (template.video?.['com.apple.quicktime.model']) {
      args.push('-metadata', `com.apple.quicktime.model=${template.video['com.apple.quicktime.model']}`)
    }
    
    // Re-encode leve se alterHash
    if (alterHash) {
      args.push('-c:v', 'libx264', '-crf', '18', '-preset', 'fast')
      args.push('-c:a', 'aac', '-b:a', '192k')
    } else {
      args.push('-c', 'copy')
    }
    
    args.push('-y', outputName)
    
    await ffmpeg.exec(args)
    
    const data = await ffmpeg.readFile(outputName)
    return new Blob([data], { type: file.type })
  }

  // Helper para extensão
  const getExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    return ext ? `.${ext}` : '.mp4'
  }

  // Processa arquivos
  const processFiles = async () => {
    const template = selectedTemplate === 'random' 
      ? null 
      : metadataTemplates.find(t => t.id === selectedTemplate)!

    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' as ProcessingStatus })))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileType = getFileType(file.original)
      const currentTemplate = template || getRandomTemplate()

      try {
        let processed: Blob

        if (fileType === 'image') {
          processed = await processImage(file.original, currentTemplate)
        } else if (fileType === 'video') {
          processed = await processVideo(file.original, currentTemplate)
        } else {
          throw new Error('Tipo de arquivo não suportado')
        }

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, processed, status: 'done' as ProcessingStatus } : f
        ))
      } catch (error) {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: 'error' as ProcessingStatus, 
            error: error instanceof Error ? error.message : 'Erro desconhecido' 
          } : f
        ))
      }
    }
  }

  // Download de arquivo
  const downloadFile = (file: ProcessedFile) => {
    if (!file.processed) return
    
    const url = URL.createObjectURL(file.processed)
    const a = document.createElement('a')
    a.href = url
    a.download = `shifted_${file.original.name}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download de todos
  const downloadAll = () => {
    files.filter(f => f.processed).forEach(downloadFile)
  }

  // Handlers de drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/') || file.type.startsWith('video/')
    )

    if (droppedFiles.length > 0) {
      setFiles(prev => [
        ...prev,
        ...droppedFiles.map(file => ({ original: file, processed: null, status: 'idle' as ProcessingStatus }))
      ])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [
      ...prev,
      ...selectedFiles.map(file => ({ original: file, processed: null, status: 'idle' as ProcessingStatus }))
    ])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setFiles([])
  }

  const hasVideos = files.some(f => getFileType(f.original) === 'video')
  const allDone = files.length > 0 && files.every(f => f.status === 'done')
  const isProcessing = files.some(f => f.status === 'processing')

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-zoopi-accent/10 flex items-center justify-center text-zoopi-accent">
              <Fingerprint size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zoopi-text">Meta Shift</h1>
              <p className="text-sm text-zoopi-text-muted">Transformar metadados de mídia</p>
            </div>
          </div>
        </header>

        {/* Info Banner */}
        <div className="bg-zoopi-accent/5 border border-zoopi-accent/20 rounded-xl p-4 mb-8 flex items-start gap-3 animate-slide-up">
          <Info size={20} className="text-zoopi-accent shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-zoopi-text mb-1">
              <strong>Como funciona:</strong> Seus arquivos são processados localmente no navegador.
            </p>
            <p className="text-zoopi-text-muted">
              Nenhum dado é enviado para servidores. Imagens processam instantaneamente, 
              vídeos podem demorar 30s-2min dependendo do tamanho.
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          className={`drop-zone p-8 mb-6 text-center cursor-pointer transition-all ${isDragging ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Upload size={40} className="mx-auto mb-4 text-zoopi-text-muted" />
          <p className="text-zoopi-text mb-2">
            Arraste arquivos aqui ou <span className="text-zoopi-accent">clique para selecionar</span>
          </p>
          <p className="text-sm text-zoopi-text-muted">
            Suporta JPG, PNG, WEBP, MP4, MOV, WEBM
          </p>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zoopi-text-muted">
                {files.length} arquivo{files.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={clearAll}
                className="text-sm text-zoopi-text-muted hover:text-zoopi-error transition-colors"
              >
                Limpar tudo
              </button>
            </div>
            <div className="space-y-2">
              {files.map((file, index) => {
                const fileType = getFileType(file.original)
                const Icon = fileType === 'video' ? Video : ImageIcon
                
                return (
                  <div
                    key={index}
                    className="file-preview flex items-center gap-3 p-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zoopi-bg flex items-center justify-center text-zoopi-text-muted">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zoopi-text truncate">
                        {file.original.name}
                      </p>
                      <p className="text-xs text-zoopi-text-muted">
                        {(file.original.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'processing' && (
                        <Loader2 size={18} className="text-zoopi-accent animate-spin" />
                      )}
                      {file.status === 'done' && (
                        <Check size={18} className="text-zoopi-success" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle size={18} className="text-zoopi-error" />
                      )}
                      {file.processed && (
                        <button
                          onClick={() => downloadFile(file)}
                          className="p-2 hover:bg-zoopi-hover rounded-lg transition-colors"
                        >
                          <Download size={18} className="text-zoopi-text-muted" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 hover:bg-zoopi-hover rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-zoopi-text-muted" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="bg-zoopi-card border border-zoopi-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-medium text-zoopi-text mb-4">Configurações</h3>
          
          {/* Template Selector */}
          <div className="mb-4">
            <label className="text-sm text-zoopi-text-muted mb-2 block">
              Preset de Metadados
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedTemplate('random')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedTemplate === 'random'
                    ? 'border-zoopi-accent bg-zoopi-accent/10 text-zoopi-accent'
                    : 'border-zoopi-border text-zoopi-text-muted hover:border-zoopi-accent/50'
                }`}
              >
                <Shuffle size={16} />
                <span className="text-sm">Random</span>
              </button>
              {metadataTemplates.slice(0, 8).map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors text-left truncate ${
                    selectedTemplate === template.id
                      ? 'border-zoopi-accent bg-zoopi-accent/10 text-zoopi-accent'
                      : 'border-zoopi-border text-zoopi-text-muted hover:border-zoopi-accent/50'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Hash Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zoopi-text">Alterar Hash do Arquivo</p>
              <p className="text-xs text-zoopi-text-muted">
                Faz micro-alterações para gerar hash único
              </p>
            </div>
            <button
              onClick={() => setAlterHash(!alterHash)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                alterHash ? 'bg-zoopi-accent' : 'bg-zoopi-border'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  alterHash ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* FFmpeg Loading Warning */}
        {hasVideos && !ffmpegLoaded && (
          <div className="bg-zoopi-warning/10 border border-zoopi-warning/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-zoopi-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-zoopi-text">
                Vídeos requerem FFmpeg (~25MB). Será baixado automaticamente ao processar.
              </p>
            </div>
          </div>
        )}

        {/* Process Button */}
        <div className="flex gap-3">
          <button
            onClick={processFiles}
            disabled={files.length === 0 || isProcessing}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              files.length === 0 || isProcessing
                ? 'bg-zoopi-border text-zoopi-text-muted cursor-not-allowed'
                : 'bg-zoopi-accent hover:bg-zoopi-accent-hover text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processando...
              </>
            ) : ffmpegLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Carregando FFmpeg...
              </>
            ) : (
              <>
                <Fingerprint size={20} />
                Processar {files.length > 0 ? `(${files.length})` : ''}
              </>
            )}
          </button>

          {allDone && (
            <button
              onClick={downloadAll}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-zoopi-success/10 text-zoopi-success border border-zoopi-success/20 hover:bg-zoopi-success/20 transition-colors"
            >
              <Download size={20} />
              Baixar Todos
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

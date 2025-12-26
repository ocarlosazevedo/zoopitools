// Templates de metadados realistas para diferentes dispositivos/softwares

export interface MetadataTemplate {
  id: string
  name: string
  description: string
  category: 'mobile' | 'camera' | 'software'
  exif: {
    Make?: string
    Model?: string
    Software?: string
    Artist?: string
    Copyright?: string
    ColorSpace?: number
    WhiteBalance?: number
    [key: string]: string | number | undefined
  }
  video?: {
    encoder?: string
    handler_name?: string
    creation_time?: string
    'com.apple.quicktime.make'?: string
    'com.apple.quicktime.model'?: string
    'com.apple.quicktime.software'?: string
    [key: string]: string | undefined
  }
}

export const metadataTemplates: MetadataTemplate[] = [
  // Mobile Devices
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    description: 'Metadados de câmera do iPhone 15 Pro',
    category: 'mobile',
    exif: {
      Make: 'Apple',
      Model: 'iPhone 15 Pro',
      Software: '17.4.1',
      ColorSpace: 65535,
      WhiteBalance: 0,
    },
    video: {
      encoder: 'Apple H.265',
      handler_name: 'Core Media Video',
      'com.apple.quicktime.make': 'Apple',
      'com.apple.quicktime.model': 'iPhone 15 Pro',
      'com.apple.quicktime.software': '17.4.1',
    },
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    description: 'Metadados de câmera do iPhone 14',
    category: 'mobile',
    exif: {
      Make: 'Apple',
      Model: 'iPhone 14',
      Software: '17.3.1',
      ColorSpace: 65535,
      WhiteBalance: 0,
    },
    video: {
      encoder: 'Apple H.265',
      handler_name: 'Core Media Video',
      'com.apple.quicktime.make': 'Apple',
      'com.apple.quicktime.model': 'iPhone 14',
      'com.apple.quicktime.software': '17.3.1',
    },
  },
  {
    id: 'samsung-s24',
    name: 'Samsung S24 Ultra',
    description: 'Metadados de câmera do Galaxy S24 Ultra',
    category: 'mobile',
    exif: {
      Make: 'samsung',
      Model: 'SM-S928B',
      Software: 'S928BXXU1AXBA',
      ColorSpace: 1,
      WhiteBalance: 0,
    },
    video: {
      encoder: 'samsung',
      handler_name: 'VideoHandler',
    },
  },
  {
    id: 'pixel-8',
    name: 'Google Pixel 8 Pro',
    description: 'Metadados de câmera do Pixel 8 Pro',
    category: 'mobile',
    exif: {
      Make: 'Google',
      Model: 'Pixel 8 Pro',
      Software: 'HDR+ 1.0.540104767zd',
      ColorSpace: 1,
      WhiteBalance: 0,
    },
    video: {
      encoder: 'Google',
      handler_name: 'VideoHandle',
    },
  },

  // Cameras
  {
    id: 'canon-r5',
    name: 'Canon EOS R5',
    description: 'Metadados de câmera profissional Canon',
    category: 'camera',
    exif: {
      Make: 'Canon',
      Model: 'Canon EOS R5',
      Software: 'Firmware Version 1.8.1',
      Artist: '',
      Copyright: '',
      ColorSpace: 1,
      WhiteBalance: 0,
    },
    video: {
      encoder: 'Canon',
      handler_name: 'Canon Video Media Handler',
    },
  },
  {
    id: 'sony-a7iv',
    name: 'Sony A7 IV',
    description: 'Metadados de câmera profissional Sony',
    category: 'camera',
    exif: {
      Make: 'SONY',
      Model: 'ILCE-7M4',
      Software: 'ILCE-7M4 v2.01',
      ColorSpace: 1,
      WhiteBalance: 0,
    },
    video: {
      encoder: 'Sony',
      handler_name: 'Sony Video Media Handler',
    },
  },

  // Software
  {
    id: 'premiere-pro',
    name: 'Adobe Premiere Pro',
    description: 'Exportado do Premiere Pro',
    category: 'software',
    exif: {
      Software: 'Adobe Premiere Pro 2024',
    },
    video: {
      encoder: 'Adobe Premiere Pro 2024 (Windows)',
      handler_name: 'Adobe Media Encoder',
    },
  },
  {
    id: 'davinci',
    name: 'DaVinci Resolve',
    description: 'Exportado do DaVinci Resolve',
    category: 'software',
    exif: {
      Software: 'DaVinci Resolve 18.6.4',
    },
    video: {
      encoder: 'DaVinci Resolve',
      handler_name: 'DaVinci Resolve',
    },
  },
  {
    id: 'final-cut',
    name: 'Final Cut Pro',
    description: 'Exportado do Final Cut Pro',
    category: 'software',
    exif: {
      Software: 'Final Cut Pro 10.7.1',
    },
    video: {
      encoder: 'Apple Final Cut Pro',
      handler_name: 'Apple Video Media Handler',
      'com.apple.quicktime.software': 'Final Cut Pro 10.7.1',
    },
  },
  {
    id: 'capcut',
    name: 'CapCut',
    description: 'Exportado do CapCut',
    category: 'software',
    exif: {
      Software: 'CapCut',
    },
    video: {
      encoder: 'CapCut Video Editor',
      handler_name: 'VideoHandler',
    },
  },
  {
    id: 'canva',
    name: 'Canva',
    description: 'Exportado do Canva',
    category: 'software',
    exif: {
      Software: 'Canva',
    },
    video: {
      encoder: 'Canva',
      handler_name: 'VideoHandler',
    },
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    description: 'Editado no Photoshop',
    category: 'software',
    exif: {
      Software: 'Adobe Photoshop 25.5 (Windows)',
      ColorSpace: 1,
    },
  },
  {
    id: 'lightroom',
    name: 'Adobe Lightroom',
    description: 'Editado no Lightroom',
    category: 'software',
    exif: {
      Software: 'Adobe Lightroom Classic 13.1 (Windows)',
      ColorSpace: 1,
    },
  },
]

// Função para gerar data aleatória recente
export function generateRandomDate(daysBack: number = 30): Date {
  const now = new Date()
  const randomDays = Math.floor(Math.random() * daysBack)
  const randomHours = Math.floor(Math.random() * 24)
  const randomMinutes = Math.floor(Math.random() * 60)
  
  now.setDate(now.getDate() - randomDays)
  now.setHours(randomHours, randomMinutes, Math.floor(Math.random() * 60))
  
  return now
}

// Função para formatar data no formato EXIF
export function formatExifDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}:${pad(date.getMonth() + 1)}:${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// Função para formatar data ISO
export function formatISODate(date: Date): string {
  return date.toISOString()
}

// Função para obter template aleatório
export function getRandomTemplate(): MetadataTemplate {
  return metadataTemplates[Math.floor(Math.random() * metadataTemplates.length)]
}

// Função para obter templates por categoria
export function getTemplatesByCategory(category: MetadataTemplate['category']): MetadataTemplate[] {
  return metadataTemplates.filter(t => t.category === category)
}

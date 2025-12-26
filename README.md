# Zoopi Tools

Ferramentas profissionais para media buyers.

## 🚀 Deploy

### Vercel (Recomendado)

1. Fork ou clone este repositório para seu GitHub
2. Conecte ao Vercel: [vercel.com/new](https://vercel.com/new)
3. Selecione o repositório
4. Deploy automático!

### Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 🛠️ Ferramentas

### Meta Shift
Transforma metadados de imagens e vídeos para evitar bloqueios de criativos no Facebook/Meta.

**Features:**
- ✅ Processa 100% no navegador (privacidade total)
- ✅ Suporta imagens (JPG, PNG, WEBP) e vídeos (MP4, MOV, WEBM)
- ✅ 13 presets de metadados realistas
- ✅ Opção de alterar hash do arquivo
- ✅ Bulk processing

**Presets disponíveis:**
- iPhone 15 Pro, iPhone 14
- Samsung S24 Ultra, Google Pixel 8 Pro
- Canon EOS R5, Sony A7 IV
- Premiere Pro, DaVinci Resolve, Final Cut Pro
- CapCut, Canva, Photoshop, Lightroom

## 📁 Estrutura

```
zoopi-tools/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home
│   │   ├── layout.tsx        # Layout principal
│   │   ├── globals.css       # Estilos globais
│   │   └── tools/
│   │       └── meta-shift/   # Ferramenta Meta Shift
│   ├── components/
│   │   └── Sidebar.tsx       # Navegação lateral
│   └── lib/
│       └── metadata-templates.ts  # Templates de metadados
├── public/
├── package.json
└── README.md
```

## 🔧 Stack

- **Next.js 14** - Framework React
- **Tailwind CSS** - Estilos
- **FFmpeg WASM** - Processamento de vídeo client-side
- **Exifr** - Leitura de metadados
- **Lucide React** - Ícones

## 📝 Roadmap

- [ ] Thumbnail Generator
- [ ] Copy Spinner
- [ ] Creative Analyzer
- [ ] Bulk upload com ZIP
- [ ] Chrome extension

## 🏢 Zoopi Group

Desenvolvido por [Zoopi Group](https://zoopfinance.vercel.app).

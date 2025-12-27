#!/bin/bash

# Script de verificación de instalación
# Ejecuta: bash verify-setup.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 Verificación de Instalación - Vesu Hooks + Supabase   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js instalado: $(node -v)"
else
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Check npm
echo ""
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm instalado: $(npm -v)"
else
    echo "❌ npm no está instalado"
    exit 1
fi

# Check .env.local
echo ""
echo "🔐 Verificando variables de entorno..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local encontrado"
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "  ✅ NEXT_PUBLIC_SUPABASE_URL configurado"
    else
        echo "  ⚠️  NEXT_PUBLIC_SUPABASE_URL no encontrado"
    fi
    if grep -q "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY" .env.local; then
        echo "  ✅ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY configurado"
    else
        echo "  ⚠️  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY no encontrado"
    fi
else
    echo "⚠️  .env.local no encontrado"
    echo "  Copia .env.example a .env.local y agrega tus credenciales"
fi

# Check node_modules
echo ""
echo "📚 Verificando dependencias instaladas..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules encontrado"
    PACKAGE_COUNT=$(ls node_modules | wc -l)
    echo "  Paquetes instalados: $PACKAGE_COUNT"
else
    echo "⚠️  node_modules no encontrado"
    echo "  Ejecuta: npm install"
fi

# Check key files
echo ""
echo "📁 Verificando archivos clave..."
FILES=(
    "app/layout.tsx"
    "app/page.tsx"
    "app/login/page.tsx"
    "app/dashboard/page.tsx"
    "app/auth/callback/route.ts"
    "middleware.ts"
    "utils/supabase/server.ts"
    "utils/supabase/client.ts"
    "useSupabaseAuth.ts"
    "package.json"
    "tsconfig.json"
    "next.config.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (FALTA)"
    fi
done

# Check documentation
echo ""
echo "📚 Verificando documentación..."
DOCS=(
    "README.md"
    "SETUP_COMPLETE.md"
    "SUPABASE_SETUP.md"
    "CHIPI_INTEGRATION.md"
    "INTEGRATION_CHECKLIST.md"
    "ARCHITECTURE.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc"
    else
        echo "⚠️  $doc (FALTA)"
    fi
done

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    📋 Próximos Pasos                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Asegúrate de tener .env.local con credenciales de Supabase:"
echo "   NEXT_PUBLIC_SUPABASE_URL=<tu_url>"
echo "   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<tu_key>"
echo ""
echo "2. Instala dependencias (si no las tienes):"
echo "   npm install"
echo ""
echo "3. Ejecuta el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "4. Accede a http://localhost:3000"
echo ""
echo "5. Lee la documentación:"
echo "   - SETUP_COMPLETE.md (inicio rápido)"
echo "   - SUPABASE_SETUP.md (guía detallada)"
echo "   - CHIPI_INTEGRATION.md (integración ChipiPay)"
echo "   - ARCHITECTURE.md (arquitectura del proyecto)"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            ✅ Listo para empezar a desarrollar            ║"
echo "╚════════════════════════════════════════════════════════════╝"

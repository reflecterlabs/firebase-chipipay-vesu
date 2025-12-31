# Importación de Prototipo Visual

## Estado: feat/ui (Rama Feature)

Este documento registra la importación provisional de componentes visuales del repositorio [openthedoorz-prototype](https://github.com/cxto21/openthedoorz-protoype).

### Archivos Importados

#### Componentes Visuales (`app/components/`)
- **Header.tsx** - Navegación superior con logo y botón de wallet
- **Landing.tsx** - Página principal con hero section y carousel de partners
- **WalletPopup.tsx** - Modal/popup para funcionalidades de wallet
- **Docs.tsx** - Página de documentación

#### Servicios (`lib/services/`)
- **geminiService.ts** - Integración con Google Gemini API para explicaciones técnicas

#### Utilidades
- **types.ts** - Definiciones de tipos TypeScript
- **metadata.json** - Metadata de la aplicación

### Próximos Pasos en feat/ui

1. **Integración de Componentes**
   - Adaptar Header/Landing para integrar con la lógica existente de Vesu
   - Reemplazar o refactor de componentes que conflictúen con existentes

2. **Resolver Dependencias**
   - Importar lucide-react en package.json (ya presente)
   - Verificar compatibilidad de versiones

3. **Styling**
   - Asegurar que Tailwind CSS está configurado correctamente
   - Mantener el esquema black/white del prototipo

4. **Integración con Firebase & ChipiPay**
   - Conectar componentes visuales con hooks existentes
   - Mantener la lógica de autenticación Firebase
   - Preservar integración con Vesu y ChipiPay

### Rama: feat/ui
- Creada desde: `trunk`
- Estrategia: Trunk-Based Development
- Próximo destino: PR a `trunk` una vez listos los componentes

### Nota
Este es un trabajo provisional para acelerar el desarrollo UI. Los componentes se irán refinando iterativamente en esta rama antes de hacer merge a trunk.

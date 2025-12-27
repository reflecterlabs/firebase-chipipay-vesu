# Obtener JWT Token para ChipiPay

## ✅ La aplicación está corriendo en: `http://localhost:3001`

### Pasos para obtener el JWT token:

1. **Abre tu navegador** y ve a:
   ```
   http://localhost:3001
   ```

2. **Haz clic en "Ir a Login"** para crear una cuenta o iniciar sesión

3. **Completa el formulario de login:**
   - Email: usa tu email personal
   - Contraseña: cualquier contraseña (mín 6 caracteres)
   - Haz clic en "Crear Cuenta" (o inicia sesión si ya tienes cuenta)

4. **Accede al Dashboard**
   - Después de iniciar sesión, deberías estar en `/dashboard`
   - Deberías ver tu email y un botón "Crear Billetera"

5. **Extrae el JWT Token** - En la consola del navegador (F12):
   ```javascript
   // Ejecuta esto en la consola:
   const { data } = await (await import('@supabase/supabase-js')).createClient(
     'https://xjgdvoswgvyzisdkatxc.supabase.co',
     'sb_publishable_Cu4kF4iZ4bq08ZFn94gwvw_rhztEdw6'
   ).auth.getSession();
   
   console.log(data.session.access_token);
   ```

6. **Copia el token** que aparece en la consola

## 🔧 Alternativa si tienes acceso a DevTools:

En el tab **Console** del navegador, después de login, copia y pega:

```javascript
// Obtener token del localStorage directamente
const session = JSON.parse(localStorage.getItem('sb-xjgdvoswgvyzisdkatxc-auth-token'));
console.log(session.session.access_token);
```

## 📋 Una vez tengas el token:

1. **Ve al Dashboard de ChipiPay**
   - URL: https://dashboard.chipipay.com/...

2. **Navega a:** Settings → JWKS Configuration

3. **Configura:**
   - **JWKS Endpoint URL:** 
     ```
     https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1/.well-known/jwks.json
     ```
   
   - **User Identifier:** (ya debe estar como "sub")
     ```
     sub
     ```
   
   - **Validation Rules:** (pega tu JWT token aquí)
     ```
     [pega el token que obtuviste]
     ```
   
   - Click "Parse"
   - Selecciona hasta 3 validation rules (recomendado: iss, aud, sub)
   - Click "Save"

## ✨ Después de completar la configuración:

1. **Vuelve a la app** en http://localhost:3001
2. **Ve al Dashboard**
3. **Completa la sección "Crear Billetera":**
   - Ingresa una "Clave de Encriptación" (mín 8 caracteres)
   - Click "Crear Billetera"
4. **Verás:**
   - Wallet ID
   - Public Key (necesario para ChipiPay)

## 🔗 URLs de referencia:

- **App Local:** http://localhost:3001
- **Dashboard:** http://localhost:3001/dashboard
- **Login:** http://localhost:3001/login
- **Supabase JWKS:** https://xjgdvoswgvyzisdkatxc.supabase.co/auth/v1/.well-known/jwks.json
- **ChipiPay Dashboard:** https://dashboard.chipipay.com/

## 💡 Troubleshooting:

**Si ves error en la consola:**
- Asegúrate de estar en la página `/dashboard` (después de login)
- Verifica que la sesión sea válida en DevTools → Application → Local Storage
- Si aún no hay sesión, el login no se completó. Revisa la consola para errores.

**Si el JWKS Endpoint no responde:**
- Verifica que tu JWT key ID sea correcto: `1b2e7762-b162-4986-adb9-6ae4275319b1`
- Accede a la URL del JWKS en el navegador para confirmar que retorna JSON válido

**Si ChipiPay rechaza la configuración:**
- Valida que el JWT token sea actual (recién generado)
- Asegúrate de que el "User Identifier" sea exactamente "sub"
- Revisa que hayas seleccionado al menos 1 validation rule

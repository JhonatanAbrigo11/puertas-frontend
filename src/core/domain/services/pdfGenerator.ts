import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Quote } from '../entities/Quote';
import { QuoteItem } from '../entities/QuoteItem';
import { QuoteTotals } from './quoteCalculator';

export function buildWarehouseOrderNumber(
  quoteNumber: string,
  itemIndex: number
): string {
  const numericPart = quoteNumber.replace(/^PRO-/, '');
  return `BOD-${numericPart}-${String(itemIndex + 1).padStart(2, '0')}`;
}

export function generateQuoteHtml(quote: Quote, totals: QuoteTotals): string {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const validUntilDate = new Date(
    Date.now() + 15 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const itemsHtml = quote.items
    .map((item, index) => {
      const areaM2 = ((item.widthCm * item.heightCm) / 10000).toFixed(2);
      return `
        <tr style="border-bottom: 1px solid #F0F0F0; ${
          index % 2 === 1 ? 'background-color: #FFFFFF;' : ''
        }">
          <td style="padding: 10px 8px; font-weight: 700; color: #FE4648; text-align: center;">#${
            index + 1
          }</td>
          <td style="padding: 10px 8px;">
            <div style="font-weight: 700; color: #0F172A; font-size: 13px;">${
              item.product.name
            }</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
              <strong>Cód:</strong> ${item.product.code} | 
              <strong>Perfilería:</strong> ${item.product.aluminumSeries} | 
              <strong>Cristal:</strong> ${item.product.glassType}
            </div>
          </td>
          <td style="padding: 10px 8px; text-align: center; font-size: 12px; font-weight: 600; color: #1E293B;">
            ${item.widthCm} × ${item.heightCm} cm
            <div style="font-size: 10px; color: #94A3B8;">(${areaM2} m²)</div>
          </td>
          <td style="padding: 10px 8px; text-align: center; font-weight: 700; font-size: 13px; color: #0F172A;">
            ${item.quantity} und
          </td>
          <td style="padding: 10px 8px; text-align: right; font-size: 12px; color: #475569;">
            $${item.unitPriceDemo.toFixed(2)}
          </td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 700; font-size: 13px; color: #FE4648;">
            $${item.subtotalDemo.toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join('');

  const consolidatedHtml = quote.consolidatedMaterials
    .map((mat, index) => {
      const formattedQty =
        mat.unit === 'und' || mat.unit === 'juego'
          ? Math.ceil(mat.totalQuantity)
          : mat.totalQuantity.toFixed(2);
      return `
        <tr style="border-bottom: 1px solid #F0F0F0; ${
          index % 2 === 1 ? 'background-color: #FFFFFF;' : ''
        }">
          <td style="padding: 8px 10px; font-size: 12px; font-weight: 600; color: #1E293B;">
            ${mat.materialName}
            <div style="font-size: 10px; color: #64748B;">Usado en: ${mat.productNames.join(
              ', '
            )}</div>
          </td>
          <td style="padding: 8px 10px; text-align: right; font-size: 12px; font-weight: 700; color: #FE4648;">
            ${formattedQty}
          </td>
          <td style="padding: 8px 10px; text-align: center; font-size: 11px; font-weight: 700; color: #475569;">
            <span style="background: #F0F0F0; padding: 2px 6px; border-radius: 4px;">${
              mat.unit
            }</span>
          </td>
          <td style="padding: 8px 10px; text-align: right; font-size: 12px; color: #64748B;">
            $${mat.unitPriceDemo.toFixed(2)}
          </td>
          <td style="padding: 8px 10px; text-align: right; font-size: 12px; font-weight: 700; color: #0F172A;">
            $${mat.totalPriceDemo.toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Proforma ALUX - ${quote.quoteNumber}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0F172A;
          background: #FFFFFF;
          margin: 0;
          padding: 0;
          font-size: 12px;
          line-height: 1.4;
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #FE4648;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .company-logo-block {
          flex: 1;
        }
        .company-name {
          font-size: 24px;
          font-weight: 900;
          color: #FE4648;
          letter-spacing: 0.5px;
          margin: 0 0 4px 0;
        }
        .company-tagline {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin: 0 0 8px 0;
        }
        .company-meta {
          font-size: 10px;
          color: #64748B;
          line-height: 1.5;
        }
        .quote-info-badge {
          text-align: right;
          background: #F0F7FF;
          border: 1px solid #93C5FD;
          border-radius: 8px;
          padding: 12px 16px;
          min-width: 200px;
        }
        .quote-title {
          font-size: 11px;
          font-weight: 800;
          color: #FE4648;
          letter-spacing: 1px;
          margin: 0 0 4px 0;
        }
        .quote-number {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 6px 0;
        }
        .quote-dates {
          font-size: 10px;
          color: #475569;
        }
        .client-card {
          background: #FFFFFF;
          border: 1px solid #F0F0F0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
        }
        .client-col {
          flex: 1;
        }
        .client-col:last-child {
          margin-left: 20px;
        }
        .client-label {
          font-size: 10px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .client-value {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          margin-top: 2px;
          margin-bottom: 6px;
        }
        .section-heading {
          font-size: 13px;
          font-weight: 800;
          color: #FE4648;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-left: 4px solid #FE4648;
          padding-left: 8px;
          margin: 20px 0 10px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        th {
          background: #1E293B;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 8px;
        }
        .totals-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
          margin-bottom: 24px;
        }
        .totals-card {
          width: 320px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          overflow: hidden;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 14px;
          font-size: 12px;
          border-bottom: 1px solid #F0F0F0;
        }
        .totals-row-highlight {
          background: #FE4648;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 900;
          padding: 12px 14px;
        }
        .terms-block {
          background: #FFFFFF;
          border: 1px solid #F0F0F0;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 10px;
          color: #64748B;
          line-height: 1.5;
          margin-top: 20px;
        }
        .signatures-row {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
        }
        .sign-box {
          width: 42%;
          text-align: center;
          border-top: 1px solid #94A3B8;
          padding-top: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }
        .sign-sub {
          font-size: 9px;
          color: #94A3B8;
          font-weight: 400;
          margin-top: 2px;
        }
      </style>
    </head>
    <body>
      <!-- 1. Header -->
      <div class="header-container">
        <div class="company-logo-block">
          <div class="company-name">ALUX <span style="font-size: 18px; color: #FE4648;">PRO</span></div>
          <div class="company-tagline">Carpintería de Aluminio & Vidrio Arquitectónico</div>
          <div class="company-meta">
            <strong>RUC:</strong> 1792837461001 &nbsp;|&nbsp; <strong>PBX / WhatsApp:</strong> +593 99 123 4567<br/>
            <strong>Planta:</strong> Parque Industrial Metalmecánico, Lote 14 &nbsp;|&nbsp; <strong>Email:</strong> cotizaciones@alux.com
          </div>
        </div>

        <div class="quote-info-badge">
          <div class="quote-title">PROFORMA TÉCNICA</div>
          <div class="quote-number">${quote.quoteNumber}</div>
          <div class="quote-dates">
            <strong>Emisión:</strong> ${currentDate}<br/>
            <strong>Validez:</strong> ${validUntilDate} (15 días)
          </div>
        </div>
      </div>

      <!-- 2. Client / Project Card -->
      <div class="client-card">
        <div class="client-col">
          <div class="client-label">Cliente / Razón Social:</div>
          <div class="client-value">${quote.customer.name}</div>
          <div class="client-label">Teléfono / Celular:</div>
          <div style="font-size: 12px; color: #334155;">${
            quote.customer.phone
          }</div>
        </div>

        <div class="client-col">
          <div class="client-label">Dirección de Entrega / Obra:</div>
          <div class="client-value">${quote.customer.address}</div>
          <div class="client-label">Correo Electrónico:</div>
          <div style="font-size: 12px; color: #334155;">${
            quote.customer.email
          }</div>
        </div>
      </div>

      <!-- 3. Table of Products -->
      <div class="section-heading">1. Detalle de Productos y Fabricación a Medida</div>
      <table>
        <thead>
          <tr>
            <th style="width: 35px;">#</th>
            <th style="text-align: left;">Descripción de Producto</th>
            <th style="width: 110px;">Medidas (W × H)</th>
            <th style="width: 70px;">Cant.</th>
            <th style="width: 85px; text-align: right;">P. Unit Demo</th>
            <th style="width: 95px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- 4. Consolidated Materials Table (Production / Warehouse) -->
      <div class="section-heading">2. Resumen Consolidado de Materiales (Bodega & Taller)</div>
      <table>
        <thead>
          <tr>
            <th style="text-align: left;">Insumo / Material Consolidado</th>
            <th style="width: 90px; text-align: right;">Cantidad</th>
            <th style="width: 65px; text-align: center;">Unidad</th>
            <th style="width: 85px; text-align: right;">P. Base Demo</th>
            <th style="width: 95px; text-align: right;">Total Demo</th>
          </tr>
        </thead>
        <tbody>
          ${consolidatedHtml}
        </tbody>
      </table>

      <!-- 5. Totals Card -->
      <div class="totals-container">
        <div class="totals-card">
          <div class="totals-row">
            <span style="color: #64748B;">Total de Unidades Fabricadas:</span>
            <strong>${totals.totalProductsCount} unidades (${
    totals.itemCount
  } items)</strong>
          </div>
          <div class="totals-row">
            <span style="color: #64748B;">Subtotal Insumos Materiales:</span>
            <strong>$${totals.subtotalMaterialsDemo.toFixed(2)}</strong>
          </div>
          <div class="totals-row">
            <span style="color: #64748B;">Mano de Obra & Armado (Demo ~25%):</span>
            <strong>$${totals.estimatedLaborDemo.toFixed(2)}</strong>
          </div>
          <div class="totals-row totals-row-highlight">
            <span>TOTAL PROFORMA:</span>
            <span>$${totals.totalDemo.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- 6. Commercial Terms & Warranty -->
      <div class="terms-block">
        <strong>TÉRMINOS Y CONDICIONES COMERCIALES:</strong><br/>
        1. <strong>Precios Demo:</strong> Valores de demostración para el prototipo digital de cotización.<br/>
        2. <strong>Plazo de Fabricación:</strong> 5 a 8 días hábiles a partir de la confirmación de medidas en obra y anticipo del 50%.<br/>
        3. <strong>Garantía:</strong> 1 año en perfiles de aluminio contra defectos de anodizado/pintura y 6 meses en accesorios y rodamientos.<br/>
        4. <strong>Forma de Pago:</strong> 50% anticipo para compra de materiales y 50% contra entrega e instalación.
      </div>

      <!-- 7. Signatures -->
      <div class="signatures-row">
        <div class="sign-box">
          ASESOR COMERCIAL / TÉCNICO
          <div class="sign-sub">ALUX S.A.</div>
        </div>
        <div class="sign-box">
          ACEPTACIÓN Y CONFORMIDAD CLIENTE
          <div class="sign-sub">Firma y Cédula / RUC</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function printHtmlDocument(
  html: string,
  dialogTitle: string
): Promise<{ success: boolean; uri?: string; error?: string }> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.opacity = '0';
        iframe.style.zIndex = '-9999';
        document.body.appendChild(iframe);

        const frameDoc =
          iframe.contentWindow?.document || iframe.contentDocument;

        if (frameDoc) {
          frameDoc.open();
          frameDoc.write(html);
          frameDoc.close();

          setTimeout(() => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
            } catch (frameErr) {
              console.warn(
                'Iframe print fallback, opening dedicated window:',
                frameErr
              );
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                  printWindow.print();
                }, 300);
              }
            } finally {
              setTimeout(() => {
                try {
                  if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                  }
                } catch {}
              }, 5000);
            }
          }, 350);
        }
      }
      return { success: true };
    }

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle,
        UTI: 'com.adobe.pdf',
      });
    }

    return { success: true, uri };
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error?.message || 'No se pudo generar el archivo PDF.',
    };
  }
}

export function generateWarehouseOrderHtml(
  item: QuoteItem,
  quoteNumber: string,
  warehouseNumber: string
): string {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const areaM2 = ((item.widthCm * item.heightCm) / 10000).toFixed(2);

  const materialsHtml = item.calculatedMaterials
    .map((mat, index) => {
      const formattedQty =
        mat.unit === 'und' || mat.unit === 'juego'
          ? Math.ceil(mat.quantity).toString()
          : mat.quantity.toFixed(2);
      return `
        <tr style="border-bottom: 1px solid #F0F0F0; ${
          index % 2 === 1 ? 'background-color: #FAFAFA;' : ''
        }">
          <td style="padding: 9px 10px; text-align: center; font-weight: 700; color: #B45309;">${
            index + 1
          }</td>
          <td style="padding: 9px 10px; font-size: 12px; font-weight: 600; color: #0F172A;">
            ${mat.materialName}
            ${
              mat.notes
                ? `<div style="font-size: 10px; color: #64748B; margin-top: 2px;">${mat.notes}</div>`
                : ''
            }
          </td>
          <td style="padding: 9px 10px; text-align: right; font-size: 13px; font-weight: 800; color: #0F172A;">
            ${formattedQty}
          </td>
          <td style="padding: 9px 10px; text-align: center;">
            <span style="background: #FEF3C7; color: #B45309; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">
              ${mat.unit}
            </span>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Orden de Bodega ${warehouseNumber}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0F172A;
          background: #FFFFFF;
          margin: 0;
          padding: 0;
          font-size: 12px;
          line-height: 1.4;
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #C98A16;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: 900;
          color: #0A192F;
          margin: 0 0 4px 0;
        }
        .company-tagline {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin: 0 0 8px 0;
        }
        .company-meta {
          font-size: 10px;
          color: #64748B;
          line-height: 1.5;
        }
        .order-badge {
          text-align: right;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-radius: 8px;
          padding: 12px 16px;
          min-width: 220px;
        }
        .order-title {
          font-size: 11px;
          font-weight: 800;
          color: #B45309;
          letter-spacing: 1px;
          margin: 0 0 4px 0;
        }
        .order-number {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 6px 0;
        }
        .product-card {
          background: #FFFFFF;
          border: 1.5px solid #F0F0F0;
          border-radius: 8px;
          padding: 14px 16px;
          margin-bottom: 18px;
        }
        .product-label {
          font-size: 10px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .product-name {
          font-size: 18px;
          font-weight: 800;
          color: #0A192F;
          margin: 2px 0 8px 0;
        }
        .meta-row {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        .meta-value {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          margin-top: 2px;
        }
        .section-heading {
          font-size: 13px;
          font-weight: 800;
          color: #B45309;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-left: 4px solid #C98A16;
          padding-left: 8px;
          margin: 8px 0 10px 0;
        }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th {
          background: #0A192F;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 8px 10px;
        }
        .note {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 10px;
          color: #64748B;
          margin-top: 8px;
        }
        .signatures-row {
          display: flex;
          justify-content: space-between;
          margin-top: 48px;
          padding-top: 12px;
        }
        .sign-box {
          width: 30%;
          text-align: center;
          border-top: 1px solid #94A3B8;
          padding-top: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }
        .sign-sub {
          font-size: 9px;
          color: #94A3B8;
          font-weight: 400;
          margin-top: 2px;
        }
      </style>
    </head>
    <body>
      <div class="header-container">
        <div>
          <div class="company-name">ALUX <span style="font-size: 18px; color: #C98A16;">PRO</span></div>
          <div class="company-tagline">Carpintería de Aluminio &amp; Vidrio Arquitectónico</div>
          <div class="company-meta">
            <strong>RUC:</strong> 1792837461001 &nbsp;|&nbsp; <strong>PBX / WhatsApp:</strong> +593 99 123 4567<br/>
            <strong>Planta:</strong> Parque Industrial Metalmecánico, Lote 14
          </div>
        </div>
        <div class="order-badge">
          <div class="order-title">ORDEN DE BODEGA</div>
          <div class="order-number">${warehouseNumber}</div>
          <div style="font-size: 10px; color: #475569;">
            <strong>Proforma:</strong> ${quoteNumber}<br/>
            <strong>Fecha:</strong> ${currentDate}
          </div>
        </div>
      </div>

      <div class="product-card">
        <div class="product-label">Producto a fabricar</div>
        <div class="product-name">${item.product.name}</div>
        <div class="meta-row">
          <div>
            <div class="product-label">Código</div>
            <div class="meta-value">${item.product.code}</div>
          </div>
          <div>
            <div class="product-label">Cantidad</div>
            <div class="meta-value">${item.quantity} und</div>
          </div>
          <div>
            <div class="product-label">Medidas</div>
            <div class="meta-value">${item.widthCm} × ${item.heightCm} cm (${areaM2} m²)</div>
          </div>
          <div>
            <div class="product-label">Serie / Cristal</div>
            <div class="meta-value">${item.product.aluminumSeries} · ${item.product.glassType}</div>
          </div>
        </div>
      </div>

      <div class="section-heading">Materiales a despachar</div>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th style="text-align: left;">Material / Insumo</th>
            <th style="width: 110px; text-align: right;">Cantidad</th>
            <th style="width: 90px; text-align: center;">Unidad</th>
          </tr>
        </thead>
        <tbody>
          ${materialsHtml || `
            <tr>
              <td colspan="4" style="padding: 16px; text-align: center; color: #94A3B8;">
                Sin materiales calculados para este producto.
              </td>
            </tr>
          `}
        </tbody>
      </table>

      <div class="note">
        <strong>INSTRUCCIONES DE BODEGA:</strong><br/>
        Despachar únicamente los materiales y cantidades listados para la orden
        <strong>${warehouseNumber}</strong>, vinculada a la proforma
        <strong>${quoteNumber}</strong>. Verificar existencias antes de corte.
      </div>

      <div class="signatures-row">
        <div class="sign-box">
          SOLICITADO POR
          <div class="sign-sub">Producción / Taller</div>
        </div>
        <div class="sign-box">
          DESPACHADO BODEGA
          <div class="sign-sub">Nombre y firma</div>
        </div>
        <div class="sign-box">
          RECIBIDO TALLER
          <div class="sign-sub">Nombre y firma</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function generateAndDownloadPdf(
  quote: Quote,
  totals: QuoteTotals
): Promise<{ success: boolean; uri?: string; error?: string }> {
  const html = generateQuoteHtml(quote, totals);
  return printHtmlDocument(html, `Descargar Proforma ${quote.quoteNumber}`);
}

export async function generateAndDownloadWarehouseOrderPdf(
  item: QuoteItem,
  quoteNumber: string,
  itemIndex: number
): Promise<{ success: boolean; uri?: string; error?: string }> {
  const warehouseNumber = buildWarehouseOrderNumber(quoteNumber, itemIndex);
  const html = generateWarehouseOrderHtml(item, quoteNumber, warehouseNumber);
  return printHtmlDocument(html, `Orden de Bodega ${warehouseNumber}`);
}

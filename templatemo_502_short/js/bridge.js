// 🧾 FACTURA BASE
class Factura {
    constructor(datos) {
        this.datos = datos;
    }

    generar() {
        return this.datos;
    }
}

// 🎨 DECORADOR BASE
class FacturaDecorator {
    constructor(factura) {
        this.factura = factura;
    }

    generar() {
        return this.factura.generar();
    }
}

// 📄 JSON
class FacturaJSON extends FacturaDecorator {
    generar() {
        const data = super.generar();
        return JSON.stringify(data, null, 2);
    }
}

// 🧾 XML
class FacturaXML extends FacturaDecorator {
    generar() {
        const d = super.generar();

        return `
<factura>
    <emisor>${d.emisor}</emisor>
    <rfc_emisor>${d.rfc_emisor}</rfc_emisor>
    <receptor>${d.receptor}</receptor>
    <rfc_receptor>${d.rfc_receptor}</rfc_receptor>
    <fecha>${d.fecha}</fecha>
    <folio>${d.folio}</folio>
    <concepto>${d.concepto}</concepto>
    <monto>${d.monto}</monto>
    <iva>${d.iva}</iva>
    <total>${d.total}</total>
</factura>`;
    }
}

// 📄 PDF PRO
class FacturaPDF extends FacturaDecorator {
    generar() {
        const d = super.generar();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.text("FACTURA", 85, 15);

        doc.setFontSize(10);

        // Emisor
        doc.text("EMISOR:", 10, 25);
        doc.text(d.emisor, 10, 30);
        doc.text("RFC: " + d.rfc_emisor, 10, 35);

        // Receptor
        doc.text("RECEPTOR:", 10, 45);
        doc.text(d.receptor, 10, 50);
        doc.text("RFC: " + d.rfc_receptor, 10, 55);

        // Datos
        doc.text("Folio: " + d.folio, 140, 25);
        doc.text("Fecha: " + d.fecha, 140, 30);

        doc.line(10, 65, 200, 65);

        // Concepto tipo tabla
        doc.text("Concepto", 10, 75);
        doc.text("Monto", 150, 75);

        doc.text(d.concepto, 10, 85);
        doc.text("$" + d.monto, 150, 85);

        doc.line(10, 90, 200, 90);

        // Totales
        doc.text("IVA (16%): $" + d.iva.toFixed(2), 140, 100);
        doc.text("TOTAL: $" + d.total.toFixed(2), 140, 110);

        doc.save("factura.pdf");
    }
}

// 📥 DESCARGA
function descargarArchivo(contenido, nombre, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    a.click();

    URL.revokeObjectURL(url);
}

// 🚀 FUNCIÓN PRINCIPAL (TU FUNCIÓN PERO MEJORADA)
function generarFactura(tipo) {

    const datos = {
        emisor: "Empresa Demo S.A. de C.V.",
        rfc_emisor: "DEM010203ABC",
        receptor: document.getElementById("nombre_" + tipo)?.value || "Cliente General",
        rfc_receptor: "XAXX010101000",
        fecha: new Date().toLocaleString(),
        folio: Math.floor(Math.random() * 10000),
        concepto: "Servicio de desarrollo web",
        monto: parseFloat(document.getElementById("monto_" + tipo)?.value) || Math.floor(Math.random() * 1000)
    };

    // Cálculos
    datos.iva = datos.monto * 0.16;
    datos.total = datos.monto + datos.iva;

    // 🎯 FACTURA BASE
    let factura = new Factura(datos);

    // 🎯 DECORADOR (EL CORAZÓN DE TU PROYECTO)
    if (tipo === "json") {
        factura = new FacturaJSON(factura);
        descargarArchivo(factura.generar(), "factura.json", "application/json");
    }

    else if (tipo === "xml") {
        factura = new FacturaXML(factura);
        descargarArchivo(factura.generar(), "factura.xml", "application/xml");
    }

    else if (tipo === "pdf") {
        factura = new FacturaPDF(factura);
        factura.generar(); // descarga directa
    }
}


//QUE ES 
class FacturaBridge {
    constructor(datos, generador) {
        this.datos = datos;
        this.generador = generador; // 🔥 aquí está el bridge
    }

    generar() {
        this.generador.generar(this.datos);
    }
}

//FUNCION
function generarFacturaBridge(tipo) {

    const datos = {
        receptor: "Cliente Bridge",
        total: Math.floor(Math.random() * 1000)
    };

    let generador;

    if (tipo === "json") generador = new GeneradorJSON();
    if (tipo === "xml") generador = new GeneradorXML();
    if (tipo === "pdf") generador = new GeneradorPDF();

    const factura = new FacturaBridge(datos, generador);
    factura.generar();
}
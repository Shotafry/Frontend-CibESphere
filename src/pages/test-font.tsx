import React from 'react';

const TestFont: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 400 }}>
      Satoshi Regular - font-weight: 400
    </h1>
    <p style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 400, fontSize: '1.2rem' }}>
      Este texto está en Satoshi Regular (400). Si ves este texto con la fuente Satoshi, la fuente Regular está cargada.
    </p>
    <h1 style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 700 }}>
      Satoshi Bold - font-weight: 700
    </h1>
    <p style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
      Este texto está en Satoshi Bold (700). Si ves este texto con la fuente Satoshi en negrita, la fuente Bold está cargada.
    </p>
    {/* Ejemplo para Medium si lo tienes */}
    <h1 style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 500 }}>
      Satoshi Medium - font-weight: 500
    </h1>
    <p style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 500, fontSize: '1.2rem' }}>
      Este texto está en Satoshi Medium (500). Si ves este texto con la fuente Satoshi Medium, la fuente está cargada.
    </p>
    {/* Ejemplo para Black si lo tienes */}
    <h1 style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 900 }}>
      Satoshi Black - font-weight: 900
    </h1>
    <p style={{ fontFamily: 'Satoshi, Arial, Helvetica, sans-serif', fontWeight: 900, fontSize: '1.2rem' }}>
      Este texto está en Satoshi Black (900). Si ves este texto con la fuente Satoshi Black, la fuente está cargada.
    </p>
    <hr />
    <h1 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 400 }}>
      Arial Regular - font-weight: 400
    </h1>
    <p style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 400, fontSize: '1.2rem' }}>
      Este texto está en Arial Regular (400) como comparación.
    </p>
    <h1 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700 }}>
      Arial Bold - font-weight: 700
    </h1>
    <p style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
      Este texto está en Arial Bold (700) como comparación.
    </p>
    <hr />
    <p style={{ color: 'red', fontWeight: 'bold' }}>
      Página test-font cargada correctamente. Compara los estilos arriba para verificar la fuente Satoshi.
    </p>
  </div>
);

export default TestFont;

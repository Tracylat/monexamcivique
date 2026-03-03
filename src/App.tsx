import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function StaticHtmlPage({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      title={src}
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        border: '0',
        background: '#fff',
      }}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StaticHtmlPage src="/design/index.html" />} />
        <Route path="/login" element={<StaticHtmlPage src="/design/inscription.html" />} />
        <Route path="/choice" element={<StaticHtmlPage src="/design/inscription.html" />} />
        <Route path="/checkout" element={<StaticHtmlPage src="/design/inscription.html" />} />
        <Route path="/app/free" element={<StaticHtmlPage src="/design/test.html" />} />
        <Route path="/app" element={<StaticHtmlPage src="/design/app.html" />} />
        <Route path="/espace" element={<StaticHtmlPage src="/design/app.html" />} />
        <Route path="/dashboard" element={<StaticHtmlPage src="/design/app.html" />} />
        <Route path="/admin/quiz" element={<StaticHtmlPage src="/design/app.html" />} />
        <Route path="/admin/questions" element={<StaticHtmlPage src="/design/app.html" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

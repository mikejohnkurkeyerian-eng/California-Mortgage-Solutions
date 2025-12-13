// Safe Mode Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div style={{ padding: 20, border: '5px solid red' }}>
          <h1>SAFE MODE ACTIVE</h1>
          {children}
        </div>
      </body>
    </html>
  );
}


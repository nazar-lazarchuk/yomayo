import jsx from 'yomayo/jsx';

export default ({ App }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <title>Yomayo example</title>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}

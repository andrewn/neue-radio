module.exports.html = body => `
<head>
  <style>
    body {
      font-family: sans-serif;
    }

    .item {
      display: flex;
      flex-direction: column;

      margin: 0.5rem 0;
      padding: 1rem;

      cursor: pointer;
      background-color: #EEE;
      transition: background-color 1s ease-out;
    }

    .item h3 {
      margin: 0 0 1rem 0
    }

    .item input[type=text] {
      margin: 1rem 0;
      padding: 0.5rem;
      font-size: 1.3rem;
    }

    .item.is-copied {
      background-color: rgba(255, 255, 0, 0.5);
    }

    .copy {
      font-size: 0.7rem;
      font-weight: bold;
    }

    .copy .done,
    .is-copied .copy .do {
      display: none;
    }

    .copy .do,
    .is-copied .copy .done {
      display: block;
    }
  </style>
</head>

<body>
${body}
<script>
  function copyText(evt) {
    const container = evt.target.closest('.item');

    // Only respond to clicks on items or their children
    if (!container) {
      return;
    }

    const input = container.querySelector('input');
    input.select();
    document.execCommand('copy');

    container.classList.add('is-copied');

    setTimeout(
      () => container.classList.remove('is-copied'),
      2000
    )
  }

  document.querySelector('body')
    .addEventListener('click', copyText, true);
</script>
</body>
`;

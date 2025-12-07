module.exports = {
    theme: {
      extend: {
        padding: {
          'safe': 'env(safe-area-inset-top, 80px)', // funciona em mobile também
        },
        spacing: {
          'header': '80px', // você pode usar pt-header depois
        }
      }
    }
  }
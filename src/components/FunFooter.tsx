export function FunFooter() {
  const messages = [
    'Feito com 💔 por alguém que deveria estar dormindo',
    'Este site não coleta seus dados. Até porque seus dados são boring.',
    'Se você leu até aqui, parabéns. Você tem tempo livre DEMAIS.',
    'X LARP - Exponto a timeline desde ontem',
    'Apoie este projeto: me segue no X e finja que se importa',
    '0% arrependimento. 100% código legado.',
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-message">{message}</p>
        <div className="footer-links">
          <a href="https://github.com/MCookinho/x-larp" target="_blank" rel="noopener noreferrer">
            🐙 GitHub
          </a>
          <span className="footer-sep">|</span>
          <span>🎭 X LARP v1.0</span>
          <span className="footer-sep">|</span>
          <span>🏴‍☠️ Não leve a sério</span>
        </div>
      </div>
    </footer>
  );
}

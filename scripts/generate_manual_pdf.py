import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return  # Capa sem rodapé

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Cabeçalho das páginas internas
        self.drawString(36, 810, "KRUUJ | PROCESSO 001 — MANUAL DE DESENVOLVIMENTO DE JOGOS")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 804, 559, 804)

        # Rodapé
        page_text = f"KRUUJ-PROC-001 • v1.1 • Página {self._pageNumber} de {page_count}"
        self.drawRightString(559, 25, page_text)
        self.line(36, 35, 559, 35)
        self.restoreState()

def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    c_primary = colors.HexColor("#6366f1")
    c_dark = colors.HexColor("#0f172a")
    c_text = colors.HexColor("#334155")
    c_bg_box = colors.HexColor("#f1f5f9")
    c_gold = colors.HexColor("#d97706")

    title_cover = ParagraphStyle('CoverTitle', fontName='Helvetica-Bold', fontSize=24, leading=30, textColor=c_dark, alignment=1)
    sub_cover = ParagraphStyle('CoverSub', fontName='Helvetica', fontSize=13, leading=18, textColor=c_primary, alignment=1)
    tag_cover = ParagraphStyle('CoverTag', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=c_primary, alignment=1)
    meta_cover = ParagraphStyle('CoverMeta', fontName='Helvetica', fontSize=9, leading=14, textColor=colors.HexColor("#64748b"), alignment=1)

    h1 = ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=c_primary, spaceBefore=12, spaceAfter=5, keepWithNext=True)
    h2 = ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=c_dark, spaceBefore=8, spaceAfter=4, keepWithNext=True)
    body = ParagraphStyle('Body', fontName='Helvetica', fontSize=8.5, leading=12, textColor=c_text, spaceAfter=4)
    body_bold = ParagraphStyle('BodyBold', fontName='Helvetica-Bold', fontSize=8.5, leading=12, textColor=c_dark, spaceAfter=4)
    bullet = ParagraphStyle('Bullet', fontName='Helvetica', fontSize=8.5, leading=12, textColor=c_text, spaceAfter=3, leftIndent=12)
    code = ParagraphStyle('Code', fontName='Courier', fontSize=7.5, leading=9.5, textColor=c_dark, backColor=c_bg_box, spaceBefore=3, spaceAfter=4, leftIndent=8)

    callout = ParagraphStyle(
        'Callout', fontName='Helvetica-Bold', fontSize=8.5, leading=12.5,
        textColor=colors.HexColor("#4338ca"), backColor=colors.HexColor("#eef2ff"),
        borderPadding=6, spaceBefore=5, spaceAfter=6
    )

    story = []

    # ==========================================
    # PÁGINA 1: CAPA
    # ==========================================
    story.append(Spacer(1, 160))
    story.append(Paragraph("PROCESSO 001", tag_cover))
    story.append(Spacer(1, 15))
    story.append(Paragraph("MANUAL DE DESENVOLVIMENTO<br/>E PUBLICAÇÃO DE JOGOS", title_cover))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Padrões Oficiais para HTML5, Unity e Godot<br/>Integração KRUUJ SDK & Poki Standard", sub_cover))
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i>Da ideia à publicação: um processo para produzir rápido,<br/>sem abrir mão da qualidade e segurança Kruuj.</i>", meta_cover))
    story.append(Spacer(1, 180))
    story.append(Paragraph("Versão 1.1 | Outubro de 2026 | Kruuj Studio & Desenvolvedores Externos", meta_cover))
    story.append(PageBreak())

    # ==========================================
    # PÁGINA 2: SEÇÕES 1, 2, 3, 4
    # ==========================================
    story.append(Paragraph("1. Propósito e regra central", h1))
    story.append(Paragraph(
        "Este manual estabelece o processo oficial para conceber, desenvolver, testar, empacotar e publicar jogos na plataforma Kruuj. "
        "Seu objetivo é aumentar a velocidade de produção sem sacrificar estabilidade, qualidade visual, experiência mobile, segurança ou reputação da plataforma.",
        body
    ))
    story.append(Paragraph(
        "REGRA DE OURO: nenhum jogo entra em produção pública apenas porque “abre” ou porque o desenvolvimento parece concluído. "
        "Todo jogo deve passar pelo checklist de qualidade, funcionar nos dispositivos-alvo, ter uma versão identificável e ser aprovado pelo validador automático (check-game.js).",
        callout
    ))
    story.append(Paragraph("O processo vale inicialmente para jogos produzidos pela Kruuj Studio e será a base de adaptação futura para estúdios parceiros e Kruuj Students.", body))

    story.append(Paragraph("2. Escopo e princípios", h1))
    story.append(Paragraph("• <b>Priorizar jogos que iniciem rapidamente</b>, sejam compreensíveis sem explicação longa e tenham um ciclo de jogo claro.", bullet))
    story.append(Paragraph("• <b>Projetar para navegador desde o início</b>; mobile não é uma adaptação opcional feita no fim.", bullet))
    story.append(Paragraph("• <b>Manter cada jogo isolado</b>: erros, áudio, estado ou CSS de um jogo não devem quebrar a plataforma nem outros jogos.", bullet))
    story.append(Paragraph("• <b>Preferir escopo pequeno e finalizado</b> a muitos jogos publicados com defeitos.", bullet))
    story.append(Paragraph("• <b>Não publicar código/build sem responsável</b>, versão, instruções de controle, thumbnail e testes registrados.", bullet))
    story.append(Paragraph("• <b>Usar bibliotecas, imagens, fontes, músicas e efeitos sonoros</b> com licença compatível e documentada (LICENSES.md).", bullet))

    story.append(Paragraph("3. Fluxo oficial de produção", h1))
    story.append(Paragraph("<b>P0 — Proposta:</b> Registrar nome provisório, gênero, público, mecânica principal, diferencial, referência visual e estimativa de escopo. Confirmar que a ideia é suficientemente distinta e viável.", bullet))
    story.append(Paragraph("<b>P1 — Mini-GDD e escopo:</b> Definir core loop, condição de vitória/derrota, controles, duração típica, progressão, telas necessárias e o que fica fora da primeira versão.", bullet))
    story.append(Paragraph("<b>P2 — Protótipo jogável:</b> Validar a mecânica central com arte provisória. O objetivo é provar diversão e viabilidade, não polir.", bullet))
    story.append(Paragraph("<b>P3 — Vertical slice:</b> Produzir um trecho representativo com arte, áudio, interface, controles, carregamento e desempenho próximos do final.", bullet))
    story.append(Paragraph("<b>P4 — Produção:</b> Construir conteúdo restante, menus, pausa/reinício, estados de vitória/derrota, tratamento de erros e ajustes de acessibilidade.", bullet))
    story.append(Paragraph("<b>P5 — QA interno:</b> Executar testes funcionais, responsividade, compatibilidade, performance, áudio, segurança e regressão. Registrar bugs.", bullet))
    story.append(Paragraph("<b>P6 — Candidato a release (RC):</b> Congelar escopo, atribuir versão, gerar build limpa e executar checklist final em desktop e mobile.", bullet))
    story.append(Paragraph("<b>P7 — Publicação controlada:</b> Publicar primeiro em ambiente de teste/staging ou em acesso limitado. Confirmar telemetria básica e ausência de falhas críticas.", bullet))
    story.append(Paragraph("<b>P8 — Release e monitoramento:</b> Publicar para todos, registrar versão e data, monitorar erros/feedback e manter plano de rollback.", bullet))

    story.append(Paragraph("4. Documento mínimo de cada jogo", h1))
    story.append(Paragraph("Cada jogo deve ter uma página de projeto no Notion ou documentação equivalente com os seguintes itens:", body))
    story.append(Paragraph("• ID único (ex.: KJ-001), nome, responsável e estado atual.", bullet))
    story.append(Paragraph("• Mini-GDD: conceito, público, core loop, controles, condições de vitória/derrota e duração esperada.", bullet))
    story.append(Paragraph("• Plataformas suportadas, orientação preferida, navegadores-alvo e requisitos mínimos.", bullet))
    story.append(Paragraph("• Lista de funcionalidades incluídas e explicitamente excluídas do MVP do jogo.", bullet))
    story.append(Paragraph("• Inventário de assets e licenças/fontes (LICENSES.md).", bullet))
    story.append(Paragraph("• Link do repositório, instruções para executar localmente e procedimento de build/exportação (README.md).", bullet))
    story.append(Paragraph("• Versão atual, changelog, bugs conhecidos e resultado do último QA.", bullet))
    story.append(Paragraph("• Thumbnail, ícone, título público, descrição curta e instruções de controle.", bullet))

    story.append(PageBreak())

    # ==========================================
    # PÁGINA 3: SEÇÃO 5 (HTML5 REQUISITOS)
    # ==========================================
    story.append(Paragraph("5. Requisitos gerais para jogos HTML5", h1))

    story.append(Paragraph("5.1 Estrutura e inicialização", h2))
    story.append(Paragraph("• O jogo deve abrir por uma URL de staging e funcionar por HTTPS no ambiente final.", bullet))
    story.append(Paragraph("• Entregar uma build autocontida e reproduzível; não depender de caminhos locais, arquivos do computador do desenvolvedor (file://, C:\\, localhost) ou servidores temporários.", bullet))
    story.append(Paragraph("• Usar caminhos relativos para assets; verificar maiúsculas/minúsculas nos nomes dos arquivos (servidores Linux são case-sensitive).", bullet))
    story.append(Paragraph("• Não iniciar áudio automaticamente antes de uma interação do usuário. Exibir botão/ação clara para começar e habilitar áudio.", bullet))
    story.append(Paragraph("• Mostrar estado de carregamento quando houver download/preparação perceptível; evitar telas de loading que nunca terminam.", bullet))
    story.append(Paragraph("• Se algum recurso essencial falhar, apresentar mensagem recuperável em vez de tela branca.", bullet))

    story.append(Paragraph("5.2 Arquitetura e isolamento", h2))
    story.append(Paragraph("• Todo o conteúdo do jogo deve ficar dentro do contêiner/player definido pela plataforma (iframe).", bullet))
    story.append(Paragraph("• Evitar CSS global que afete a página hospedeira; prefixar classes ou usar módulos/escopo.", bullet))
    story.append(Paragraph("• Não sobrescrever window/document handlers da plataforma sem necessidade. Remover listeners e timers ao encerrar/reiniciar cenas.", bullet))
    story.append(Paragraph("• <b>Não usar eval</b>, new Function, document.write, scripts remotos desconhecidos ou dependências sem avaliação.", bullet))
    story.append(Paragraph("• Proibido uso de diálogos nativos bloqueantes (alert, confirm, prompt) que travam o loop do navegador mobile.", bullet))
    story.append(Paragraph("• Não manipular ou redirecionar a janela hospedeira (window.parent.location ou window.top.location).", bullet))
    story.append(Paragraph("• Não armazenar dados pessoais desnecessários. Qualquer analytics deve seguir a política de privacidade da plataforma (LGPD).", bullet))

    story.append(Paragraph("5.3 Performance e Limites Numéricos", h2))
    story.append(Paragraph("• Carregar primeiro o essencial e adiar recursos não necessários ao início.", bullet))
    story.append(Paragraph("• Comprimir imagens e áudio; usar formatos modernos (WebP, MP3 128kbps, OGG) e manter fallback quando necessário.", bullet))
    story.append(Paragraph("• Evitar loops de jogo que criem objetos, listeners ou elementos DOM a cada frame sem limpeza.", bullet))
    story.append(Paragraph("• Controlar partículas, física, animações e efeitos para dispositivos de menor desempenho.", bullet))
    story.append(Paragraph("• Usar delta time ou mecanismo equivalente para que a simulação não dependa de FPS fixo.", bullet))
    story.append(Paragraph("• Monitorar consumo de memória, travamentos e tempo de carregamento em dispositivo real.", bullet))

    # Tabela de limites
    table_limits = [
        ["Recurso / Métrica", "Limite Recomendado", "Teto Máximo Homologado"],
        ["Peso Total do Pacote", "Até 10 MB", "18 MB (HTML5) / 25 MB (Unity/Godot)"],
        ["Imagens Individuais", "Até 250 KB (WebP)", "500 KB"],
        ["Áudios Individuais", "Até 800 KB (mp3/ogg)", "1.5 MB (proibido .wav sem compressão)"],
        ["Tempo de Loading (C2P)", "Menor que 2.5s", "4.0s (em redes 4G)"]
    ]
    t_lim = Table(table_limits, colWidths=[180, 160, 183])
    t_lim.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('BOTTOMPADDING', (0,0), (-1,0), 4),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
    ]))
    story.append(Spacer(1, 3))
    story.append(t_lim)

    story.append(Paragraph("5.4 Controles e UX", h2))
    story.append(Paragraph("• Exibir controles na tela inicial ou em uma dica curta dentro do jogo.", bullet))
    story.append(Paragraph("• Oferecer teclado e mouse quando fizer sentido; jogos de toque devem ter controles touch reais, não apenas teclas simuladas.", bullet))
    story.append(Paragraph("• Botões touch devem ser grandes (mínimo 44x44px), separados e posicionados fora das áreas cobertas pelos dedos; evitar depender de hover.", bullet))
    story.append(Paragraph("• Respeitar safe areas em celulares com notch e manter botões importantes afastados das bordas.", bullet))
    story.append(Paragraph("• <b>Zona Livre do Botão Poki (Mobile):</b> No celular, o portal KRUUJ projeta um botão flutuante de saída no canto superior esquerdo (top: 14px, left: 16px). Elementos do HUD devem manter recuo seguro de <b>68px</b> desse canto.", bullet))

    story.append(Paragraph("5.5 Responsividade mobile", h2))
    story.append(Paragraph("• Tag viewport obrigatória: &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no\"&gt;", code))
    story.append(Paragraph("• Bloqueio de rolagem acidental no CSS: * { touch-action: none; -webkit-touch-callout: none; user-select: none; }", code))
    story.append(Paragraph("• Usar layout fluido e escala proporcional; evitar dimensões fixas que cortem HUD, menus ou botões.", bullet))
    story.append(Paragraph("• Testar telas estreitas, telas altas, mudança de orientação e teclado virtual.", bullet))

    story.append(Paragraph("5.6 Áudio e acessibilidade", h2))
    story.append(Paragraph("• Disponibilizar controle de volume e opção de silenciar quando houver áudio contínuo.", bullet))
    story.append(Paragraph("• Respeitar as restrições de autoplay dos navegadores (áudio só inicia após toque/clique voluntário).", bullet))
    story.append(Paragraph("• Não comunicar estado somente por som; usar também sinais visuais.", bullet))
    story.append(Paragraph("• Manter contraste suficiente, legibilidade e evitar flashes rápidos.", bullet))

    story.append(PageBreak())

    # ==========================================
    # PÁGINA 4: SEÇÃO 6 & 7 (PACOTE, UNITY E GODOT)
    # ==========================================
    story.append(Paragraph("6. Padrão de pacote HTML5", h1))
    story.append(Paragraph("A entrega deve conter, no mínimo, um pacote organizado e uma instrução de execução:", body))
    pkg_str = """game-kj-001/
  index.html        # Ponto de entrada obrigatório
  README.md         # Nome/ID, versão, controles, orientação, como executar
  CHANGELOG.md      # Histórico de alterações e correções
  LICENSES.md       # Assets, dependências de terceiros e licenças
  assets/           # Pasta de imagens, áudio e fontes (se não inline)
    images/
    audio/
    fonts/
  src/              # Código-fonte (se houver processo de build)"""
    story.append(Paragraph(pkg_str.replace('\n', '<br/>').replace(' ', '&nbsp;'), code))

    story.append(Paragraph("7. Regras para engines: Unity e Godot", h1))

    story.append(Paragraph("7.1 Quando usar Unity", h2))
    story.append(Paragraph("Use Unity quando o jogo justificar o peso e a complexidade da engine: 3D, física/sistemas mais elaborados, ferramentas específicas ou uma equipe já produtiva nela. Para um microgame 2D simples, compare o custo de build, carregamento e manutenção antes de escolher.", body))
    story.append(Paragraph("• Exportar para Web/WebGL usando uma versão LTS aprovada pela equipe, sempre que possível.", bullet))
    story.append(Paragraph("• Configurar canvas/resolução para adaptar-se ao contêiner e evitar dimensões fixas que cortem a interface.", bullet))
    story.append(Paragraph("• Testar compressão, memória, tamanho de build e tempo de carregamento; builds Unity podem ser muito maiores que HTML5 leve.", bullet))
    story.append(Paragraph("• Validar teclado, mouse e touch em dispositivos reais; não assumir que uma interação feita para desktop funcionará no celular.", bullet))
    story.append(Paragraph("• Não depender de funcionalidades nativas que não existam no build Web.", bullet))
    story.append(Paragraph("• Entregar os arquivos completos exportados, instruções de build, versão da Unity e projeto-fonte no repositório.", bullet))

    story.append(Paragraph("7.2 Quando usar Godot", h2))
    story.append(Paragraph("Godot é uma opção para jogos 2D e 3D quando a equipe deseja uma engine integrada e fluxo de exportação web. A escolha entre renderer, versão e recursos deve ser validada com um protótipo cedo, antes de investir no jogo inteiro.", body))
    story.append(Paragraph("• Exportar para Web com templates correspondentes à versão usada e documentar a versão exata do Godot.", bullet))
    story.append(Paragraph("• Testar a build em HTTPS e nos navegadores-alvo; verificar requisitos de threading/headers se o projeto depender deles.", bullet))
    story.append(Paragraph("• Preferir recursos e plugins comprovadamente compatíveis com exportação web.", bullet))
    story.append(Paragraph("• Conferir carregamento de fontes, áudio, input, resolução, fullscreen e retorno ao foco depois de trocar de aba.", bullet))
    story.append(Paragraph("• Entregar projeto-fonte, exportação completa, instruções e lista de plugins/add-ons com licenças.", bullet))

    story.append(Paragraph("7.3 Regra comum para Unity/Godot", h2))
    story.append(Paragraph(
        "A engine não é aprovação automática. A build exportada precisa cumprir os mesmos critérios de qualidade, "
        "responsividade, desempenho, segurança e integração de qualquer jogo HTML5.",
        callout
    ))
    story.append(Paragraph("• Não enviar apenas o executável de Windows/macOS/Linux; a entrega principal para a plataforma deve ser a versão web acordada.", bullet))
    story.append(Paragraph("• Não publicar build de desenvolvimento com console, overlays, debug menus ou logs sensíveis.", bullet))
    story.append(Paragraph("• Testar no domínio/ambiente de staging da Kruuj, pois comportamento local pode diferir do servidor.", bullet))
    story.append(Paragraph("• Se o jogo não atingir o desempenho ou o tempo de carregamento aceitável, otimizar ou reavaliar a engine/escopo.", bullet))

    story.append(PageBreak())

    # ==========================================
    # PÁGINA 5: SEÇÃO 8 & 9 (SDK E QA CHECKLIST)
    # ==========================================
    story.append(Paragraph("8. Integração com a plataforma Kruuj (KRUUJ SDK)", h1))
    story.append(Paragraph(
        "O <b>KRUUJ SDK</b> é o canal oficial de comunicação entre o jogo e o portal. "
        "Ele é <b>100% retrocompatível com a API da Poki (window.PokiSDK = window.KruujSDK)</b>.",
        body
    ))
    story.append(Paragraph("<b>Inclusão no index.html:</b> &lt;script src=\"/sdk/v1/kruuj-sdk.js\"&gt;&lt;/script&gt;", code))

    story.append(Paragraph("<b>Ciclo de Vida Obrigatório em Código:</b>", h2))
    story.append(Paragraph("1. Inicialização e Fim de Loading: KruujSDK.init().then(() =&gt; KruujSDK.gameLoadingFinished());", code))
    story.append(Paragraph("2. Início de Partida Ativa (clique em Jogar): KruujSDK.gameplayStart();", code))
    story.append(Paragraph("3. Pausa, Game Over ou Retorno ao Menu: KruujSDK.gameplayStop();", code))
    story.append(Paragraph("4. (Opcional) Comerciais / Rewarded Ads: KruujSDK.commercialBreak(); ou KruujSDK.rewardedBreak();", code))

    story.append(Paragraph("9. QA: checklist obrigatório", h1))

    story.append(Paragraph("9.1 Funcional", h2))
    story.append(Paragraph("[  ] O jogo abre e chega ao menu/início sem erro.", bullet))
    story.append(Paragraph("[  ] Todos os controles principais funcionam.", bullet))
    story.append(Paragraph("[  ] Regras, pontuação, vitória/derrota e reinício funcionam.", bullet))
    story.append(Paragraph("[  ] Não há softlocks, telas vazias ou caminhos sem saída.", bullet))
    story.append(Paragraph("[  ] Pause/resume e mudança de aba não quebram o jogo.", bullet))
    story.append(Paragraph("[  ] Links e botões fazem o que prometem.", bullet))

    story.append(Paragraph("9.2 Desktop", h2))
    story.append(Paragraph("[  ] Testado em navegador Chromium (Chrome/Edge/Opera).", bullet))
    story.append(Paragraph("[  ] Testado em Firefox ou outro segundo navegador.", bullet))
    story.append(Paragraph("[  ] Resolução pequena e grande verificadas.", bullet))
    story.append(Paragraph("[  ] Teclado, mouse, fullscreen e áudio verificados.", bullet))

    story.append(Paragraph("9.3 Mobile", h2))
    story.append(Paragraph("[  ] Testado em pelo menos um aparelho Android real e iPhone/iPad real.", bullet))
    story.append(Paragraph("[  ] Orientação e rotação comportam-se corretamente.", bullet))
    story.append(Paragraph("[  ] Botões e controles podem ser usados sem toques acidentais.", bullet))
    story.append(Paragraph("[  ] HUD, menus e telas finais não ficam cortados.", bullet))
    story.append(Paragraph("[  ] Não há scroll/zoom involuntário durante a jogabilidade.", bullet))
    story.append(Paragraph("[  ] Performance e aquecimento/bateria são aceitáveis para a duração prevista.", bullet))

    story.append(Paragraph("9.4 Qualidade e release", h2))
    story.append(Paragraph("[  ] Sem bugs críticos ou altos abertos.", bullet))
    story.append(Paragraph("[  ] Sem assets ausentes, erros repetidos no console ou áudio quebrado.", bullet))
    story.append(Paragraph("[  ] Tempo de carregamento e tamanho da build registrados e dentro dos limites.", bullet))
    story.append(Paragraph("[  ] Thumbnail, ícone, título, descrição e controles estão prontos.", bullet))
    story.append(Paragraph("[  ] Licenças de assets e dependências foram verificadas.", bullet))
    story.append(Paragraph("[  ] Versão, changelog, build e responsável estão registrados.", bullet))
    story.append(Paragraph("[  ] Build final foi testada no staging da Kruuj e validada pelo check-game.js.", bullet))

    story.append(PageBreak())

    # ==========================================
    # PÁGINA 6: SEÇÕES 10, 11, 12, 13
    # ==========================================
    story.append(Paragraph("10. Severidade de bugs e bloqueio de publicação", h1))
    t_bugs_data = [
        ["Severidade", "Exemplos", "Regra de Bloqueio"],
        ["S0 — Crítico", "Não abre, trava, crash, vazamento de janela, risco de segurança, eval()", "Bloqueia release; corrigir imediatamente"],
        ["S1 — Alto", "Progressão impossível, controles essenciais falham, mobile inutilizável, zoom quebrado", "Bloqueia release"],
        ["S2 — Médio", "Bug contornável, UI parcialmente ruim, áudio secundário falha, evento de SDK ausente", "Corrigir antes do release, salvo exceção"],
        ["S3 — Baixo", "Detalhe visual, texto menor, melhoria não essencial, README ausente", "Pode entrar no backlog com prazo"]
    ]
    t_bugs = Table(t_bugs_data, colWidths=[95, 260, 168])
    t_bugs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
    ]))
    story.append(t_bugs)
    story.append(Paragraph("<i>Qualquer exceção a S1/S2 deve ser aprovada pelo responsável do produto e documentada com impacto e workaround.</i>", meta_cover))

    story.append(Paragraph("11. Versionamento, publicação e rollback", h1))
    story.append(Paragraph("• Usar versionamento semântico: MAJOR.MINOR.PATCH (ex.: 1.2.0).", bullet))
    story.append(Paragraph("• Manter changelog com mudanças, correções e problemas conhecidos.", bullet))
    story.append(Paragraph("• Não sobrescrever silenciosamente uma build publicada sem registrar a versão.", bullet))
    story.append(Paragraph("• Guardar a última build estável para rollback imediato.", bullet))
    story.append(Paragraph("• Após publicar, fazer smoke test no site real: abrir, iniciar, jogar, pausar/reiniciar e sair.", bullet))

    story.append(Paragraph("12. Publicação: ficha de submissão", h1))
    sub_checks = [
        "[  ] ID e nome do jogo definidos.",
        "[  ] Responsável e contato interno definidos.",
        "[  ] Build web completa anexada ou vinculada.",
        "[  ] Link do repositório e instruções de build disponíveis.",
        "[  ] Thumbnail/ícone no padrão da plataforma.",
        "[  ] Descrição curta e controles revisados.",
        "[  ] Plataformas e orientação declaradas.",
        "[  ] Checklist QA preenchido com data e testador.",
        "[  ] Lista de bugs conhecidos aprovada.",
        "[  ] Direitos e licenças verificados.",
        "[  ] Versão e changelog preenchidos.",
        "[  ] Aprovação final registrada via validador automático (check-game.js)."
    ]
    for sc in sub_checks:
        story.append(Paragraph(sc, bullet))

    story.append(Paragraph("13. Responsabilidades e aprovação", h1))
    t_roles_data = [
        ["Papel", "Responsabilidade"],
        ["Game Developer", "Implementar, manter build, corrigir bugs, documentar e executar testes locais com o validador."],
        ["QA / Testador", "Executar checklist independente, registrar passos para reproduzir e classificar severidade."],
        ["Responsável pelo jogo", "Confirmar escopo, conteúdo, qualidade final e materiais de publicação."],
        ["Responsável pela plataforma", "Validar integração, comportamento no player/staging, conformidade com SDK e segurança."],
        ["Release owner", "Autorizar publicação, registrar versão e garantir rollback disponível."]
    ]
    t_roles = Table(t_roles_data, colWidths=[120, 403])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
    ]))
    story.append(t_roles)

    story.append(PageBreak())

    # ==========================================
    # PÁGINA 7: SEÇÕES 14, 15, 16, 17
    # ==========================================
    story.append(Paragraph("14. Métricas de qualidade", h1))
    story.append(Paragraph("Começar com poucas métricas e registrar dados por jogo:", body))
    story.append(Paragraph("• Taxa de sucesso de carregamento.", bullet))
    story.append(Paragraph("• Tempo de carregamento percebido.", bullet))
    story.append(Paragraph("• Erros/crashes reportados.", bullet))
    story.append(Paragraph("• Percentual de sessões mobile sem falhas.", bullet))
    story.append(Paragraph("• Taxa de conclusão ou duração da sessão.", bullet))
    story.append(Paragraph("• Feedback dos jogadores e bugs por versão.", bullet))

    story.append(Paragraph("15. Processo para parceiros e Kruuj Students", h1))
    story.append(Paragraph("• Enviar o Kruuj Game Standard antes de iniciar a integração.", bullet))
    story.append(Paragraph("• Solicitar build web, fonte/projeto conforme o acordo, instruções e lista de dependências.", bullet))
    story.append(Paragraph("• Exigir declaração de autoria e comprovação de direitos sobre assets e música.", bullet))
    story.append(Paragraph("• Não prometer publicação automática: toda submissão passa por avaliação técnica e editorial.", bullet))
    story.append(Paragraph("• Definir por contrato propriedade intelectual, licença de distribuição, remuneração e suporte.", bullet))
    story.append(Paragraph("• Estudantes devem ter autorização para publicar trabalhos acadêmicos e assets de terceiros.", bullet))

    story.append(Paragraph("16. Template de relatório de QA", h1))
    qa_template = """JOGO / ID: 
VERSÃO:             BUILD / URL: 
DATA:               TESTADO POR: 
DISPOSITIVOS / NAVEGADORES: 
RESULTADO: [ ] APROVADO    [ ] REPROVADO    [ ] APROVADO COM PENDÊNCIAS
[ ] Funcional       [ ] Desktop      [ ] Mobile real      [ ] Performance/Áudio
BUGS ENCONTRADOS:
- ID / Severidade:
- Passos para reproduzir:
- Resultado esperado vs observado:
DECISÃO FINAL / RESPONSÁVEL:"""
    story.append(Paragraph(qa_template.replace('\n', '<br/>').replace(' ', '&nbsp;'), code))

    story.append(Paragraph("17. Definition of Done — quando um jogo está pronto", h1))
    dod_items = [
        "[  ] A experiência principal está completa e sem bugs S0/S1.",
        "[  ] Os requisitos S2 foram corrigidos ou têm exceção formal aprovada.",
        "[  ] O jogo obtém o status APROVADO no validador check-game.js.",
        "[  ] A build web funciona no staging da Kruuj.",
        "[  ] Desktop e mobile foram testados conforme o público-alvo.",
        "[  ] Carregamento, responsividade, controles, áudio e telas finais foram verificados.",
        "[  ] README, changelog, versão e links técnicos estão atualizados.",
        "[  ] Assets e dependências têm licença compatível.",
        "[  ] Thumbnail, descrição e controles estão prontos.",
        "[  ] QA foi registrado e a aprovação final foi dada.",
        "[  ] Existe uma build estável anterior ou plano de rollback."
    ]
    for dod in dod_items:
        story.append(Paragraph(dod, bullet))

    story.append(PageBreak())

    # ==========================================
    # PÁGINA 8: SEÇÃO 18 E 19 (CONTROLE E VALIDADOR)
    # ==========================================
    story.append(Paragraph("18. Controle do documento", h1))
    t_ctrl_data = [
        ["Campo", "Valor"],
        ["Documento", "KRUUJ-PROC-001 — Manual de Desenvolvimento e Publicação de Jogos"],
        ["Versão", "1.1"],
        ["Status", "Processo oficial consolidado com Kruuj SDK e Validação Automatizada"],
        ["Responsável", "Kruuj Studio / Liderança do Projeto"],
        ["Aplicação", "Jogos HTML5 e jogos exportados para Web por Unity/Godot"],
        ["Revisão sugerida", "Após os primeiros 3 jogos publicados e depois a cada mudança no pipeline"]
    ]
    t_ctrl = Table(t_ctrl_data, colWidths=[120, 403])
    t_ctrl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")])
    ]))
    story.append(t_ctrl)

    story.append(Spacer(1, 10))
    story.append(Paragraph("19. Anexo Técnico: Como Executar o Validador de Jogos", h1))
    story.append(Paragraph(
        "A plataforma KRUUJ disponibiliza a ferramenta automatizada <code>check-game.js</code> "
        "para que qualquer estúdio parceiro ou desenvolvedor interno valide seu jogo em segundos.",
        body
    ))

    story.append(Paragraph("Desenvolvedor Externo (Execução Local via CMD):", h2))
    story.append(Paragraph("node check-game.js ./pasta-do-seu-jogo", code))

    story.append(Paragraph("Desenvolvedor Interno (Monorepo KRUUJ):", h2))
    story.append(Paragraph("npm run check:game &lt;slug-do-jogo&gt;<br/>npm run check:games # Valida todos os jogos do catálogo", code))

    story.append(Paragraph(
        "O validador checa: integridade de index.html, caminhos absolutos, isolamento, "
        "bloqueio de eval/alert, viewport mobile blindado, touch-action: none, autoplay de áudio, "
        "chamadas do Kruuj SDK (loadingFinished, gameplayStart, gameplayStop) e limites de peso.",
        body
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF completo e multipágina gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "../knowledge/KRUUJ_PROCESSO_001_Manual_Atualizado.pdf")
    build_pdf(os.path.abspath(out))

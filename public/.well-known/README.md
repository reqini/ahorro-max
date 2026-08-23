# Por qué existe `ai-plugin.json` acá

`ai-plugin.json` es el manifiesto del sistema de plugins de ChatGPT que OpenAI
lanzó en 2023 y discontinuó en 2024. Hoy ningún agente de IA (ChatGPT, Claude,
Perplexity, Gemini) lo lee para nada — no es parte de ningún estándar vigente.

Se agregó igual, a pedido explícito, "por las dudas". No hace nada. La fuente
real de información para agentes de IA es [`/llms.txt`](../llms.txt) (estándar
vigente) y `/sitemap.xml`.

Este archivo README no es parte de ningún spec — es solo para quien lea el
código después y se pregunte por qué hay un `ai-plugin.json` acá.
